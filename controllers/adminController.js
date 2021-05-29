const conn = require('../config/salesforce');
const twilio = require('../config/twilio');
const getMoloniToken = require('../config/moloni');
const hubspotClient = require('../config/hubspot');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const request = require('request');
const graph = require('fbgraph');
const RankingsTrofeus = require('../models/rankingsTrofeus');
const mailer = require('../config/mail');
const paypal = require('paypal-rest-sdk');
const Twitter = require('twitter');
const RankingsCampeonatos = require('../models/rankingsCampeonatos');
const { BatchResponsePublicAssociationMulti } = require('@hubspot/api-client/lib/codegen/crm/associations/api');
const rankingsTrofeus = require('../models/rankingsTrofeus');
const { find } = require('../models/rankingsTrofeus');

var client = new Twitter({
    consumer_key: 'iNsM6CDwLelw4TmkT8qNCzeDN',
    consumer_secret: 'TB3bmJnJV95fx3kMRt83ipTJaLFnGNMfja1qB6SjWlh98pzEyb',
    access_token_key: '1395410147627917317-LN1VoQGAwRcwLHDT0bIV8TFZ7PjjbC',
    access_token_secret: '1FKszyaGPwwbYgeHJCk8dzwb5EXa3C5cDtbdgDta8IIrd'
});

graph.setAccessToken('EAAU5NB4fJqQBAHIAz6SasUid8UJlbhFNkUjhDrm1E2JLZCgetwHS5o42danSijOX9rfLMDZC8puFjP0uCTfRs8sIMZAR2i2HTF3T5HaSEAaB7EuZBfBhK8S8jbn3y8r9LcDH8xtvg1BmQDUZAp1gVEXvBAlOohUV65ZCA1ZB4pBINhXN08mZAjU2EwW4C0lKdYMZD');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWTZYBESnrsKeXaAGPNcLltFAHGk7tF8P-uMx1j3o-6SpYl8_UunEcXZA9G2-yLnuTaY5wSQB1dWOW9n',
    'client_secret': 'EHCu_fmCy05xJvHpdNUYoHEQmy0v8os0XOiNeYCvXmzktyMpoJM1FyZncV66BeFIoOLtRnrDjzmxWb2Y'
});

async function getTracks(req, res) {
    try {
        //Query que procura por todas as pistas
        const result = await conn.sobject("Track__c").find(
            {},
            {
                Id: 1,
                Name: 1,
                TrackName__c: 1,
                TrackCondition__c: 1,
                TrackLocal__c: 1,
                TrackRank__c: 1,
                MapsLat__c: 1,
                MapsLong__c: 1
            });

        //Verificação de pistas
        if (!result) return res.status(404).send({
            status: req.status,
            message: "No tracks found"
        })

        //Caso existam retorna pistas
        const tracks = result;
        return res.send(tracks);

    } catch (error) {
        res.send(error);
    }
}

async function getTrackByID(req, res) {
    try {
        //Query que procura por uma pista com o id introduzido
        const result = await conn.sobject("Track__c").findOne(
            {
                Id: req.params.trackID
            },
            {
                Id: 1,
                Name: 1,
                TrackName__c: 1,
                TrackCondition__c: 1,
                TrackLocal__c: 1,
                TrackRank__c: 1,
                Tables__c: 1,
                MapsLat__c: 1,
                MapsLong__c: 1
            });


        //Verificação da existencia da pista
        if (!result) return res.status(404).send({
            status: req.status,
            message: "No tracks found"
        })

        const jsonTables = JSON.parse(result.Tables__c)


        //Caso exista retorna a pista
        return res.send({
            track: result,
            tables: jsonTables
        });

    } catch (error) {
        res.send(error);
    }
}

async function createTrack(req, res) {
    console.log(req.body)

    const tableJson = {
        tables: req.body.tables
    }

    const tableJsonString = JSON.stringify(tableJson);

    //Criar o objeto Pista na Salesforce
    conn.sobject("Track__c").create({
        TrackName__c: req.body.TrackName__c,
        TrackCondition__c: req.body.TrackCondition__c,
        TrackLocal__c: req.body.TrackLocal__c,
        TrackRank__c: req.body.TrackRank__c,
        Tables__c: tableJsonString,
        MapsLat__c: req.body.MapsLat__c,
        MapsLong__c: req.body.MapsLong__c
    }, (err, result) => {

        //Catch de erros na criação do objeto
        if (err) {
            console.log("Error: " + err);
            return res.send("Error: " + err);
        }

        //Caso corra tudo bem
        return res.send({
            status: 200,
            message: "Track created successfully"
        });

    })
}

async function deleteTrackByID(req, res) {
    try {
        await conn.sobject("Track__c").destroy(req.params.trackID, function (err, ret) {
            if (err || !ret.success) { return console.error(err, ret); }
            console.log('Deleted Successfully : ' + ret.id);
        });

        return res.send({ message: "Track deleted successfully" });

    } catch (error) {
        res.send(error);
    }
}

