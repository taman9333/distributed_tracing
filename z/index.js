require('./tracing');

const express = require('express');
const app = express();

let requestCount = 0;

app.get('/z', (req, res) => {
  requestCount++;

  if (requestCount % 10 === 0) {
    console.log('Failure, request count is: ', requestCount);
    res.status(500).send('500 Failure');
    return;
  }

  res.send('Response from service Z');
});

app.listen(3002, () => {
  console.log('Service Z listening on port 3002');
});
