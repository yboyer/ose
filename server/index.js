// @flow

const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const teachingUnitsDB = new Datastore({filename: 'teachingUnits.json', autoload: true});
const UserManager = require('./UserManager');

// Config
const cookieName = 'OSE';
const sessionOption = {
  name: 'OSESession',
  secret: '4q8MuaA6e1UR10uK',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({
    path: path.join(__dirname, 'sessions')
  }),
  cookie: {}
};

const staticOptions = {};
if (app.get('env') === 'production') {
  staticOptions.maxAge = '1h';
  sessionOption.cookie.secure = true; // HTTPS
}

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(session(sessionOption));

/** Reset database modifications */
app.get('/reset', (req, res) => {
  teachingUnitsDB.update({}, {$unset: {users: true}}, {multi: true}, err => {
    if (err) {
      return res.status(500).json(err);
    }
    teachingUnitsDB.persistence.compactDatafile();
    UserManager.db.persistence.compactDatafile();

    res.json({status: 'ok'});
  });
});

/** Add an user in database */
app.get('/add_user', (req, res) => {
  const data = {
    _id: req.query.login,
    firstName: req.query.firstName,
    lastName: req.query.lastName
  };

  if (data._id && data.firstName && data.lastName) {
    UserManager.add(data).then(upsert => {
      res.status(upsert ? 201 : 202).json({
        message: `${data._id} added.`,
        data
      });
    }).catch(err => {
      return res.status(500).json(err);
    });
  } else {
    res.status(400).json({
      message: 'Données incorrectes'
    });
  }
});

/** Signin process */
app.get('/login/:id', (req, res) => {
  req.session.login = req.params.id;
  res.redirect('/');
});

/** Logout process */
app.get('/logout', (req, res) => {
  res.clearCookie(cookieName);
  req.session.destroy(() => {
    res.json({
      message: `Disconnected`
    });
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
  req.userId = req.session.login;

  const user = UserManager.users[req.userId];
  if (user === undefined) {
    res.status(400).json({
      message: 'Utilisateur inconnu'
    });
  } else {
    res.cookie(cookieName, new Buffer(JSON.stringify({
      firstName: encodeURIComponent(user.firstName),
      lastName: encodeURIComponent(user.lastName)
    })).toString('base64'));

    next();
  }
});

/** Serve static files */
app.use(express.static(path.join(__dirname, '../client/.tmp'), staticOptions));
app.use(express.static(path.join(__dirname, '../client/src'), staticOptions));
app.use(express.static(path.join(__dirname, '../client/dist'), staticOptions));

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

    const teachingUnits = docs.map(tu => {
      let userVolume;
      if (tu.users && tu.users[req.userId]) {
        userVolume = tu.users[req.userId];

        // Remove the logged user from the users' list
        delete tu.users[req.userId];
      } else {
        userVolume = defaultVolume;
      }

      // Retrieve user firstName and lastName
      const users = [];
      if (tu.users) {
        for (const key in tu.users) {
          if (tu.users.hasOwnProperty(key)) {
            const user = UserManager.users[key];
            users.push({
              firstName: user.firstName,
              lastName: user.lastName,
              volume: tu.users[key]
            });
          }
        }
      }

      return {
        _id: tu._id,
        parent: tu.parent,
        degree: tu.degree,
        semester: tu.semester,
        label: tu.label,
        volume: tu.volume,
        users,
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
  const updateData = {};
  const unset = !(data.volume.CM + data.volume.TD + data.volume.TP);

  if (unset) {
    updateData.$unset = {};
    updateData.$unset[`users.${req.userId}`] = true;
  } else {
    updateData.$set = {};
    updateData.$set[`users.${req.userId}`] = data.volume;
  }

  // Update the teaching unit with user data
  teachingUnitsDB.update({_id: tuId}, updateData, err => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(202).end();
  });
});

/** Start the server */
app.listen(3300, () => console.log('Listening..'));
