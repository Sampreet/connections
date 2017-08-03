// dependency imports
var ejs = require('ejs');

// local services
var logger = require('../helpers/logger');

// paths to local files
var about_page = 'pages/about',
    api_template = 'pages/api_template',
    home_page = 'pages/home';

// variables used in this module
var module_name = 'viewController';

// export functions
module.exports = {
    /**
    * function to get the home page
    * @method getHome
    * @param req {Object} IncomingMessage object
    * @param res {Object} ServerResponse object
    **/
    getHome: function(req, res) {
        console.log(new Date().toISOString() + ': ' + '/GET /');
        logger.logInfo(module_name, '/GET /');
        var options = {
            app_name: process.env.APP_NAME,
            title: 'Home | ' + process.env.APP_NAME,
            heading: 'Welcome to ' + process.env.APP_NAME,
            sub_heading: process.env.APP_DESCRIPTION,
            apis: [
                {
                    "name": "cMonitor",
                    "href": "/cmonitor",
                    "button_text": "C Monitor"
                }
            ],
            services: []
        }
        res.render(home_page, options);
    },    
    /**
    * function to get the about page
    * @method getAbout
    * @param req {Object} IncomingMessage object
    * @param res {Object} ServerResponse object
    **/
    getAbout: function(req, res) {
        console.log(new Date().toISOString() + ': ' + '/GET /about');
        logger.logInfo(module_name, '/GET /about');
        var options = {
            app_name: process.env.APP_NAME,
            title: 'About | ' + process.env.APP_NAME,
            heading: 'Welcome to ' + process.env.APP_NAME,
            sub_heading: process.env.APP_DESCRIPTION,
        }
        res.render(about_page, options);
    },

    /**
     * function to get the connection monitor page
     * @method getConnectionMonitor
     * @param req {Object} IncomingMessage object
     * @param res {Object} ServerResponse object
     */
    getCMonitor: function(req, res) {
        console.log(new Date().toISOString() + ': ' + '/GET /cmonitor');
        logger.logInfo(module_name, '/GET /cmonitor');
        var options = {
            app_name: process.env.APP_NAME,
            title: 'C Monitor | ' + process.env.APP_NAME,
            heading: 'C Monitor',
            sub_heading: 'Monitor your personal internet connection.',
            api_name: 'cMonitor'
        }
        res.render(api_template, options);
    }

}
