/* eslint-disable no-console */
const express = require('express');
const transportationController = require('../controllers/transportation'); 
const router = express.Router();

router.get('/getAllTransportation', transportationController.getAllTransportation); 

module.exports = router;
