require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { postUrl, getUrl } = require('./urlController');
const app = express();
const bodyPasrser = require('body-parser')
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

//connecting to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB CONNECTED..");
  })
  .catch((err) => {
    console.log("DB connection failed");
  });

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',bodyPasrser.urlencoded({extended:true}),postUrl);
app.get('/api/shorturl/:shortUrlNum',getUrl);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
