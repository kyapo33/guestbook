const express = require('express')
const router = express.Router()

const auth = require("../controllers/auth")
const user = require("../controllers/user");

router.get('/user/:userId', auth.requireSignIn, auth.isAuth, user.read);

router.param("userId", user.userById)

module.exports = router;