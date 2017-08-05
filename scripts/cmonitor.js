// import dependencies
var dotenv = require('dotenv'),
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  request = require('request');

// local services
var logger = require('../helpers/logger');

// paths to local files
var data_path = 'data';

// constants used in this module
const env_file = './.env',
  google_search_url = 'http://www.google.com',
  module_name = 'cmonitorScript';

// append zeros before numbers less than 10
function appendZeros(number) {
    return ((number<10 ? '0' : '') + number).toString();
}

// function to exit proces after logging error
function errorExit(type, message, object) {
    logger.logError(module_name, type, message, object);
    setTimeout(function(){
        process.exit(1);
    }, 50);
}

// function to create directories and subdirectories
function mkdirpSync (dir_path) {
    var parts = dir_path.split(path.sep);
    for (var i = 1; i <= parts.length; i++) {
        try {
            fs.mkdirSync(path.join.apply(null, parts.slice(0, i)));
        }
        catch (e) {
            if (e.code != 'EEXIST') {
                errorExit('folder', 'could not create folder', e);
            }
        }
    }
}

// create required directories
mkdirpSync(data_path);

var now = new Date(),
    file_name = 'cmonitor_' + appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate());
var json_data = [];
fs.readFile(data_path + '/' + file_name + '.json', 'utf8', function (err, data) {
    if (err != null && err.code == "ENOENT") {
        fs.writeFile(data_path + '/' + file_name + '.json', JSON.stringify(json_data), 'utf8', function (err) {
            if (err) {
                errorExit('data', 'could not create data file with current date', err);
            }
        });
    }
});

// load environmental variables
try {
    dotenv.load({
        path: env_file
    });
}
catch (e) {
    errorExit('dotenv', 'could not load environment variables', e);
}

function saveConnectionData(info) {
  // initialize path of log files according to date
  now = new Date();
  file_name = 'cmonitor_' + appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate()),
      json_data = [];

  fs.readFile(data_path + '/' + file_name + '.json', 'utf8', function (err, data) {
    if (err != null && err.code != "ENOENT") {
      errorExit(err.code, 'Could not Read File', err);
    }
    if (data != null && data != '') {
      try{
        json_data = JSON.parse(data);
      }
      catch (err) {
        errorExit(err.code, 'Improper Data Format', err);
      }
    }
    
    if (info.mode != 'Disconnected') {
      exec('netsh wlan show interfaces | findstr /r "^....SSID"', function (err, stdout, stderr) {
        if (!err && (stderr == null || stderr == "")) {
          if (stdout.length != 0 && stdout.indexOf(":") != -1) {
            var start = stdout.indexOf(":") + 2;
            var end = stdout.indexOf('\r');
            var ssid = stdout.slice(start, end);
                        
            info.network = ssid;
            info.createdAt = now.getTime();
            json_data.push(info);
            fs.writeFile(data_path + '/' + file_name + '.json', JSON.stringify(json_data), 'utf8', function (err) {
              if (err) {
                errorExit(err.code, 'Could not Write to File', err);
              }
              logger.logInfo(module_name, 'Last Saved Data', info);
              console.log(new Date().toISOString() + ': INFO: ' + module_name + ': Data saved successfully.');
            });
          }
          else {
            logger.logError(module_name, 'ENOENT', 'SSID Empty', stdout);
          }
        }
        else {
          if (err){
            logger.logError(module_name, err.code, 'SSID Exec Error', err);
          }
          else {
            logger.logError(module_name, 'STDERR', 'SSID Exec Error', stderr);
          }
        }
      });
    }
    setTimeout(function() {
      checkConnection();
    }, parseInt(process.env.DELAY_BETWEEN_CHECKS));
  });
}

function checkConnection() {
  now = new Date();
  var requestedAt = now.getTime();

  var options = {
    url: google_search_url,
    headers: {}
  }
  request(options, function(error, response, body) {
    var connection = {};
    connection.requestedAt = requestedAt;

    if (error) {
      connection.code = error.code;
      connection.object = error;
      switch (error.code) {
        case 'ENOENT':
          connection.mode = 'Disconnected';
          logger.logInfo(module_name, connection.mode, connection.object);
          console.log(new Date().toISOString() + ': INFO: ' + module_name + ': ' + connection.mode + ': ' + connection.code);
          return saveConnectionData(connection);
          break;

        default:
          connection.mode = 'No internet';
          logger.logInfo(module_name, connection.mode, connection.object);
          console.log(new Date().toISOString() + ': INFO: ' + module_name + ': ' + connection.mode + ': ' + connection.code);
          return saveConnectionData(connection);
          break;
      }
    }
    else {
      connection.mode = 'Connected';
      connection.code = response.statusMessage;
      connection.object = {
        statusCode: response.statusCode,
        statusMessage: response.statusMessage
      };
      logger.logInfo(module_name, 'Connected', response.statusCode);
      console.log(new Date().toISOString() + ': INFO: ' + module_name + ': ' + connection.mode + ': ' + connection.code);
      return saveConnectionData(connection);
    }
  });
}

console.log('C Monitor is running...');
checkConnection();
