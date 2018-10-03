import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import WebTorrent from 'webtorrent';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(`./client/build`));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(`./client/build/index.html`);
});

/* WebTorrent logic */

let client;

let errorMessage = '';

let stats = {
  progress: 0,
  downloadSpeed: 0,
};

app.post('/addtorrent', (req, res) => {
  const magnet = req.body.value;

  console.log(magnet);

  client = new WebTorrent();

  client.on('error', error => {
    errorMessage = error.message;
  });

  client.on('download', () => {
    stats = {
      progress: ((client.progress * 100 * 100) / 100).toFixed(0),
      downloadSpeed: client.downloadSpeed,
    };
  });

  client.add(magnet, torrent => {
    let files = [];

    if (torrent.progress === 1) {
      stats = {
        progress: 100,
        downloadSpeed: 0,
      };
    }

    torrent.files.forEach(data => {
      files.push({
        name: data.name,
        length: data.length,
      });
    });

    console.log('ADD SUCCESS');

    res.json({
      status: 200,
      msg: 'OK',
      files: files,
      torrents: client.torrents.length,
    });
  });
});

app.get('/removetorrent', (req, res) => {
  if (client) {
    client.destroy(() => {
      stats = {
        progress: 0,
        downloadSpeed: 0,
      };

      res.json({
        status: 200,
        msg: 'removed - OK',
        remove: true,
      });
    });
  } else {
    res.json({
      status: 200,
      msg: 'client not exist',
      remove: false,
    });
  }
});

app.get('/status', (req, res) => {
  res.json({
    status: 200,
    msg: 'OK',
    stats,
  });
});

app.get('/stream', (req, res) => {
  let range = req.headers.range;

  console.log(range);

  let file = client.torrents[0].files[0];

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

  console.log(stream_position);

  stream.pipe(res);
});

app.listen(port, () => {
  console.log(`app start - OK on port ${port}`);
});
