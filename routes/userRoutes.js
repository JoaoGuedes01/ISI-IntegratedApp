const express = require('express');
const router = express.Router();
const isAuth = require('../Middleware/isAuthenticated.js');
const userController = require('../controllers/userController');


//GETS
router.get('/isLoggedIn', isAuth, userController.isLoggedIn);
router.get('/loggedUser', isAuth, userController.getLoggedUser);
router.get('/events', userController.getEvents);
router.get('/eventById/:eventID', userController.getEventByID);
router.get('/registrationByEventID/:eventID', userController.getRegistrationByEventID);
router.get('/successLicense/:totalSiva/:total/:licenseID', userController.successLicensePayment);
router.get('/successRegEvent/:total/:regID', userController.successRegPayment);
router.get('/getInvoices/', isAuth,userController.getLoggedInvoices);
router.get('/getInvoice/:invoiceName', userController.getInvoiceByID);
router.get('/loggedLicense', isAuth, userController.getLoggedLicense);
router.get('/:userID', isAuth, userController.getUserByID);
router.get('/activateAccount/:userId/:activationCode', userController.activateAccount);





//POSTS
router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/registerInEvent', isAuth, userController.RegisterInEvent);
router.post('/requestLicense', isAuth, userController.requestLicense);
router.post('/requestPasswordChange', userController.requestPasswordChange);
router.post('/changePassword/:pilotSecret/:pilotID', userController.changePassword);
router.post('/uploadUserFoto', userController.uploadUserFoto);

//PUTS
router.put('/updateLicense', userController.updateUserLicense);


module.exports = router;