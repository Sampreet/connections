# Connections

> Your personal connection analyzer for Windows users.

## Overview of the Application

***Connections*** checks your connected network in regular intervals and stores the network connection statistics locally. It also features APIs to visualize the collected information.

### C Monitor

The **C Monitor** API monitors the network to which the computer is connected and estimates the bandwidth used by it.

![C Monitor Screenshot](https://github.com/Sampreet/connections/tree/master/screenshots/cmonitor.png?raw=true "C Monitor")

## Development

### Installing Node.js

The Windows installation files are available for download from the [Node.js website](http://nodejs.org/) and installs Node.js and NPM with just a few clicks.

### Setting up *Connections*

[Download](https://github.com/Sampreet/connections/archive/master.zip) ```.zip``` and extract the contents to a folder. Press ```Win+R``` and execute ```cmd``` to open ```Command Prompt```. Once opened, navigate to the extracted directory using the following line:

```
cd <path_to_repository>
```

Replace ```<path_to_repository>``` with the location of the extracted folder, e.g., ```C:\Users\ExampleUser\Downloads\connections```, if ```ExampleUser``` extracted the downloaded file in the ```Downloads``` folder.

Once inside the folder, run the following command to install all dependencies for the project:

```
npm install
```

### Running *Connections*

In the ```.env``` file available inside the folder, edit the following lines:

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
├── screenshots/        # application screens for README
├── services/           # service modules for notification
├── resources/          # configuration files
├── test/               # scripts to test the application
├── views/              # the webpages and partial templates
├── .env                # environment variables file
├── .gitignore          # local temporary files to ignore
├── App.js              # master node script
├── package.json        # npm package descriptions
└── README.md           # description of the repository
```