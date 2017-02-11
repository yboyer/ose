// @flow

const express = require('express');
const app = express();
const Datastore = require('nedb');
const db = new Datastore({filename: 'data.json', autoload: true});

// db.insert(require('../client/src/app/store/teachingUnits.json').teachingUnits);

app.get('/data', (req, res) => {
  db.find({}, (err, docs) => {
    res.json(docs);
  });
});

app.listen(3300, () => console.log('Listening..'));
