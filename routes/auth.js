const authController = require('../controller/authController')


var express = require('express');
var router = express.Router();

/* POST auth/login */
router.post('/login', authController.login);

/* POST auth/register */
router.post('/register', authController.register);

module.exports = router;