async function getEvents(req, res) {
    try {
        //Query que procura por todos os eventos
        const result = await conn.sobject("EventsSP__c").find(
            {},
            {
                Id: 1,
                EventName__c: 1,
                EventStatus__c: 1,
                EventType__c: 1,
                InscPrice__c: 1,
                StartDate__c: 1,
                CloseDate__c: 1,
                Track__c: 1,
                MinReg__c: 1,
                Foto__c: 1
            });

        //Verificação da existencia de eventos
        if (!result) return res.status(404).send({
            status: req.status,
            message: "No events found"
        })

        //Caso haja eventos criados
        const events = result;
        return res.send(events);

    } catch (error) {
        res.send(error);
    }
}

async function getEventByID(req, res) {
    try {
        //Query que procura por um evento através do id introduzido
        const result = await conn.sobject("EventsSP__c").find(
            {
                Id: req.params.eventID
            },
            {
                Id: 1,
                Name: 1,
                EventName__c: 1,
                EventStatus__c: 1,
                EventType__c: 1,
                InscPrice__c: 1,
                StartDate__c: 1,
                CloseDate__c: 1,
                Track__c: 1,
                MinReg__c: 1
            });

        //Verificação da existencia do evento
        if (!result) return res.status(404).send({
            status: req.status,
            message: "No event found"
        })

        //Caso o evento exista
        const events = result;
        return res.send(events);

    } catch (error) {
        res.send(error);
    }
}

async function deleteEventByID(req, res) {
    try {
        //Query que procura por um evento através do id introduzido
        const result = await conn.sobject("EventsSP__c").find(
            {
                Id: req.params.eventID
            }).destroy(function (err, data) {
                if (err) return { status: "error", error: err };
                return { status: "success", data: data }
            });

        if (result.status == "error") return res.send({ message: "There was an error deleting the event" });

        return res.send({ message: "Event deleted successfully" });

    } catch (error) {
        res.send(error);
    }
}

//Função de criar Evento
//Data mm/dd/yyyy
async function createEvent(req, res) {
    console.log("Trying to create event")


    if (req.body.EventType__c == 'trofeu') {
        //Criar o objeto Evento na Salesforce
        let data = {
            EventName__c: req.body.EventName__c,
            EventStatus__c: 'espera_conf',
            EventType__c: req.body.EventType__c,
            InscPrice__c: req.body.InscPrice__c,
            StartDate__c: Date.parse(req.body.StartDate__c),
            CloseDate__c: Date.parse(req.body.CloseDate__c),
            Track__c: req.body.Track__c,
            CapacityTeams__c: req.body.CapacityTeams__c,
            MinReg__c: req.body.MinReg__c,
            Foto__c: 'undefined'
        }
        const ev = await conn.sobject("EventsSP__c").create(data, (err, result) => {
            //Catch de erros na criação do objeto
            if (err) {
                console.log("Error: " + err);
                return res.send("Error: " + err);
            }
            console.log("Event added to salesforce");
        });

        //Criar Deal no Hubspot
        const dealData = {
            properties: {
                dealname: 'Troféu ' + data.EventName__c,
                amount: data.InscPrice__c,
                dealstage: "appointmentscheduled",
                pipeline: "default",
                salesforce_id: ev.id,
                event_name: data.EventName__c,
                event_status: data.EventStatus__c,
                event_type: data.EventType__c,
                closedate: data.CloseDate__c,
                createdate: data.StartDate__c,
                minreg: data.MinReg__c
            }
        };

        //Posting deal to Hubspot
        const deal = await hubspotClient.crm.deals.basicApi.create(dealData);
        if (!deal) return res.send({ status: 400, message: 'Error creating Deal in Hubspot' });

        let arrayCampanha = req.body.arrayCampanha;
        let finalPrice = 0;
        for (i = 0; i < arrayCampanha.length; i++) {
            console.log('percorrer')
            if (arrayCampanha[i] == 'cmd') {
                finalPrice = finalPrice + 150;
                console.log('1')
            } else if (arrayCampanha[i] == 'cf') {
                finalPrice = finalPrice + 80;
                console.log('2')
            } else if (arrayCampanha[i] == 'l') {
                finalPrice = finalPrice + 45;
                console.log('3')
            } else if (arrayCampanha[i] == 'cfoto') {
                finalPrice = finalPrice + 800;
                console.log('4')
            } else if (arrayCampanha[i] == 'cvid') {
                finalPrice = finalPrice + 1500;
                console.log('5')
            } else if (arrayCampanha[i] == 'di') {
                finalPrice = finalPrice + 450;
                console.log('6')
            }
        }

        let jsonarray = {
            properties: arrayCampanha
        }
        let jsonarrayString = JSON.stringify(jsonarray)

        let WOdata = {
            Order_Name__c: 'Troféu ' + data.EventName__c,
            Price__c: finalPrice,
            Reference__c: ev.id,
            Campanha__c: jsonarrayString,
            Estado__c: 'pendente',
        }
        const wo = await conn.sobject("Webcelos_Order__c").create(WOdata, (err, result) => {
            //Catch de erros na criação do objeto
            if (err) {
                console.log("Error: " + err);
                return res.send("Error: " + err);
            }
            console.log("Event added to salesforce");
        });


        //Caso corra tudo bem
        return res.send({
            status: 200,
            message: "Event created successfully",
            salesforce: 'ok',
            hubspot: 'ok'
        });
    }

    if (req.body.EventType__c == 'campeonatoN' || req.body.EventType__c == 'campeonatoI') {
        //Criar o objeto Evento na Salesforce
        let data = {
            EventName__c: req.body.EventName__c,
            EventStatus__c: 'insc_abertas',
            EventType__c: req.body.EventType__c,
            InscPrice__c: req.body.InscPrice__c,
            StartDate__c: Date.parse(req.body.StartDate__c),
            CloseDate__c: Date.parse(req.body.CloseDate__c),
            Track__c: req.body.Track__c,
            CapacityTeams__c: req.body.CapacityTeams__c,
            MinReg__c: req.body.MinReg__c,
            Foto__c: 'undefined'
        }
        const ev = await conn.sobject("EventsSP__c").create(data, (err, result) => {
            //Catch de erros na criação do objeto
            if (err) {
                console.log("Error: " + err);
                return res.send("Error: " + err);
            }
            console.log("Event added to salesforce");
        });

        //Criar Deal no Hubspot
        const dealData = {
            properties: {
                dealname: 'Pedido para Evento(SP Modelismo)',
                amount: '0',
                dealstage: "appointmentscheduled",
                pipeline: "default",
                salesforce_id: ev.id,
                event_name: data.EventName__c,
                event_status: data.EventStatus__c,
                event_type: data.EventType__c,
                closedate: data.CloseDate__c,
                createdate: data.StartDate__c,
                minreg: data.MinReg__c
            }
        };

        //Posting deal to Hubspot
        const deal = await hubspotClient.crm.deals.basicApi.create(dealData);
        if (!deal) return res.send({ status: 400, message: 'Error creating Deal in Hubspot' });

        let arrayCampanha = req.body.arrayCampanha;
        let finalPrice = 0;
        for (i = 0; i < arrayCampanha.length; i++) {
            console.log('percorrer')
            if (arrayCampanha[i] == 'cmd') {
                finalPrice = finalPrice + 150;
                console.log('1')
            } else if (arrayCampanha[i] == 'cf') {
                finalPrice = finalPrice + 80;
                console.log('2')
            } else if (arrayCampanha[i] == 'l') {
                finalPrice = finalPrice + 45;
                console.log('3')
            } else if (arrayCampanha[i] == 'cfoto') {
                finalPrice = finalPrice + 800;
                console.log('4')
            } else if (arrayCampanha[i] == 'cvid') {
                finalPrice = finalPrice + 1500;
                console.log('5')
            } else if (arrayCampanha[i] == 'di') {
                finalPrice = finalPrice + 450;
                console.log('6')
            }
        }

        let jsonarray = {
            properties: arrayCampanha
        }
        let jsonarrayString = JSON.stringify(jsonarray)

        let WOdata = {
            Order_Name__c: 'Troféu ' + data.EventName__c,
            Price__c: finalPrice,
            Reference__c: ev.id,
            Campanha__c: jsonarrayString,
            Estado__c: 'pendente',
        }
        const wo = await conn.sobject("Webcelos_Order__c").create(WOdata, (err, result) => {
            //Catch de erros na criação do objeto
            if (err) {
                console.log("Error: " + err);
                return res.send("Error: " + err);
            }
            console.log("Event added to salesforce");
        });

        //Caso corra tudo bem
        return res.send({
            status: 200,
            message: "Event created successfully",
            salesforce: 'ok',
            hubspot: 'ok'
        });
    }
    return res.send({
        status: 500,
        message: 'Event type unrecognized'
    })
}

