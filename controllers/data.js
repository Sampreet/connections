// dependency packages
var fs = require('fs');

// local services
var logger = require('../helpers/logger');

// append zeros before numbers less than 10
function appendZeros(number) {
    return ((number<10 ? '0' : '') + number).toString();
}

// paths to local files
var result_template = 'partials/result',
    data_file_path = 'data';

// variables used in this module
var module_name = 'dataController';

// export functions
module.exports = {
    /**
    * function to save the connection data obtained
    * @method saveConnectionData
    * @param req {Object} IncomingMessage object
    * @param req.body.query_text {String} The search string
    * @param res {Object} ServerResponse object
    **/
    saveConnectionData: function(req, res) {
        console.log(new Date().toISOString() + ': ' + '/POST /saveconnectiondata');
        logger.logInfo(module_name, '/POST /saveconnectiondata', req.body);
        if(!req.body || req.body == '') {
            // display the error message template in case of empty query
            var error_info = logger.logError(module_name, 'No Data', 'NOBODY', 'saveConnectionData');
            return res.send(error_info);
        }
        // initialize path of log files according to date
        var now = new Date(),
            file_name = appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate());
        var json_data = [];
        fs.readFile(data_file_path + '/' + file_name + '.json', 'utf8', function (err, data) {
            if (err != null && err.code != "ENOENT") {
                var error_info = logger.logError(module_name, 'Could not Read File', err.code, err);
                return res.send(error_info);
            }
            if (data != null && data != '') {
                try{
                    json_data = JSON.parse(data);
                }
                catch (err) {
                    var error_info = logger.logError(module_name, 'Improper Data Format', err.code, err);
                    return res.send(error_info);
                }
            }
            req.body.createdAt = now.getTime();
            json_data.push(req.body);
            fs.writeFile(data_file_path + '/' + file_name + '.json', JSON.stringify(json_data), 'utf8', function (err) {
                if (err) {
                    var error_info = logger.logError(module_name, 'Could not Write to File', err.code, err);
                    return res.send(error_info);      
                }
                var log_info = logger.logInfo(module_name, 'Last Saved Data', req.body);
                res.send(log_info);
            });
        });
    },

    loadLast200Data: function(req, res) {
        console.log(new Date().toISOString() + ': ' + '/GET /loadconnectiondata');
        logger.logInfo(module_name, '/GET /loadconnectiondata');

        // initialize path of log files according to date
        var now = new Date(),
            file_name = appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate());
            
        fs.readFile(data_file_path + '/' + file_name + '.json', 'utf8', function (err, data) {
            if (err != null && err.code != "ENOENT") {
                var error_info = logger.logError(module_name, 'Could not Read File', err.code, err);
                return res.send(error_info);
            }
            if (data != null && data != '') {
                try{
                    json_data = JSON.parse(data);
                }
                catch (err) {
                    var error_info = logger.logError(module_name, 'Improper Data Format', err.code, err);
                    return res.send(error_info);
                }
            }
            var len = json_data.length;
            if(len > 200) {
                json_data.splice(0, len-200);
            }
            res.send({
                data: json_data,
                status: 200
            });
        });
    }
}
