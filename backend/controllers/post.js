const express = require('express')
const controller = express.Router()
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const Post = require('../models/post');

// get post by id
controller.getById = async (req, res, next, id) => {
    try {
        const post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .populate('comments.postedBy', '_id name')
            .select('_id body created comments photo checkimg')
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
        return console.log(err);
    }
}

// get one post
controller.read = (req, res) => {
    return res.json(req.post);
}

// create a post
controller.create = async (req, res) => {
    try {
        // initialize a new form
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Le chargement de l\'image a échoué'
                })
            }
            const { body, checkimg } = fields

            // check is body is not empty
            if (!body || body.length < 1) {
                return res.status(400).json({
                    error: 'Le contenu est cours'
                });
            }
            
            // initialize a new post
            let post = new Post()
            post.body = body
            post.checkimg = checkimg
            post.postedBy = req.profile

            if(files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path)
                post.photo.contentType = files.photo.type 
                post.checkimg = true
            }

            const result = await post.save()
            return res.json(result)    
        })
    }
    catch (err) {
        return console.log(err);
    }    
}

// get all posts
controller.list = async(req, res) => {
    try {
        const data = await Post.find()
            .populate('postedBy', '_id name')
            .populate('comments.postedBy', '_id name')
            .select('_id title body created comments photo checkimg')
            .sort({ created: -1 })
            .exec()
        if(!data) {
            return res.status(400).json({
                error: 'Aucun messages trouvés'
            })    
        }
        return res.send(data)        
    }
    catch (err) {
        return console.log(err);
    }   
}

// get photo by post
controller.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

// delete a post
controller.remove = async (req, res) => {
    let post = req.post
    try {
        await post.remove()
        if(!post) {
            return res.status(400).json({
                error: "Suppression échoué"
            })     
        }
        return res.json({ 
            message: "Le message a bien été supprimé"
        }); 
    }
    catch (err) {
        return console.log(err);
    } 
}

// update one post
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
                post.checkimg = true
            }

            const result = await post.save()
            if(!result) {
                return res.status(400).json({
                    error: 'La mise a du message a échoué'
                })    
            }
            return res.json(result)    
        })
    }
    catch (err) {
        return console.log(err);
    }    
}

// get posts by user
controller.postsByUser = async (req, res) => {
    try {
        const data = await Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id body created photo checkimg')
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
        return console.log(err);
    }      
};

//insert comments by user
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
        return console.log(err);
    }        
};

module.exports = controller;