import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import WebTorrent from 'webtorrent';

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
  res.json({
    msg: req.body.value,
  });
});

app.listen(port, () => {
  console.log(`app start - OK on port ${port}`);
});
