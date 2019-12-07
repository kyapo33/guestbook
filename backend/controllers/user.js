const express = require('express')
const controller = express.Router()
const _ = require('lodash');
const jwt = require("jsonwebtoken");
const nodeMailer = require('nodemailer');
require("dotenv").config();

const User = require('../models/user')

controller.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec()
        if(!user) {
            return res.status(400).json({
                error: 'Utilisateur non touvé'
            })   
        }
        req.profile = user;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Utilisateur non touvé'
        })  
    }
}

controller.read = (req, res) => {
    req.profile.hash_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

controller.update = async (req, res) => {
    let user = req.profile;
    user = _.extend(user, req.body); 
    try {
        await user.save()
            user.hashed_password = undefined;
            user.salt = undefined;
        return res.json(user);
    }
    catch (err) {
        return res.status(400).json({
            error: 'Changement impossible'
        });    
    }
};

module.exports = controller;