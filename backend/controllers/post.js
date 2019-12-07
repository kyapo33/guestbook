const express = require('express')
const controller = express.Router()
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const Post = require('../models/post');

controller.getById = async (req, res, next, id) => {
    try {
        const post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .populate('comments.postedBy', '_id name')
            .select('_id body created comments photo')
            .exec()
        if(!post) {
            return res.status(400).json({
                error: 'Aucun messages trouvé'
            })   
        }
        req.post = post;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: 'Aucun messages trouvé'
        })  
    }
}

controller.read = (req, res) => {
    return res.json(req.post);
}

controller.create = async (req, res) => {
    try {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Le chargement de l\'image a échoué'
                })
            }
            const { body } = fields

            if (!body || body.length < 1) {
                return res.status(400).json({
                    error: 'Le contenu est cours'
                });
            }
            
            let post = new Post()
            post.body = body
            post.postedBy = req.profile

            if(files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path)
                post.photo.contentType = files.photo.type 
            }
            const result = await post.save()
            return res.json(result)    
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'La création du message a échoué'
        })   
    }      
}

controller.list = async(req, res) => {
    try {
        const data = await Post.find()
            .populate('postedBy', '_id name')
            .populate('comments.postedBy', '_id name')
            .select('_id title body created comments photo')
            .sort({ created: -1 })
            .exec()
        return res.send(data)        
    }
    catch (err) {
        return res.status(400).json({
            error: 'Aucun messages trouvés'
        })
    }    
}

controller.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

controller.remove = async (req, res) => {
    let post = req.post
    try {
        await post.remove()
        return res.json({ 
            message: "Le message a bien été supprimé"
        }); 
    }
    catch (err) {
        return res.status(400).json({
            error: "Suppression échoué"
        })   
    }
}

controller.edit = async (req, res) => {
    try {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Le chargement de l\'image a échoué'
                })
            }
            let post = req.post;
            post = _.extend(post, fields);
            post.updated = Date.now();

            if (files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path);
                post.photo.contentType = files.photo.type;
            }

            const result = await post.save()
            return res.json(result)    
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'La mise a du blog a échoué'
        })   
    }      
}

controller.postsByUser = async (req, res) => {
    try {
        const data = await Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body created likes')
        .sort({ created: -1 })
        .exec() 
        if(!data) {
            return res.status(400).json({
                error: 'Aucun messages trouvé'
            })   
        }
        return res.send(data)
    }
    catch (err) {
        return res.status(400).json({
            error: 'Aucun messages trouvés'
        })
    }        
};

controller.comment = async (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec()
        if(!result) {
            return res.status(400).json({
                error: 'Aucun commentaires'
            })   
        }
        return res.send(result)   
    }
    catch (err) {
        return res.status(400).json({
            error: 'Aucun commentaires trouvés'
        })
    }         
};

module.exports = controller;

