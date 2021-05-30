const express = require('express');
const router = express.Router();
//const isAuth = require('../MiddleWare/isAuthenticated');
const adminController = require('../controllers/adminController');


//GETS
router.get('/getMangasByEvent/:eventID', adminController.getMangasByEvent);
router.get('/tracks', adminController.getTracks);
router.get('/trackById/:trackID', adminController.getTrackByID);
router.get('/events', adminController.getEvents);
router.get('/eventById/:eventID', adminController.getEventByID);
router.get('/registrationByEventID/:eventID', adminController.getRegistrationByEventID);
router.get('/licenses', adminController.getAllLicenses);
router.get('/licenses/:licenseNumber', adminController.getLicenseByLicenseNumber);
router.get('/userByLicense/:licenseNumber', adminController.getUserByLicenseID);
router.get('/fedRequests', adminController.getFedRequests);
router.get('/woRequests', adminController.getAllWO);
router.get('/acceptFedReq/:reqID', adminController.acceptFedRequest);
router.get('/getInvoices', adminController.getInvoices);
router.get('/getInvoice/:invoiceName', adminController.getInvoiceByID);
router.get('/closeTrofeuRegs/:eventID', adminController.closeTrofeuRegs);
router.get('/closeCampeonatoRegs/:eventID', adminController.closeTrofeuRegs);
router.get('/publishEventFB/:eventID', adminController.publishEventFB);
router.get('/publishEventTwitter/:eventID', adminController.publishEventTwitter);
router.get('/cancelEvent/:eventID', adminController.cancelEvent);
router.get('/rejectChampionship/:eventID', adminController.rejectChampionship);


//POSTS
router.post('/tracks', adminController.createTrack);
router.post('/events', adminController.createEvent);

//PUT
router.put('/events', adminController.updateEvent);

//DELETE
router.delete('/delTrack/:trackID', adminController.deleteTrackByID);
router.delete('/deleteEventByID/:eventID', adminController.deleteEventByID);

module.exports = router;