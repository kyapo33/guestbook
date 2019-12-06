const express = require('express')
const router = express.Router()

const post = require('../controllers/post')
const user = require("../controllers/user");
const auth = require('../controllers/auth') 

router.post('/create/post/:userId', auth.requireSignIn, auth.isAuth, post.create);
router.get('/post', post.list);
router.get('/post/:postId', post.read);
router.delete('/post/:postId/:userId', auth.requireSignIn, auth.isAuth, post.remove);
router.put('/edit/:postId/:userId', auth.requireSignIn, auth.isAuth, post.edit);
router.get('/photo/:postId', post.photo);

router.param("postId", post.getById)
router.param("userId", user.userById)


module.exports = router