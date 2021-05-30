const hubspotClient = require('../config/hubspot');
const conn = require('../config/salesforce');
const getMoloniToken = require('../config/moloni');
const { all } = require('../routes/adminRoutes');
const querystring = require('querystring');
const easyinvoice = require('easyinvoice');
const mailer = require('../config/mailerFED');
const License = require('../models/License')
const RankingsTrofeus = require('../models/rankingsTrofeus');
const RankingsCampeonatos = require('../models/rankingsCampeonatos');
const fs = require('fs');
const path = require('path');
const request = require('request');

async function getContacts(req, res) {
    const licenses = await License.find();
    return res.send(licenses);
}


async function getAllDeals(req, res) {
    const fields = ['dealname', 'amount', 'dealstage', 'pipeline', 'salesforce_id', 'event_name', 'event_status', 'event_type', 'closedate', 'createdate','minreg'];
    const publicobjectsearchrequest = {
        properties: fields,
        limit: 100
    }
    const allDeals = await hubspotClient.crm.deals.searchApi.doSearch(publicobjectsearchrequest);
    return res.send(allDeals.body);
}

async function getEventByDealEventID(req, res) {
    const fields = { properties: ['dealname', 'salesforce_id'] };
    const allDeals = await hubspotClient.crm.deals.searchApi.doSearch(fields);
    let salesforceID;
    let hubspotObject;
    for (i = 0; i < allDeals.body.results.length; i++) {
        if (allDeals.body.results[i].id == req.params.dealID) {
            salesforceID = allDeals.body.results[i].properties.salesforce_id;
            hubspotObject = allDeals.body.results[i];
            console.log(allDeals.body.results[i].properties.salesforce_id);
        }
    }

    //Query que procura por um evento através do id introduzido
    const result = await conn.sobject("EventsSP__c").find(
        {
            Id: salesforceID
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
            Track__c: 1
        });
    //Verificação de pistas
    if (!result) return res.status(404).send({
        status: req.status,
        message: "No tracks found"
    })

    //Caso existam retorna pistas
    const tracks = result;
    return res.send({
        hubspotObject: hubspotObject,
        salesforceObject: tracks
    });
}

