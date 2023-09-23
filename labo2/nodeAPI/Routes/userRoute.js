const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.post('/receive', userController.receiveData);

module.exports = router;
