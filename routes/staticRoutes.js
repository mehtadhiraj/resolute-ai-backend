const express = require('express');
const router = express.Router();

const staticController = require('../controllers/staticController');

router.get('/', staticController.home);

module.exports = router;
