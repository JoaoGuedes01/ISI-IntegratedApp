const express = require('express');
const router = express.Router();
const isAuth = require('../Middleware/isAuthenticated');
const federationController = require('../controllers/federationController');


//GET
router.get('/getRankingsCampeonatos',federationController.getRankingsCampeonatos);
router.get('/getRankingsCampeonatos/:eventID',federationController.getRankingsCampeonatosByEventID);
router.get('/getRankingsTrofeus',federationController.getRankingsTrofeus);
router.get('/getRankingsTrofeus/:eventID',federationController.getRankingsTrofeusByEventID);
router.get('/licenses',federationController.getContacts);
router.get('/requests',federationController.getAllDeals);
router.get('/eventByRequestID/:dealID',federationController.getEventByDealEventID);
router.get('/tickets',federationController.getTickets);
router.get('/tickets/:ticketID',federationController.getTicketByID);

//POST
router.post('/ticketToEvent', federationController.createTicket);

//PUT
router.put('/requests/update',federationController.updateEvent);

/*router.get('/cona', (req,res)=>{
    const rankingsCampeonatos = new RankingsCampeonatos({
        eventID: "321",
        nomeEvento: "pistolas",
        ranking:[
            {
                PilotID: "654654",
                class: 1
            },
            {
                PilotID: "123123",
                class: 2
            }
        ]
    })
    rankingsCampeonatos.save();
    res.send('ok')
})*/




module.exports = router;