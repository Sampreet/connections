// dependency packages
var fs = require('fs'),
    request = require('request');

// local services
var logger = require('../helpers/logger');

// append zeros before numbers less than 10
function appendZeros(number) {
    return ((number<10 ? '0' : '') + number).toString();
}

// paths to local files
var result_page = 'pages/result',
    data_file_path = 'data',
    result_template = 'partials/result';

// variables used in this module
var google_search_url = 'http://www.google.com',
    module_name = 'apiController';

// export functions
module.exports = {
    /**
    * function to check the connection status
    * @method checkConnection
    * @param req {Object} IncomingMessage object
    * @param res {Object} ServerResponse object
    **/
    checkConnection: function(req, res) {
      console.log(new Date().toISOString() + ': ' + '/GET /checkconnection');
      logger.logInfo(module_name, '/GET /checkconnection');

      var now = new Date();
      var requestedAt = now.getTime();

      var options = {
        url: google_search_url,
        headers: {}
      }
      // request call takes in the url and returns control to callback function with error, response and the html
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
              return res.send(connection);
              break;

            default:
              connection.mode = 'No internet';
              logger.logInfo(module_name, connection.mode, connection.object);
              console.log(new Date().toISOString() + ': INFO: ' + module_name + ': ' + connection.mode + ': ' + connection.code);
              return res.send(connection);
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
          return res.send(connection);
        }


        if (error) {
          if(error.code == 'ENOENT') {
            var error_info = logger.logError(module_name, error.code, 'Disconnected', error.syscall);
            return res.send(error_info);
          } 
          else {
            var error_info = logger.logError(module_name, error.code, 'No Internet', error.syscall);
            return res.send(error_info);
          }
        }
        else {
          var log_info = logger.logInfo(module_name, 'Connected', response.statusCode);
          return res.send(log_info);
        }
      });
    }
}
