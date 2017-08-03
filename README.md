# Connections

> Your personal connection analyzer

***Connections*** checks your connected network in regular intervals and stores the network connection statistics locally. It also features APIs to visualize the collected information.

## Local Development

### Installing Node.js

#### Linux Installation

Linux users can follow [this guide](https://github.com/Sampreet/ubuntu-install-guides/blob/master/language/nodejs.md) to install Node.js and NPM via NVM.

#### Windows Installation

The Windows installer files are available for download from the [Node.js website](http://blog.teamtreehouse.com/install-node-js-npm-windows) and installs Node.js and NPM with just a few clicks.

### Setting up *Connections*

To install all dependencies, run:
```
npm install
```

To start the application, run:
```
npm start
```
### Structure of the Repository

```sh
├── apis/               # various apis used
├── assets/             # temporary files and images
├── controllers/        # GET/POST method controllers
├── helpers/            # helper modules
├── models/             # sample database models
├── logs/               # log files for all modules
├── public/             # publicly available files
├── services/           # service modules for notification
├── resources/          # configuration files
├── views/              # the webpages and partial templates
├── .env                # environment variables file
└── App.js              # master node script
```