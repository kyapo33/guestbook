const express = require('express')
const router = express.Router()

const auth = require("../controllers/auth");
const {userSignupValidator} = require("../validator");

router.post('/register', userSignupValidator, auth.signUp);
router.post('/login', auth.signIn);
router.get('/logout', auth.signOut);
router.post("/social-login", auth.socialLogin);

module.exports = router;