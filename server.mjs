import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import WebTorrent from 'webtorrent';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(`./client/build`));
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.json({
    msg: 'app start - OK',
  });
});

app.get('/', (req, res) => {
  res.sendFile(`./client/build/index.html`);
});

/* WebTorrent logic */

const client = new WebTorrent();

let errorMessage = '';

client.on('error', error => {
  errorMessage = error.message;
});

let stats = {
  progress: 0,
  downloadSpeed: 0,
  ratio: 0,
};

client.on('download', function(bytes) {
  stats = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio,
  };
});

app.post('/addtorrent', (req, res) => {
  const magnet = req.body.value;

  // if (!magnet.match(/magnet:\?xt=urn:[a-z0-9]{20,50}/)) {
  //   console.log('not a magnet');
  //
  //   res.json({
  //     msg: 'Неверный формат magnet ссылки',
  //   });
  // }

  client.add(magnet, torrent => {
    let files = [];

    torrent.files.forEach(data => {
      files.push({
        name: data.name,
        length: data.length,
      });
    });

    res.json({
      status: 200,
      msg: 'OK',
      files: files,
    });
  });
});

app.get('/status', (req, res) => {
  console.log(stats);

  res.json({
    status: 200,
    msg: 'OK',
    stats,
  });
});

app.get('/stream', (req, res) => {
  console.log(req.headers);

  let range = req.headers.range;

  let file = client.torrents[0].files[0];

  console.log(file);

  if (!range) {
    console.log('range error');
  }

  let positions = range.replace(/bytes=/, '').split('-');
  let start = parseInt(positions[0], 10);
  let file_size = file.length;
  let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
  let chunksize = end - start + 1;

  let head = {
    'Content-Range': 'bytes ' + start + '-' + end + '/' + file_size,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, head);
  let stream_position = {
    start: start,
    end: end,
  };

  let stream = file.createReadStream(stream_position);

  stream.pipe(res);

  stream.on('error', function(err) {
    console.log(err);
  });
});

app.listen(port, () => {
  console.log(`app start - OK on port ${port}`);
});
