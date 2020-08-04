const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Signup
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 12).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({ message: 'user Added', result: result });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
    });
});

// Login
router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if(!user) {
            console.log('A');
            return res.status(401).json({ message: 'Authentication Not successfull 1' });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if(!result) {
            return res.status(401).json({ message: 'Authentication Not successfull 2' });
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, '6beef89fd7fe33b10f093e873517f2cd', { expiresIn: '1h' });
        res.status(200).json({
            token: token,
            expiresIn: 3600
        });
        res.status(200).json({ token: token });
    }).catch(err => {
        console.log('B');
        return res.status(401).json({ message: 'Authentication Not Successfull 3' });
    });
});
module.exports = router;