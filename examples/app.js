const express = require('express');
const { chaos } = require('..');

const app = express();
const port = 3000;

app.use(
  chaos({
    probability: 50,
    maxDelay: 10000,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
