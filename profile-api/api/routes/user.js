const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');

router.get('/', (req, res, next) => {
    User.find()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(user => {
                    return formatUser(user);
                })
            }
            res.status(200).json(response);
        })
        .catch(err => res.status(500).json({ error: err }));
});

router.post('/', (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length > 0) {
                res.status(409).json({
                    message: "Mail exists"
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        }).save().
                            then(user => res.status(201).json(formatUser(user)).
                                catch(err => res.status(500).json(err)));
                    }
                });
            }
        });
});

router.get('/:userId', (req, res, next) => {
    User.findById({ _id: req.params.userId })
        .then(result => formatUser(200, res, result))
        .catch(err => res.status(500).json({ error: err }));
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => res.status(500).json({ error: err }));
});

router.patch('/:userId', (req, res, next) => {
    let user = new User();
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            user = new User({
                password: hash,
            });
            User.update({ _id: req.params.userId }, { $set: user })
                .then(result => {
                    res.status(200).json(formatUser(result));
                })
                .catch(err => res.status(500).json({ error: err }));
        }
    });
});

const formatUser = user => ({
    email: user.email,
    password: user.password,
    id: user._id,
});

module.exports = router;