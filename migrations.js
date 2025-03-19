var Migrations = require('migrations'),
    meta = {};

// Meta Storage has very basic interface:
var storage = {
    get: function (cb) {
        cb(null, meta);
    },
    set: function (value, cb) {
        meta = value;
        cb();
    },
};

module.exports = new Migrations({
    dir: __dirname + '/migrations',
    meta: storage, // custom storage
});

module.exports.run();