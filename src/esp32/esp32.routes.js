const express = require('express');
const router = express.Router();
const esp32Controller = require('./esp32.controller');

router.get('/', esp32Controller.getAll);
router.put('/:id', esp32Controller.update);

module.exports = router;
