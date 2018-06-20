const express = require('express');
const app = express();
const fs = require('fs');
let result = null;

fs.readFile('./desclist.json', 'utf8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    result = data;
  }
});

app.get('/desclist', (req, res) => {
  console.log(req.name);
  if (result) {
    res.json(result);
    res.end();
  }
});

app.listen(7070, () => {
  console.log('server running at:7070');
});
