# Connections

> Your personal connection analyzer.

## Overview of the Application

***Connections*** checks your connected network in regular intervals and stores the network connection statistics locally. It also features APIs to visualize the collected information.

### C Monitor

The **C Monitor** API monitors the network to which the computer is connected and estimates the bandwidth used by it.

## Local Development

### Installing Node.js

#### Linux Installation

Linux users can follow [this guide](https://github.com/Sampreet/ubuntu-install-guides/blob/master/language/nodejs.md) to install Node.js and NPM via NVM.

#### Windows Installation

The Windows installer files are available for download from the [Node.js website](http://nodejs.org/) and installs Node.js and NPM with just a few clicks.

### Setting up *Connections*

To install all dependencies, open terminal/cmd and run:
```
npm install
```

In the ```.env``` file, add the following line:
```
NETWORK_TO_MONITOR=<network_name>
```

Replace ```<network_name>``` with the name of the network connection you intend to monitor.

To start the application, run:
```
npm start
```

Once started, navigate to ```http://127.0.0.1:8000``` to open the required module in any browser of choice.


### Structure of the Repository

```sh
├── apis/               # various apis used
├── assets/             # temporary files and images
├── controllers/        # GET/POST method controllers
├── data/               # data stored daily
├── helpers/            # helper modules
├── models/             # sample database models
├── logs/               # log files for all modules
├── public/             # publicly available files
├── services/           # service modules for notification
├── resources/          # configuration files
├── test/               # scripts to test the application
├── views/              # the webpages and partial templates
├── .env                # environment variables file
└── App.js              # master node script
```