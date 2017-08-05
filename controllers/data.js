// dependency packages
var exec = require('child_process').exec,
    fs = require('fs');

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
            var error_info = logger.logError(module_name, 'NOBODY', 'No Data', 'saveConnectionData');
            return res.send(error_info);
        }
        // initialize path of log files according to date
        var now = new Date(),
            file_name = req.body.module + '_' + appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate());
        var json_data = [];
        fs.readFile(data_file_path + '/' + file_name + '.json', 'utf8', function (err, data) {
            if (err != null && err.code != "ENOENT") {
                var error_info = logger.logError(module_name, err.code, 'Could not Read File', err);
                return res.send(error_info);
            }
            if (data != null && data != '') {
                try{
                    json_data = JSON.parse(data);
                }
                catch (err) {
                    var error_info = logger.logError(module_name, err.code, 'Improper Data Format', err);
                    return res.send(error_info);
                }
            }
            if (req.body.mode == 'Disconnected') {
                setTimeout(function() {
                    checkConnection();
                }, parseInt(process.env.DELAY_BETWEEN_CHECKS));
            }
            else {
                exec('netsh wlan show interfaces | findstr /r "^....SSID"', function (err, stdout, stderr) {
                    if (!err && (stderr == null || stderr == "")) {
                        if (stdout.length != 0 && stdout.indexOf(":") != -1) {
                            var start = stdout.indexOf(":") + 2;
                            var end = stdout.indexOf('\r');
                            var ssid = stdout.slice(start, end);
                            
                            req.body.network = ssid;
                            req.body.createdAt = now.getTime();
                            json_data.push(req.body);
                            fs.writeFile(data_file_path + '/' + file_name + '.json', JSON.stringify(json_data), 'utf8', function (err) {
                                if (err) {
                                    var error_info = logger.logError(module_name, err.code, 'Could not Write to File', err);
                                    return res.send(error_info);      
                                }
                                var log_info = logger.logInfo(module_name, 'Last Saved Data', req.body);
                                res.send(log_info);
                            });
                        }
                        else {
                            var error_info = logger.logError(module_name, 'ENOENT', 'SSID Empty', stdout);
                            return res.send(error_info);
                        }
                    }
                    else {
                        if (err){
                            var error_info = logger.logError(module_name, err.code, 'SSID Exec Error', err);
                            return res.send(error_info);
                        }
                        else {
                            var error_info = logger.logError(module_name, 'STDERR', 'SSID Exec Error', stderr);
                            return res.send(error_info);
                        }
                    }
                });
            }
        });
    },

    loadLast200Data: function(req, res) {
        console.log(new Date().toISOString() + ': ' + '/POST /loadlast200data');
        logger.logInfo(module_name, '/POST /loadLast200Data');

        if (!req.body || req.body == '') {
            return res.send({
                message: "Improper /POST request",
                status: 500
            });
        }

        // initialize path of log files according to date
        var now = new Date(),
            file_name = req.body.module + '_' + appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate());
        var json_data = [];            
        fs.readFile(data_file_path + '/' + file_name + '.json', 'utf8', function (err, data) {
            if (err != null && err.code != "ENOENT") {
                var error_info = logger.logError(module_name, err.code, 'Could not Read File', err);
                return res.send(error_info);
            }
            if (data != null && data != '') {
                try{
                    json_data = JSON.parse(data);
                }
                catch (err) {
                    var error_info = logger.logError(module_name, err.code, 'Improper Data Format', err);
                    return res.send(error_info);
                }
            }

            var data = [];

            for (var i = 0; i < json_data.length; i++ ) {
                if (json_data[i].mode != 'Disconnected' && json_data[i].network.indexOf(process.env.NETWORK_TO_CONNECT) != -1) {
                    data.push(json_data[i]);
                }
            }

            var len = data.length;

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
