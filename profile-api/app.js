const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouts = require('./api/routes/user');
const connstr = `mongodb+srv://arnab:${process.env.MONGO_ATLAS_PWD}@dev-yswu0.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(connstr,
    { useNewUrlParser: true, useUnifiedTopology: true })

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use((req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Header', '*');
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/users', userRouts);

app.use((req, resp, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use((err, req, resp, next) => {
    resp.status(err.status || 500);
    resp.json({
        error: {
            message: err.message
        }
    })
});

module.exports = app;