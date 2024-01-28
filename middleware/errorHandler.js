const { constants } = require('../constants');
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.Validation_Failed:
            res.json({ title: "validation failed", message: err.message, stackTrace: err.stack });
            break;
        case constants.Not_Found:
            res.json({ title: "not found", message: err.message, stackTrace: err.stack });
            break;
        case constants.Unauthorized:
            res.json({ title: "unauthorized", message: err.message, stackTrace: err.stack });
            break;
        case constants.Forbidden:
            res.json({ title: "forbidden", message: err.message, stackTrace: err.stack });
            break;
        case constants.Server_Error:
            res.json({ title: "server error", message: err.message, stackTrace: err.stack });
            break;
        default:
            console.log("No error! all goode.")
            break;
    }
};
module.exports = errorHandler;