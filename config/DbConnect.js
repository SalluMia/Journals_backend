const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.info('Successfully connected with DATABASE.'))
        .catch((Error) => console.info('Unable to establish connection with database.', Error));
};