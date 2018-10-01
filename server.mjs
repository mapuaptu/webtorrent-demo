import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import WebTorrent from 'webtorrent';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(`./client/build`));
app.use(morgan('combined'));
app.use(cors());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.json({
    msg: 'app start - OK',
  });
});

app.get('/', (req, res) => {
  res.sendFile(`./client/build/index.html`);
});

app.post('/webtorrent', (req, res) => {
  const magnet = req.body.value;

  const client = new WebTorrent();

  const newtorrent = client.add(magnet, torrent => {
    const file = torrent.files[0];

    file.createReadStream();
  });
});

app.listen(port, () => {
  console.log(`app start - OK on port ${port}`);
});
