const Datastore = require('nedb');

module.exports = new class {
  constructor() {
    this._db = new Datastore({filename: 'users.json', autoload: true});
    this._users = {};
    this.db.find({}, (err, docs) => {
      docs.forEach(doc => this.add(doc));
    });
  }

  get db() {
    return this._db;
  }

  get users() {
    return this._users;
  }

  add(data) {
    this._users[data._id] = data;

    return new Promise((resolve, reject) => {
      // Only insert if it doest not exists
      this.db.update(data, data, {upsert: true}, (err, numReplaced, upsert) => {
        if (err) {
          return reject(err);
        }
        resolve(upsert);
      });
    });
  }
}();
