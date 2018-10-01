import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(`./client/build`));

app.get('/test', (req, res) => {
  res.json({
    msg: 'app start - OK',
  });
});

app.get('/', (req, res) => {
  res.sendFile(`./client/build/index.html`);
});

app.listen(port, () => {
  console.log(`app start - OK on port ${port}`);
});