async function updateEvent(req, res) {
    //Query que procura por uma pista com o id introduzido
    const getEventByID = await conn.sobject("EventsSP__c").find(
        {
            Id: req.body.eventID
        },
        {
            Id: 1,
            Name: 1,
            EventName__c: 1,
            EventStatus__c: 1,
            EventType__c: 1,
            InscPrice__c: 1,
            StartDate__c: 1,
            CloseDate__c: 1,
            Track__c: 1,
            CapacityTeams__c: 1,
            MinReg__c: 1
        });

    if (getEventByID[0].EventStatus__c != 'aceite' && req.body.EventStatus__c != 'espera_conf') return res.send({ status: 500, message: "Forbidden" })
    const result = await conn.sobject("EventsSP__c").update(
        {
            Id: req.body.eventID,
            EventName__c: req.body.EventName__c,
            EventStatus__c: req.body.EventStatus__c,
            EventType__c: req.body.EventType__c,
            InscPrice__c: req.body.InscPrice__c,
            StartDate__c: Date.parse(req.body.StartDate__c),
            CloseDate__c: Date.parse(req.body.CloseDate__c),
            Track__c: req.body.Track__c,
            CapacityTeams__c: req.body.CapacityTeams__c
        });

    console.log(result);
    return res.send(result);

}

