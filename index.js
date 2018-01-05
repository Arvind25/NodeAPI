// Root path
global.APP_ROOT_PATH = __dirname + '/app/';
// Set other app paths
require('./config/global-paths');
// Set config variables
global.config = require('./config');
//create an expresss app
const express = require('express');
const app = express();

//include other depencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require(APP_ROUTE_PATH);
const ValidationManager = require(APP_MANAGER_PATH + 'validation');
const authManager = require(APP_MANAGER_PATH + 'auth');
const validationManager = new ValidationManager();

// Connect to DB
mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };
mongoose.connect(config.db.MONGO_CONNECT_URL, options)
    .then(
        () => console.log('Successfully connected to Database <mongo>') ,
        err => console.log('Database <mongo> connection Failed') 
);
//mongoose.connect(config.db.MONGO_CONNECT_URL,options);
// Use json formatter middleware
app.use(bodyParser.json());
app.use(authManager.providePassport().initialize());
// Set Up validation middleware
app.use(validationManager.provideDefaultValidator());

// Setup routes
app.use('/', routes);

app.listen(global.config.server.PORT, function () {
    console.log('App is running on ' + global.config.server.PORT);
});