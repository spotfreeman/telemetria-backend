const express = require('express');
const router = express.Router();
const esp32Controller = require('./esp32.controller');
const auth = require('../middleware/auth');

router.getAll('/', esp32Controller.getAll);
router.create('/', esp32Controller.create);
router.delete('/:id', esp32Controller.delete);

module.exports = router;
