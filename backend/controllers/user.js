const express = require('express')
const controller = express.Router()
require("dotenv").config();

const User = require('../models/user')

// get user id
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
        return console.log(err);
    } 
}

// get one user
controller.read = (req, res) => {
    req.profile.hash_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

module.exports = controller;