async function getRegistrationByEventID(req, res) {
    try {
        //Query que procura por uma inscrição no evento introduzido
        const result = await conn.sobject("Registration__c").find(
            {
                EventID__c: req.params.eventID
            },
            {
                Id: 1,
                Name: 1,
                PilotID__c: 1,
                PilotCar__c: 1,
                CarMotor__c: 1,
                CarTransponder__c: 1,
                Radio__c: 1,
                MechanicName__c: 1,
                MechanicEmail__c: 1,
                MechanicPhone__c: 1,
                Table__c: 1,
                Payment_State__c: 1,
                Pilot_Name__c: 1
            });

        //Verificação da existencia da inscrição
        if (!result) return res.status(404).send({
            status: req.status,
            message: "No event found"
        })

        //Caso a inscrição exista retorna-a 
        const events = result;
        return res.send(events);

    } catch (error) {
        res.send(error);
    }
}

async function getAllLicenses(req, res) {
    //Query que procura por uma inscrição no evento introduzido
    const result = await conn.sobject("License__c").find(
        {
            State__c: 'paid'
        },
        {
            Id: 1,
            Name: 1,
            First_Name__c: 1,
            Last_Name__c: 1,
            Birth_Date__c: 1,
            Phone_Number__c: 1,
            CC__c: 1,
            NIF__c: 1,
            Postal_Code__c: 1,
            Address__c: 1,
            City__c: 1,
            License_Type__c: 1,
            License_Number__c: 1,
            State__c: 1
        });

    //Verificação da existencia da inscrição
    if (!result) return res.status(404).send({
        status: req.status,
        message: "No event found"
    })

    //Caso a inscrição exista retorna-a 
    const events = result;
    return res.send(events);
}

async function getLicenseByLicenseNumber(req, res) {
    //Query que procura por uma inscrição no evento introduzido
    const result = await conn.sobject("License__c").find(
        {
            License_Number__c: req.params.liceseNumber
        },
        {
            Id: 1,
            Name: 1,
            First_Name__c: 1,
            Last_Name__c: 1,
            Birth_Date__c: 1,
            Phone_Number__c: 1,
            CC__c: 1,
            NIF__c: 1,
            Postal_Code__c: 1,
            Address__c: 1,
            City__c: 1,
            License_Type__c: 1,
            License_Number__c: 1
        });

    //Verificação da existencia da licensa
    if (result == "") return res.status(404).send({
        status: req.status,
        message: "No license found"
    })
    const license = result[0];
    return res.send(license);
}

async function getUserByLicenseID(req, res) {
    //Query que procura por um utilizador com o email introduzido
    const result = await conn.sobject("Pilot__c").find(
        {
            License_Number__c: req.params.licenseNumber
        },
        {
            Id: 1,
            Name: 1,
            First_Name__c: 1,
            Last_Name__c: 1,
            Email__c: 1,
            Birth_Date__c: 1,
            Phone_Number__c: 1,
            License_Number__c: 1,
            Identifier__c: 1,
            Identifier_Name__c: 1,
            NIF__c: 1,
            Postal_Code__c: 1,
            Address__c: 1,
            City__c: 1,
            Password__c: 1
        });

    //Verificação da existencia do utilizador
    if (result == "") return res.status(404).send({
        status: req.status,
        message: "No user found"
    })
    const user = result[0];
    return res.send(user);
}

async function getFedRequests(req, res) {
    //Query que procura por um utilizador com o email introduzido
    const result = await conn.sobject("FED_Requests__c").find(
        {},
        {
            Id: 1,
            Name: 1,
            EventName__c: 1,
            EventType__c: 1,
            StartDate__c: 1,
            EndDate__c: 1,
            InscPrice__c: 1,
            EventDesc__c: 1,
            TrackID__c: 1,
            Request_Status__c: 1,
            HubspotID__c: 1
        });

    //Verificação da existencia do utilizador
    if (result == "") return res.status(404).send({
        status: req.status,
        message: "No requests found"
    })

    return res.send(result);
}

async function getAllWO(req, res) {
    //Query que procura por um utilizador com o email introduzido
    const result = await conn.sobject("Webcelos_Order__c").find(
        {},
        {
            Id: 1,
            Name: 1,
            Order_Name__c: 1,
            Price__c: 1,
            Reference__c: 1,
            Campanha__c: 1
        });

    //Verificação da existencia do utilizador
    if (result == "") return res.status(404).send({
        status: req.status,
        message: "No requests found"
    })

    return res.send(result);
}

async function acceptFedRequest(req, res) {
    let reqID = req.params.reqID;
    const fedReq = await conn.sobject('FED_Requests__c').findOne(
        {
            Id: reqID
        },
        {
            HubspotID__c: 1
        }
    )
    const ticketObj = {
        properties: {
            hs_pipeline_stage: '4',
        },
    }
    const updatedTicket = await hubspotClient.crm.tickets.basicApi.update(fedReq.HubspotID__c, ticketObj);
    if (!updatedTicket) return res.send({ status: 400, message: 'Error creating Deal in Hubspot' });

    const updatefedReq = await conn.sobject('FED_Requests__c').update(
        {
            Id: reqID,
            Request_Status__c: 'insc_abertas'
        }
    )


    return res.send({ status: 200, huspot: 'ok', salesforce: 'ok', message: 'Request accepted successfully' });
}

async function getInvoiceByID(req, res) {
    res.sendFile(path.join(__dirname, '../invoicesFED', req.params.invoiceName + ".pdf"));
}

async function getInvoices(req, res) {
    const result = await conn.sobject('InvoiceCustom__c').find(
        {
            userID__c: 'SP'
        },
        {
            invoiceID__c: 1
        }
    )
    return res.send(result);
}

