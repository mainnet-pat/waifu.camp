const fs = require("fs");
const path = require("path");
const express = require('express');
const app = express();

app.use(express.static('dist'));

const index = fs.readFileSync(path.join(__dirname, '/dist/index.html')).toString();

app.get('/waifu/:tokenId', (req, res) => {
  const tokenId = req.params.tokenId;
  const replaced = index.replace(/"(https:\/\/waifu\.camp\/camp\.jpg)"/g, `"https://icons.waifufaucet.com/original/${tokenId}.png"`);
  res.send(replaced);
});

app.get('*', (req, res) => {
  res.send(index);
});

const server = app.listen(8080);