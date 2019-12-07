const express = require('express')
const router = express.Router()

const auth = require("../controllers/auth")
const {userEditValidator} = require("../validator");
const user = require("../controllers/user");

router.get('/user/:userId', auth.requireSignIn, auth.isAuth, user.read);
router.put('/user/update/:userId', auth.requireSignIn, auth.isAuth, userEditValidator, user.update);

router.param("userId", user.userById)

module.exports = router;