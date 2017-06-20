const sqlite3 = require('sqlite3').verbose();
const dbName = 'tldr.sqlite';
const db = new sqlite3.Database(dbName);
const bcrypt = require('bcrypt');

db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users
        (id integer primary key autoincrement, 
        username VARCHAR NOT NULL, 
        pass CHAR(56),
        CONSTRAINT name_unique UNIQUE (username))
    `;
    db.run(sql);
});
class User {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    static all(cb) {
        db.all('SELECT * FROM users', cb);
    }

    static find(username, cb) {
        db.get('SELECT * FROM users WHERE username = ?', username, cb);
    }

    static create(data, cb) {
        const sql = 'INSERT INTO users(username, pass) values(?,?)';
        bcrypt.hash(data.pass, 12, function(err, hash) {
            // Store hash in your password DB.
            db.run(sql, data.username, hash, cb);
        });
        
    }

    /*hashPassword(cb) {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return cb(err);
            this.salt = salt;
            bcrypt.hash(this.pass, salt, (err, hash) => {
                if (err) return cb(err);
                this.pass = hash;
                cb();
            });
        });
    }*/
}

module.exports = db;
module.exports.User = User