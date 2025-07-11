const express = require('express');
const app = express();

app.get('/z', (req, res) => {
  res.send('Response from service Z');
});

app.listen(3002, () => {
  console.log('Service Z listening on port 3002');
});
