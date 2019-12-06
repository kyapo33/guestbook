const express = require('express')
const router = express.Router()

const user = require("../controllers/auth");
const {userSignupValidator} = require("../validator");

router.post('/register', userSignupValidator, user.signUp);
router.post('/login', user.signIn);
router.get('/logout', user.signOut);

module.exports = router;