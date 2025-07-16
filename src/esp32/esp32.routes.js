const express = require('express');
const router = express.Router();
const esp32Controller = require('./esp32.controller');

router.get('/', esp32Controller.get);
router.get('/:deviceId', esp32Controller.getAll); // Assuming you want to get by ID, but this should be adjusted based on your actual need
router.post('/', esp32Controller.post);

module.exports = router;
