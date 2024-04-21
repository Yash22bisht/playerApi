const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./login');
const challengeRoutes = require('./challenge');
const dbRoutes = require('./db');
const checkRoutes = require('./check');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Assuming you're using EJS as your templating engine

// Connect to MongoDB


// Mount routes
app.use('/', loginRoutes);
app.use('/', challengeRoutes);

app.use('/', checkRoutes);
app.use('/', dbRoutes);





module.exports = app;
