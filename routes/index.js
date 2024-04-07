const express = require('express');
const router = express.Router();

console.log('router reloaded');

router.use('/', require('./users'));
router.use('/review', require('./reviews'));

module.exports = router;
