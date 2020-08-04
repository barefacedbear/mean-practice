const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const postsApp = require('./routes/route');
const usersApp = require('./routes/user');

// Connecting app with mongodb, always replace 'test' in url with a database name
mongoose.connect('mongodb+srv://barefacedbear:zwEc9qGJXuiwo78O@training-2izn7.mongodb.net/blog-demo?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('connected');
})
.catch(() => {
    console.log('Connection failed to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: false }));
app.use('/images', express.static(path.join('backend/images')));
// Api for CORS to connect Angular with backend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 
    'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.use('/api/posts', postsApp);
app.use('/api/users',usersApp);

// Exporting the app to server.js
module.exports = app;