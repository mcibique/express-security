let express = require('express');
let router = express.Router();

let referrerPolicy = require('./referrer-policy');

router.use('/referrer-policy', referrerPolicy);

module.exports = router;