async function closeTrofeuRegs(req, res) {
    const eventID = req.params.eventID
    //Query que procura por uma inscrição no evento introduzido
    const resultRegs = await conn.sobject("Registration__c").find(
        {
            EventID__c: eventID,
            Payment_State__c: 'paid'
        },
        {
            Id: 1,
            EventID__c: 1,
            PilotID__c: 1,
            Pilot_Name__c: 1
        });

    //Query que procura por todos os eventos
    const resultEvent = await conn.sobject("EventsSP__c").findOne(
        {
            Id: eventID
        },
        {
            Id: 1,
            MinReg__c: 1,
            EventStatus__c: 1
        });

    if (resultEvent.EventStatus__c == 'insc_fechadas') return res.send({
        status: 500,
        message: "This event's registrations are already closed"
    })

    if (resultEvent.EventStatus__c != 'insc_abertas') return res.send({
        status: 500,
        message: "Wrong Event Status received"
    })

    if (resultEvent.MinReg__c > resultRegs.length) return res.send({
        status: 500,
        message: 'Not enough registrations'
    });



    console.log('A tentar organizar pilotos por mangas');

    let nmrMangas = 0;
    console.log(resultRegs.length)
    if (resultRegs.length <= 15) {
        nmrMangas = 1
    } else if (resultRegs.length <= 30 && resultRegs.length > 15) {
        nmrMangas = 2
    } else if (resultRegs.length <= 45 && resultRegs.length > 30) {
        nmrMangas = 3
    } else if (resultRegs.length <= 60 && resultRegs.length > 45) {
        nmrMangas = 4
    } else if (resultRegs.length <= 75 && resultRegs.length > 60) {
        nmrMangas = 5
    } else if (resultRegs.length <= 90 && resultRegs.length > 75) {
        nmrMangas = 6
    }

    console.log("Distribuir os pilotos por " + nmrMangas + " mangas");

    const getRankings = await RankingsTrofeus.findOne({ numero: "ultimo" });
    if (!getRankings) return res.send({
        status: 500,
        message: 'No ranking records'
    })

    const regs = resultRegs;
    const eventMongo = getRankings;
    const notInRanking = [];
    const InRanking = [];


    for (i = 0; i < regs.length; i++) {
        console.log(i);
        const matchedReg = eventMongo.ranking.find(match => match.PilotID === regs[i].PilotID__c);
        if (!matchedReg || matchedReg == "") {
            let newObjReg = {
                pilotID: regs[i].PilotID__c,
                regID: regs[i].Id,
                pilotName: regs[i].Pilot_Name__c,
                class: 0
            }
            notInRanking.push(newObjReg);
        } else {
            let newObjReg = {
                pilotID: regs[i].PilotID__c,
                regID: regs[i].Id,
                pilotName: regs[i].Pilot_Name__c,
                class: matchedReg.class
            }
            InRanking.push(newObjReg);
        }
    }


    InRanking.sort(function (a, b) { return a.class - b.class });

    let mangaA = [];
    let mangaB = [];
    let mangaC = [];
    let mangaD = [];
    let mangaE = [];
    let mangaF = [];


    for (i = 0; i < InRanking.length; i++) {
        if (i <= 14) {
            if (InRanking[i] != null) mangaA.push(InRanking[i]);
        } else if (i <= 29 && i > 14) {
            if (InRanking[i] != null) mangaB.push(InRanking[i]);
        } else if (i <= 44 && i > 29) {
            if (InRanking[i] != null) mangaC.push(InRanking[i]);
        } else if (i <= 59 && i > 44) {
            if (InRanking[i] != null) mangaD.push(InRanking[i]);
        } else if (i <= 74 && i > 59) {
            if (InRanking[i] != null) mangaE.push(InRanking[i]);
        } else if (i <= 89 && i > 74) {
            if (InRanking[i] != null) mangaF.push(InRanking[i]);
        }
    }

    for (i = 0; i < notInRanking.length; i++) {
        if (mangaA.length < 15) {
            if (notInRanking[i] != null) mangaA.push(notInRanking[i]);
        } else if (mangaB.length < 30) {
            if (notInRanking[i] != null) mangaB.push(notInRanking[i]);
        } else if (mangaC.length < 45) {
            if (notInRanking[i] != null) mangaC.push(notInRanking[i]);
        } else if (mangaD.length < 60) {
            if (notInRanking[i] != null) mangaD.push(notInRanking[i]);
        } else if (mangaE.length < 75) {
            if (notInRanking[i] != null) mangaE.push(notInRanking[i]);
        } else if (mangaF.length < 90) {
            if (notInRanking[i] != null) mangaF.push(notInRanking[i]);
        }
    }

    if (mangaA.length > 0) {
        for (i = 0; i < mangaA.length; i++) {
            let data = {
                RegistrationID__c: mangaA[i].regID,
                mangaType__c: 'A',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaA[i].pilotID,
                PilotName__c: mangaA[i].pilotName
            }
            const ev = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaA[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaB.length > 0) {
        for (i = 0; i < mangaB.length; i++) {
            let data = {
                RegistrationID__c: mangaB[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaB[i].pilotID,
                PilotName__c: mangaB[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaB[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaC.length > 0) {
        for (i = 0; i < mangaC.length; i++) {
            let data = {
                RegistrationID__c: mangaC[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaC[i].pilotID,
                PilotName__c: mangaC[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaC[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaD.length > 0) {
        for (i = 0; i < mangaD.length; i++) {
            let data = {
                RegistrationID__c: mangaD[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaD[i].pilotID,
                PilotName__c: mangaD[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaD[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaE.length > 0) {
        for (i = 0; i < mangaE.length; i++) {
            let data = {
                RegistrationID__c: mangaE[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaE[i].pilotID,
                PilotName__c: mangaE[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaE[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaF.length > 0) {
        for (i = 0; i < mangaF.length; i++) {
            let data = {
                RegistrationID__c: mangaF[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaF[i].pilotID,
                PilotName__c: mangaF[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaF[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    await conn.sobject('EventsSP__c').update({
        Id: eventID,
        EventStatus__c: ' insc_fechadas'
    })


    return res.send({
        status: 200,
        message: 'Event updated successfully',
        update: 'Registrations closed'
    })
}

async function closeCampeonatoRegs(req, res) {
    const eventID = req.params.eventID
    //Query que procura por uma inscrição no evento introduzido
    const resultRegs = await conn.sobject("Registration__c").find(
        {
            EventID__c: eventID,
            Payment_State__c: 'paid'
        },
        {
            Id: 1,
            EventID__c: 1,
            PilotID__c: 1,
            Pilot_Name__c: 1
        });

    //Query que procura por todos os eventos
    const resultEvent = await conn.sobject("EventsSP__c").findOne(
        {
            Id: eventID
        },
        {
            Id: 1,
            MinReg__c: 1,
            EventStatus__c: 1
        });

    if (resultEvent.EventStatus__c == 'insc_fechadas') return res.send({
        status: 500,
        message: "This event's registrations are already closed"
    })

    if (resultEvent.EventStatus__c != 'insc_abertas') return res.send({
        status: 500,
        message: "Wrong Event Status received"
    })

    if (resultEvent.MinReg__c > resultRegs.length) return res.send({
        status: 500,
        message: 'Not enough registrations'
    });



    console.log('A tentar organizar pilotos por mangas');

    let nmrMangas = 0;
    console.log(resultRegs.length)
    if (resultRegs.length <= 15) {
        nmrMangas = 1
    } else if (resultRegs.length <= 30 && resultRegs.length > 15) {
        nmrMangas = 2
    } else if (resultRegs.length <= 45 && resultRegs.length > 30) {
        nmrMangas = 3
    } else if (resultRegs.length <= 60 && resultRegs.length > 45) {
        nmrMangas = 4
    } else if (resultRegs.length <= 75 && resultRegs.length > 60) {
        nmrMangas = 5
    } else if (resultRegs.length <= 90 && resultRegs.length > 75) {
        nmrMangas = 6
    }

    console.log("Distribuir os pilotos por " + nmrMangas + " mangas");

    const getRankings = await RankingsCampeonatos.findOne({ numero: "ultimo" });
    if (!getRankings) return res.send({
        status: 500,
        message: 'No ranking records'
    })

    const regs = resultRegs;
    const eventMongo = getRankings;
    const notInRanking = [];
    const InRanking = [];


    for (i = 0; i < regs.length; i++) {
        console.log(i);
        const matchedReg = eventMongo.ranking.find(match => match.PilotID === regs[i].PilotID__c);
        if (!matchedReg || matchedReg == "") {
            let newObjReg = {
                pilotID: regs[i].PilotID__c,
                regID: regs[i].Id,
                pilotName: regs[i].Pilot_Name__c,
                class: 0
            }
            notInRanking.push(newObjReg);
        } else {
            let newObjReg = {
                pilotID: regs[i].PilotID__c,
                regID: regs[i].Id,
                pilotName: regs[i].Pilot_Name__c,
                class: matchedReg.class
            }
            InRanking.push(newObjReg);
        }
    }


    InRanking.sort(function (a, b) { return a.class - b.class });

    let mangaA = [];
    let mangaB = [];
    let mangaC = [];
    let mangaD = [];
    let mangaE = [];
    let mangaF = [];


    for (i = 0; i < InRanking.length; i++) {
        if (i <= 14) {
            if (InRanking[i] != null) mangaA.push(InRanking[i]);
        } else if (i <= 29 && i > 14) {
            if (InRanking[i] != null) mangaB.push(InRanking[i]);
        } else if (i <= 44 && i > 29) {
            if (InRanking[i] != null) mangaC.push(InRanking[i]);
        } else if (i <= 59 && i > 44) {
            if (InRanking[i] != null) mangaD.push(InRanking[i]);
        } else if (i <= 74 && i > 59) {
            if (InRanking[i] != null) mangaE.push(InRanking[i]);
        } else if (i <= 89 && i > 74) {
            if (InRanking[i] != null) mangaF.push(InRanking[i]);
        }
    }

    for (i = 0; i < notInRanking.length; i++) {
        if (mangaA.length < 15) {
            if (notInRanking[i] != null) mangaA.push(notInRanking[i]);
        } else if (mangaB.length < 30) {
            if (notInRanking[i] != null) mangaB.push(notInRanking[i]);
        } else if (mangaC.length < 45) {
            if (notInRanking[i] != null) mangaC.push(notInRanking[i]);
        } else if (mangaD.length < 60) {
            if (notInRanking[i] != null) mangaD.push(notInRanking[i]);
        } else if (mangaE.length < 75) {
            if (notInRanking[i] != null) mangaE.push(notInRanking[i]);
        } else if (mangaF.length < 90) {
            if (notInRanking[i] != null) mangaF.push(notInRanking[i]);
        }
    }

    if (mangaA.length > 0) {
        for (i = 0; i < mangaA.length; i++) {
            let data = {
                RegistrationID__c: mangaA[i].regID,
                mangaType__c: 'A',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaA[i].pilotID,
                PilotName__c: mangaA[i].pilotName
            }
            const ev = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaA[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaB.length > 0) {
        for (i = 0; i < mangaB.length; i++) {
            let data = {
                RegistrationID__c: mangaB[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaB[i].pilotID,
                PilotName__c: mangaB[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaB[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaC.length > 0) {
        for (i = 0; i < mangaC.length; i++) {
            let data = {
                RegistrationID__c: mangaC[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaC[i].pilotID,
                PilotName__c: mangaC[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaC[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaD.length > 0) {
        for (i = 0; i < mangaD.length; i++) {
            let data = {
                RegistrationID__c: mangaD[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaD[i].pilotID,
                PilotName__c: mangaD[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaD[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaE.length > 0) {
        for (i = 0; i < mangaE.length; i++) {
            let data = {
                RegistrationID__c: mangaE[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaE[i].pilotID,
                PilotName__c: mangaE[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaE[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    if (mangaF.length > 0) {
        for (i = 0; i < mangaF.length; i++) {
            let data = {
                RegistrationID__c: mangaF[i].regID,
                mangaType__c: 'B',
                mangaPos__c: i + 1,
                EventID__c: eventID,
                PilotID__c: mangaF[i].pilotID,
                PilotName__c: mangaF[i].pilotName
            }
            const Createmangas = await conn.sobject("MangasPorEvento__c").create(data, (err, result) => {
                //Catch de erros na criação do objeto
                if (err) {
                    console.log("Error: " + err);
                    return res.send("Error: " + err);
                }
                console.log("MangaPorEvento added to salesforce");
            });

            const getUser = await conn.sobject('Pilot__c').findOne({
                Id: mangaF[i].pilotID
            },
                {
                    Phone_Number__c: 1,
                    Email__c: 1,
                    First_Name__c: 1
                });

            const getEvent = await conn.sobject('EventsSP__c').findOne({
                Id: eventID
            },
                {
                    EventName__c: 1,
                    StartDate__c: 1
                });

            twilio.messages.create({
                to: '+351' + getUser.Phone_Number__c,
                from: '+18603976977',
                body: 'Olá ' + getUser.First_Name__c + '.\nFicaste na ' + (i + 1) + 'º posição da manga A para o evento ' + getEvent.EventName__c + '.\nVerifica o teu e-mail para mais informações.\nBoa Sorte e obrigado pela tua participação,\nSP Modelismo'
            })


            //Enviar E-mail
            let users = [
                {
                    name: getUser.First_Name__c,
                    email: getUser.Email__c,
                    eventName: getEvent.EventName__c,
                    pos: i + 1,
                    manga: 'A',
                    dataEvento: getEvent.StartDate__c
                }
            ];

            await mailer.loadTemplate('MangasInfo', users).then((results) => {
                return Promise.all(results.map((result) => {
                    mailer.sendEmail({
                        to: result.context.email,
                        from: 'Federação Portuguesa de Radio Mobilismo',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
                console.log('Email sent');
            });
        }
    }

    await conn.sobject('EventsSP__c').update({
        Id: eventID,
        EventStatus__c: ' insc_fechadas'
    })


    return res.send({
        status: 200,
        message: 'Event updated successfully',
        update: 'Registrations closed'
    })
}

async function getMangasByEvent(req, res) {
    const mangas = await conn.sobject("MangasPorEvento__c").find({
        EventID__c: req.params.eventID
    }, {
        RegistrationID__c: 1,
        mangaType__c: 1,
        mangaPos__c: 1,
        EventID__c: 1,
        PilotID__c: 1,
        PilotName__c: 1
    });

    mangas.sort(function (a, b) { return a.mangaPos__c - b.mangaPos__c });
    return res.send(mangas)
}

async function publishEventFB(req, res) {
    const event = await conn.sobject('EventsSP__c').findOne(
        {
            Id: req.params.eventID
        },
        {
            Id: 1,
            EventName__c: 1,
            EventStatus__c: 1,
            EventType__c: 1,
            InscPrice__c: 1,
            StartDate__c: 1,
            CloseDate__c: 1,
            Track__c: 1,
            MinReg__c: 1,
            Foto__c: 1
        }
    )

    var wallPost = {
        message: `A SPModelismo orgulha-se de hospedar mais um ` + event.EventType__c + `!\n
Contamos contigo para participares e mostrares o que vales no `+ event.EventName__c + `!\n
O evento terá inicio dia `+ event.StartDate__c + ` e acabará dia ` + event.CloseDate__c + `.\n
Para mais informações visita a página oficial do evento.\n
Boa sorte, e vemo-nos na pista!`,
        url: 'https://www.animeunited.com.br/oomtumtu/2020/04/Himouto-Umaru-chan-Doga-Kobo.jpg'
    };

    graph.post("105219125085837/photos", wallPost, function (err, resp) {
        return res.send({ status: 200, message: 'Posted successfully on facebook' })
    });

}

async function publishEventTwitter(req, res) {
    const event = await conn.sobject('EventsSP__c').findOne(
        {
            Id: req.params.eventID
        },
        {
            Id: 1,
            EventName__c: 1,
            EventStatus__c: 1,
            EventType__c: 1,
            InscPrice__c: 1,
            StartDate__c: 1,
            CloseDate__c: 1,
            Track__c: 1,
            MinReg__c: 1,
            Foto__c: 1
        }
    )

    msg = {
        status: `Contamos contigo para participares e mostrares o que vales no ` + event.EventName__c + `!\n
O evento terá inicio dia `+ event.StartDate__c + ` e acabará dia ` + event.CloseDate__c + `.\n
Para mais informações visita a página oficial do evento.\n
Boa sorte, e vemo-nos na pista!`
    }
    client.post('statuses/update', msg, function (error, tweet, response) {
        if (error) throw error;
        return res.send({ status: 200, message: 'Posted successfully on Twitter' })
    });

}


async function cancelEvent(req, res) {
    const event = await conn.sobject("EventsSP__c").findOne(
        {
            Id: req.params.eventID
        },
        {
            Id: 1,
            EventName__c: 1,
            EventStatus__c: 1,
            EventType__c: 1,
            InscPrice__c: 1,
            StartDate__c: 1,
            CloseDate__c: 1,
            Track__c: 1,
            MinReg__c: 1,
            Foto__c: 1
        }
    )
    const findRegistrations = await conn.sobject("Registration__c").find(
        {
            EventID__c: req.params.eventID
        },
        {
            Id: 1,
            PaypalSaleID__c: 1,
            PilotID__c: 1
        });

    let refundData = {
        amount: {
            total: event.InscPrice__c + (event.InscPrice__c * 0.23),
            currency: 'EUR'
        }
    }

    for (i = 0; i < findRegistrations.length; i++) {
        console.log("Refunding saleID " + findRegistrations[i].PaypalSaleID__c);
        console.log("Refunding user " + findRegistrations[i].PilotID__c);
        const user = await conn.sobject("Pilot__c").findOne(
            {
                Id: findRegistrations[i].PilotID__c
            },
            {
                First_Name__c: 1,
                Email__c: 1
            });

        paypal.sale.refund(findRegistrations[i].PaypalSaleID__c, refundData, function (error, refund) {
            if (error) {
                console.error(JSON.stringify(error));
            } else {
                console.log("Refund Sale Response");
                console.log(JSON.stringify(refund));
            }
        });

        const updatedEvent = await conn.sobject('Registration__c').update({
            Id: findRegistrations[i].Id,
            Payment_State__c: 'refunded'
        })

        //Enviar E-mail
        let users = [
            {
                name: user.First_Name__c,
                email: user.Email__c,
                eventName: event.EventName__c,
                valor: event.InscPrice__c + (event.InscPrice__c * 0.23)
            }
        ];

        mailer.loadTemplate('Refund', users).then((results) => {
            return Promise.all(results.map((result) => {
                mailer.sendEmail({
                    to: result.context.email,
                    from: 'SP Modelismo',
                    subject: result.email.subject,
                    html: result.email.html,
                    text: result.email.text,
                });
            }));
        }).then(() => {
            console.log('Email sent to ' + user.Email__c);
        });
    }

    const updatedEvent = await conn.sobject('EventsSP__c').update({
        Id: req.params.eventID,
        EventStatus__c: 'cancelado'
    })

    return res.send({
        event: event,
        regsToRefund: findRegistrations
    });
}


//Export de funcoes
module.exports = {
    getTracks: getTracks,
    createTrack: createTrack,
    getEvents: getEvents,
    createEvent: createEvent,
    getTrackByID: getTrackByID,
    getEventByID: getEventByID,
    getRegistrationByEventID: getRegistrationByEventID,
    deleteTrackByID: deleteTrackByID,
    deleteEventByID: deleteEventByID,
    getAllLicenses: getAllLicenses,
    getUserByLicenseID: getUserByLicenseID,
    getLicenseByLicenseNumber: getLicenseByLicenseNumber,
    getFedRequests: getFedRequests,
    getAllWO: getAllWO,
    updateEvent: updateEvent,
    acceptFedRequest: acceptFedRequest,
    getInvoiceByID: getInvoiceByID,
    getInvoices: getInvoices,
    closeTrofeuRegs: closeTrofeuRegs,
    closeCampeonatoRegs: closeCampeonatoRegs,
    getMangasByEvent: getMangasByEvent,
    publishEventFB: publishEventFB,
    cancelEvent: cancelEvent,
    publishEventTwitter: publishEventTwitter
}