// @flow

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const teachingUnitsDB = new Datastore({filename: 'teachingUnits.json', autoload: true});
const usersDB = new Datastore({filename: 'users.json', autoload: true});

app.disable('x-powered-by');
app.use(bodyParser.json());

/** Reset database modifications */
app.get('/reset', (req, res) => {
  teachingUnitsDB.update({}, {$unset: {users: true}}, {multi: true}, err => {
    if (err) {
      return res.status(500).json(err);
    }
    teachingUnitsDB.persistence.compactDatafile();

    res.json({status: 'ok'});
  });
});

/** Allow CORS */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Check if the user exists
app.use((req, res, next) => {
  req.userId = 'ABCDEFGHIJ';
  usersDB.findOne({_id: req.userId}, (err, doc) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (doc === null) {
      // res.status(400).json({
      //   message: 'Utilisateur inconnu'
      // });
    } else {
      next();
    }

    next(); // NOTE: remove this
  });
});

/** GET all teaching units */
app.get('/teachingunits', (req, res) => {
  teachingUnitsDB.find({}, (err, docs) => {
    if (err) {
      return res.status(500).json(err);
    }

    const defaultVolume = {
      CM: 0,
      TD: 0,
      TP: 0
    };

    const teachingUnits = docs.map(doc => {
      let userVolume;
      if (doc.users && doc.users[req.userId]) {
        userVolume = doc.users[req.userId];

        // Remove the current user from the list
        delete doc.users[req.userId];
      } else {
        userVolume = defaultVolume;
      }

      return {
        _id: doc._id,
        parent: doc.parent,
        degree: doc.degree,
        semester: doc.semester,
        label: doc.label,
        volume: doc.volume,
        users: doc.users,
        userVolume
      };
    });

    res.json(teachingUnits);
  });
});

/** Add user data to the teaching unit */
app.post('/teachingunits/:id', (req, res) => {
  const tuId = req.params.id;
  const data = req.body;
  const updateData = {$set: {}};
  updateData.$set[`users.${req.userId}`] = data.volume;

  teachingUnitsDB.update({_id: tuId}, updateData, err => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(202).end();
  });
});

/** Start the server */
app.listen(3300, () => console.log('Listening..'));
