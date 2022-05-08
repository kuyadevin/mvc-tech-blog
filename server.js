const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Set up session and connection to our sequelize db
const sess = {
    secret: 'Super secret secret',
    cookie: {
        // Session expires after 10 minutes
        maxAge: 600000,
        httpOnly: true,
        secure: false,
    },
    saveUninitialized: false,
    store: new SequelizeStore ({
        db: sequelize,
    }),
}; 