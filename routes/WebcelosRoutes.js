const express = require('express');
const router = express.Router();
const isAuth = require('../MiddleWare/isAuthenticated');
const webcelosController = require('../controllers/webcelosController');


router.get('/requests', webcelosController.getAllRequests);
router.get('/requests/:requestID', webcelosController.getRequestByID);
router.get('/requests/details/:requestID', webcelosController.getRequestDeatilsByID);
router.post('/sendPromLogo/:eventID',webcelosController.sendPromLogo);



module.exports = router;