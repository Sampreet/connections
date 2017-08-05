// use winston logger
var winston = require('winston');

// append zeros before numbers less than 10
function appendZeros(number) {
    return ((number<10 ? '0' : '') + number).toString();
}

// initialize path of log files according to date
var now = new Date(),
    date = appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate()),
    info_log_file = './logs/' + date + '_info.log',
    error_log_file = './logs/' + date + '_error.log';

// define custom log format
function format(options) {
    return options.timestamp() + ': ' +
    options.level.toUpperCase() + ': ' +
    (options.message != undefined ? options.message: '') +
    (options.meta != undefined && Object.keys(options.meta).length !== 0 ? '\t'+ JSON.stringify(options.meta) : '');
}

// bind winston to log files
var logger = new (winston.Logger)({
    transports: [
        // bind console
        new (winston.transports.Console)({
            timestamp: function() {
                return new Date().toISOString();
            },
            level: 'error',
            formatter: format
        }),
        // bind info file
        new (winston.transports.File)({
            timestamp: function() {
                return new Date().toISOString();
            },
            name: 'info-log',
            filename: info_log_file,
            level: 'info',
            formatter: format,
            json: false
        }),
        // bind error file
        new (winston.transports.File)({
            timestamp: function() {
                return new Date().toISOString();
            },
            name: 'error-log',
            filename: error_log_file,
            level: 'error',
            formatter: format,
            json: false
        })
    ]
});

// export functions
module.exports = {
    /**
    * function for logging info
    * @method logInfo
    * @param module_name {String} Name of the calling module
    * @param message {String} Info message to log
    * @param object {Object} (optional) Object to log extra information
    * @return {Object} Object containing all the log information with status
    **/
    logInfo: function(module_name, message, object) {
        var res = {};
        res.app_name = process.env.APP_NAME,
        res.title = 'Result | ' + process.env.APP_NAME,
        res.heading = 'Result:',
        res.module_name = module_name;
        res.message = message;
        res.object = object;
        res.timestamp = new Date().toISOString();
        res.status = 200;
        logger.info(module_name + ': ' + message, object ? object : null);
        return res;
    },
    /**
    * function for logging error
    * @method logError
    * @param module_name {String} Name of the calling module
    * @param error_type {String} Part of the calling module
    * @param message {String} Error message
    * @param object {Object} (optional) Object to log extra error information
    * @return {Object} Object containing all the error information with status
    **/
    logError: function(module_name, type, message, object) {
        var res = {};
        res.app_name = process.env.APP_NAME,
        res.title = 'Result | ' + process.env.APP_NAME,
        res.heading = 'Result:',
        res.module_name = module_name;
        res.type = type;
        res.message = message;
        res.object = object;
        res.timestamp = new Date().toISOString();
        res.status = 500;
        logger.error(module_name + ': ' + type + ': ' + message + ': ', object ? object : null);
        return res;
    }
}
