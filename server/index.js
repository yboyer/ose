// @flow

const express = require('express');
const app = express();
const Datastore = require('nedb');
const db = new Datastore({filename: 'data.json', autoload: true});

/**
 * Allow CORS
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get('/teachingunits', (req, res) => {
  db.find({}, (err, docs) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(docs);
  });
});

app.listen(3300, () => console.log('Listening..'));