async function updateEvent(req, res) {

    if (req.body.new_status == 'insc_abertas' || req.body.new_status == 'rejeitado') {

        const fields = ['salesforce_id'];
        const publicobjectsearchrequest = {
            properties: fields,
            limit: 100
        }
        const allDeals = await hubspotClient.crm.deals.searchApi.doSearch(publicobjectsearchrequest);
        let dealID = req.body.dealID;
        let salesforceID;
        const dealObj = {
            properties: {
                event_status: req.body.new_status,
            },
        }
        const updatedDeal = await hubspotClient.crm.deals.basicApi.update(dealID, dealObj);
        if (!updatedDeal) return res.send("There was an error updating the Deal");


        for (i = 0; i < allDeals.body.results.length; i++) {
            if (allDeals.body.results[i].id == dealID) {
                console.log('bingo')
                salesforceID = allDeals.body.results[i].properties.salesforce_id;
                console.log(allDeals.body.results[i].properties.salesforce_id);
            }
        }

        const result = await conn.sobject("EventsSP__c").update(
            {
                Id: salesforceID,
                EventStatus__c: req.body.new_status
            });



        const resultEvent = await conn.sobject("EventsSP__c").findOne(
            {
                Id: salesforceID
            }, {
            Id: 1,
            Name: 1,
            EventName__c: 1,
            EventType__c: 1
        });



        const resultWoByEventID = await conn.sobject("Webcelos_Order__c").findOne(
            {
                Reference__c: salesforceID
            },
            {
                Id: 1,
                Campanha__c: 1,
            }
        );
        console.log(resultWoByEventID)

        const updateWo = await conn.sobject("Webcelos_Order__c").update(
            {
                Id: resultWoByEventID.Id,
                Estado__c: 'aceite'
            }
        );




        let Molonidata = {
            company_id: 182132,
            category_id: 3732578,
            type: 2,
            name: "Evento " + resultEvent.EventName__c,
            summary: "evento do tipo: " + resultEvent.EventType__c + "\n",
            reference: salesforceID,
            ean_string: "",
            price: 10.00,
            unit_id: 1,
            has_stock: 1,
            stock: 1.00,
            exemption_reason: '1',
            summary: resultWoByEventID.Campanha__c
        };
        await getMoloniToken(async (response) => {
            let access_token = response;

            var options = {
                method: 'POST',
                url: 'https://api.moloni.pt/v1/products/insert/?access_token=' + access_token,
                headers: {
                    'Content-Length': Molonidata.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: querystring.stringify(Molonidata)
            };
            request(options, function (error, response, body) {
                if (error) return res.send({ status: 400, error: error })
                console.log(body);
            });
        });

        let data = new Date();
        let finalData = data.getDate() + '-' + (data.getMonth() + 1) + '-' + data.getFullYear() + ' / ' + data.getHours() + ':' + data.getMinutes()
        console.log(finalData);


        let invoice = {
            "documentTitle": "FATURA", //Defaults to INVOICE
            "currency": "EUR",
            "taxNotation": "vat", //or gst
            "marginTop": 25,
            "marginRight": 25,
            "marginLeft": 25,
            "marginBottom": 25,
            "logo": "https://i.ibb.co/R9WZCJ5/fepra-Sgundop.png", //or base64
            //"logoExtension": "png", //only when logo is base64
            "sender": {
                "company": "Federação Portuguesa de Radio Mobilismo",
                "address": "Rua Nossa Senhora dos Copianços",
                "zip": "4900-915",
                "city": "Porto",
                "country": "Portugal"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            "client": {
                "company": 'SP Modelismo',
                "address": "Rua dos Limoeiros nº4",
                "zip": "4700-710",
                "city": "Braga",
                "country": "Portugal"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            "invoiceNumber": salesforceID,
            "invoiceDate": finalData,
            "products": [
                {
                    "quantity": "1",
                    "description": "Criação de Troféu " + resultEvent.EventName__c,
                    "tax": 23,
                    "price": "100.00"
                }
            ],
            "bottomNotice": "Documento Fatura-Recibo"
        };

        //Create your invoice! Easy!
        easyinvoice.createInvoice(invoice, async function (result) {
            //The response will contain a base64 encoded PDF file
            await fs.writeFileSync('./invoicesFED/' + salesforceID + '.pdf', result.pdf, 'base64');

        });

        await conn.sobject("InvoiceCustom__c").create({
            invoiceID__c: salesforceID,
            userID__c: 'SP',
            TimeStamp__c: finalData
        }, (err, result) => {
            if (err) return res.send(err)
        });

        //Enviar E-mail
        let users = [
            {
                name: 'SP',
                email: 'spmodelismoisi@gmail.com',
                invoiceID: salesforceID,
                eventName: resultEvent.EventName__c,
                description: "Criar Troféu",
                price: 123
            }
        ];

        await mailer.loadTemplate('paymentSPFED', users).then((results) => {
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

        let campanhaArray = resultWoByEventID.Campanha__c;
        let resCampanhaArray = JSON.parse(campanhaArray)
        let bigArr = [];
        let bigArr2 = [];
        for (i = 0; i < resCampanhaArray.properties.length; i++) {
            console.log(resCampanhaArray.properties[i]);
            if (resCampanhaArray.properties[i] == 'cmd') {
                let json = {
                    "quantity": "1",
                    "description": "Campanha de Marketing Digital",
                    "tax": 23,
                    "price": "150.00"
                }
                bigArr.push(json);
                bigArr2.push("\n" + json.description);
            } else if (resCampanhaArray.properties[i] == 'cf') {
                let json = {
                    "quantity": "1",
                    "description": "Campanha de Marketing Física",
                    "tax": 23,
                    "price": "80.00"
                }
                bigArr.push(json);
                bigArr2.push("\n" + json.description);

            } else if (resCampanhaArray.properties[i] == 'l') {
                let json = {
                    "quantity": "1",
                    "description": "Logotipo à medida",
                    "tax": 23,
                    "price": "45.00"
                }
                bigArr.push(json);
                bigArr2.push("\n" + json.description);
            } else if (resCampanhaArray.properties[i] == 'cfoto') {
                let json = {
                    "quantity": "1",
                    "description": "Campanha fotográfica",
                    "tax": 23,
                    "price": "800.00"
                }
                bigArr.push(json);
                bigArr2.push("\n" + json.description);
            } else if (resCampanhaArray.properties[i] == 'cvid') {
                let json = {
                    "quantity": "1",
                    "description": "Campanha de Vídeo",
                    "tax": 23,
                    "price": "1500.00"
                }
                bigArr.push(json);
                bigArr2.push("\n" + json.description);
            } else if (resCampanhaArray.properties[i] == 'di') {
                let json = {
                    "quantity": "1",
                    "description": "Divulgação a indexadores",
                    "tax": 23,
                    "price": "450.00"
                }
                bigArr.push(json);
                bigArr2.push("\n" + json.description);
            }
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let invoiceWebcelos = {
            "documentTitle": "FATURA", //Defaults to INVOICE
            "currency": "EUR",
            "taxNotation": "vat", //or gst
            "marginTop": 25,
            "marginRight": 25,
            "marginLeft": 25,
            "marginBottom": 25,
            "logo": "https://i.ibb.co/d2wdzzk/logo.png", //or base64
            //"logoExtension": "png", //only when logo is base64
            "sender": {
                "company": "Webcelos",
                "address": "Rua da Bicha",
                "zip": "4500-620",
                "city": "Barcelos",
                "country": "Portugal"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            "client": {
                "company": 'SP Modelismo',
                "address": "Rua dos Limoeiros nº4",
                "zip": "4700-710",
                "city": "Braga",
                "country": "Portugal"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            "invoiceNumber": resultWoByEventID.Id,
            "invoiceDate": finalData,
            "products": bigArr,
            "bottomNotice": "Documento Fatura-Recibo"
        };

        //Create your invoice! Easy!
        easyinvoice.createInvoice(invoiceWebcelos, async function (result) {
            //The response will contain a base64 encoded PDF file
            await fs.writeFileSync('./invoicesFED/' + resultWoByEventID.Id + '.pdf', result.pdf, 'base64');

        });

        await conn.sobject("InvoiceCustom__c").create({
            invoiceID__c: resultWoByEventID.Id,
            userID__c: 'SP',
            TimeStamp__c: finalData
        }, (err, result) => {
            if (err) return res.send(err)
        });

        //Enviar E-mail
        let users2 = [
            {
                name: 'SP',
                email: 'spmodelismoisi@gmail.com',
                invoiceID: resultWoByEventID.Id,
                description: "Criar Troféu",
                price: 123,
                bigArr: bigArr2
            }
        ];

        await mailer.loadTemplate('paymentWebcelos', users2).then((results) => {
            return Promise.all(results.map((result) => {
                mailer.sendEmail({
                    to: result.context.email,
                    from: 'Webcelos',
                    subject: result.email.subject,
                    html: result.email.html,
                    text: result.email.text,
                });
            }));
        }).then(() => {
            console.log('Email sent');
        });

        return res.send({ status: 200, message: "The deal was updated successfully" });
    } else {
        return res.send({ status: 500, message: 'Nao estava a espera dessa status :v' })
    }


}

async function getTickets(req, res) {
    const fields = ['event_name', 'eventtype', 'inscprice', 'trackid', 'subject', 'hs_pipeline', 'hs_pipeline_stage', 'content', 'closed_date','minreg'];
    const publicobjectsearchrequest = {
        properties: fields,
        limit: 100
    }
    const allTickets = await hubspotClient.crm.tickets.searchApi.doSearch(publicobjectsearchrequest);
    return res.send(allTickets.body);
}

async function createTicket(req, res) {
    const ticket = {
        properties: {
            subject: req.body.event_name,
            hs_pipeline: '0',
            hs_pipeline_stage: "2",
            content: req.body.content,
            createdate: req.body.createdate,
            closed_date: req.body.closed_date,
            trackid: req.body.trackid,
            inscprice: req.body.inscprice,
            eventtype: req.body.eventtype,
            event_name: req.body.event_name,
            minreg: req.body.minreg
        }
    };

    const createdTicket = await hubspotClient.crm.tickets.basicApi.create(ticket);
    if (!createdTicket) return res.send({ status: 400, message: 'Error creating Deal in Hubspot' });
    let requestData = {
        EventName__c: ticket.properties.event_name,
        EventType__c: ticket.properties.eventtype,
        StartDate__c: ticket.properties.createdate,
        EndDate__c: ticket.properties.closed_date,
        InscPrice__c: ticket.properties.inscprice,
        EventDesc__c: ticket.properties.content,
        TrackID__c: ticket.properties.trackid,
        Request_Status__c: 'Pendente',
        HubspotID__c: createdTicket.response.body.id,
        MinReg__c: ticket.properties.minreg
    }

    const ev = await conn.sobject("FED_Requests__c").create(requestData, (err, result) => {
        //Catch de erros na criação do objeto
        if (err) {
            console.log("Error: " + err);
            return res.send("Error: " + err);
        }
        console.log("Request sent to salesforce");
    });

    return res.send({
        status: 200,
        hubspot: 'ok',
        salesforce: 'ok'
    });
}

async function getTicketByID(req, res) {
    const fields = { properties: ['event_name', 'eventtype', 'inscprice', 'trackid', 'subject', 'hs_pipeline', 'hs_pipeline_stage', 'content', 'closed_date'] };
    const allTickets = await hubspotClient.crm.tickets.searchApi.doSearch(fields);

    for (i = 0; i < allTickets.body.results.length; i++) {
        if (allTickets.body.results[i].id == req.params.ticketID) {
            return res.send(allTickets.body.results[i]);
        }
    }

    return res.send({
        status: 200,
        message: 'No ticket found'
    })
}

async function getRankingsTrofeus(req,res){
    const rankingsTrofeus = await RankingsTrofeus.find();
    return res.send(rankingsTrofeus);
}

async function getRankingsTrofeusByEventID(req,res){
    const rankingsTrofeus = await RankingsTrofeus.findOne({eventID: req.params.eventID});
    return res.send(rankingsTrofeus);
}

async function getRankingsCampeonatos(req,res){
    const rankingsCampeonatos = await RankingsCampeonatos.find();
    return res.send(rankingsCampeonatos);
}

async function getRankingsCampeonatosByEventID(req,res){
    const rankingsCampeonatos = await RankingsCampeonatos.findOne({eventID: req.params.eventID});
    return res.send(rankingsCampeonatos);
}

module.exports = {
    getAllDeals: getAllDeals,
    getEventByDealEventID: getEventByDealEventID,
    updateEvent: updateEvent,
    getTickets: getTickets,
    createTicket: createTicket,
    getTicketByID: getTicketByID,
    getContacts: getContacts,
    getRankingsTrofeus: getRankingsTrofeus,
    getRankingsTrofeusByEventID: getRankingsTrofeusByEventID,
    getRankingsCampeonatos: getRankingsCampeonatos,
    getRankingsCampeonatosByEventID: getRankingsCampeonatosByEventID
}