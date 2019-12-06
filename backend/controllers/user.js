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

module.exports = controller;