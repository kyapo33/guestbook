const express = require('express')
const controller = express.Router()
const jwt = require("jsonwebtoken");
const expressJwt = require('express-jwt');
const _ = require('lodash');
require("dotenv").config();

const User = require('../models/user')

// register if email adress doesn't exist
controller.signUp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(user) {
            return res.status("401").json({
                error: "Cet adresse e-mail existe déja"
            });        
        } else {
            const user = new User(req.body)
            await user.save()
            res.json({user});
        }
    }
    catch (err) {
        return console.log(err);
    }
}
// login and token implementation
controller.signIn = async (req, res) => {
    const{email, password} = req.body
    try {
        const user = await User.findOne({email}); 
        if(!user || !user.authenticate(password)) {
            return res.status(400).json({
                error: "Mauvais identifiant ou mot de passe"
            })   
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        res.cookie('t', token, {expire: new Date() + 9999})
        const {_id, name } = user
        return res.json({token, user: {_id, email, name }
        });
    }
    catch (err) {
        return console.log(err);
    }   
}
// signout and clear cookei
controller.signOut = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Vous avez été déconnecté"})
}
// check if the user is logged
controller.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})
// check if the user profile exist
controller.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user) {
        return res.status(403).json({
            error: 'Accès interdit'
        });
    }
    next();
}

controller.socialLogin = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(user) {
            req.profile = user;
            _.extend(user, req.body);
            user.updated = Date.now();
            user.save();  
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
            res.cookie('t', token, {expire: new Date() + 9999})
            const {_id, name } = user
            return res.json({token, user: {_id, email, name } });    
        } else {
            const user = new User(req.body)
            await user.save()
            res.json({user});
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
            res.cookie('t', token, {expire: new Date() + 9999})
            const {_id, name } = user
            return res.json({token, user: {_id, email, name } });    
        }
    }
    catch (err) {
        return console.log(err);
    }
};

module.exports = controller;