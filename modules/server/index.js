#!/usr/bin/env node
require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/env'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
  ],
});

let { app, arranger, listen } = require('./src/index').default();
app.use(arranger);
listen();
