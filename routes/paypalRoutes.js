const express = require('express');
const router = express.Router();
const isAuth = require('../Middleware/isAuthenticated');
const paypalController = require('../controllers/paypalController');

//GETS
router.get('/success/:total', paypalController.success);
router.get('/cancel', paypalController.cancel);

//POSTS
router.post('/pay', isAuth, paypalController.pay);



module.exports = router;