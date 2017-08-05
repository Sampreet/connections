// web server
var express = require('express'),
    app = express(),
    router = express.Router();

// dependency services
var bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    ejs = require('ejs'),
    fs = require('fs'),
    path = require('path');

// paths to local directories
var asset_path = './assets',
    controller_path = './controllers',
    data_path = './data',
    helper_path = './helpers',
    log_path = './logs',
    public_path = './public';

// required constants
const env_file = './.env',
    module_name = 'App';

// local services
var logger = require(helper_path + '/logger');

// controllers for requests
var apiController = require(controller_path + '/api'),
    viewController = require(controller_path + '/view'),
    dataController = require(controller_path + '/data');

// function to exit proces after logging error
function errorExit(error_type, message, object) {
    console.log(result);
    logger.logError(module_name, error_type, message, object);
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
mkdirpSync(asset_path);
mkdirpSync(log_path);
mkdirpSync(data_path);

// create a data file if file does not exist
function appendZeros(number) {
    return ((number<10 ? '0' : '') + number).toString();
}
var now = new Date(),
    file_name = appendZeros(now.getFullYear()) + appendZeros(now.getMonth()+1) + appendZeros(now.getDate());
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

// configure app properties
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    type: 'application/json'
}));

// GET/POST methods
app.get('/', viewController.getHome);
app.get('/about', viewController.getAbout);
app.get('/cmonitor', viewController.getCMonitor);

app.post('/saveconnectiondata', dataController.saveConnectionData);
app.post('/loadlast200data', dataController.loadLast200Data);

app.get('/checkconnection', apiController.checkConnection);

// listen for http connections
app.listen(process.env.PORT, function(){
    // on listening
    console.log(process.env.APP_NAME + ' live at port ' + process.env.PORT);
});