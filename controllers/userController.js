const conn = require('../config/salesforce');
const paypal = require('paypal-rest-sdk');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const easyinvoice = require('easyinvoice');
const License = require('../models/License')
const mailer = require('../config/mail');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const tokensecret = "OJoaoGuedeséOmelhorProgramadorQueExiste";
const jwtDecode = require('jwt-decode');
const hubspotClient = require('../config/hubspot');
const { contactsModels } = require('@hubspot/api-client');


//Multer Config
const storage = multer.diskStorage({
    destination: './img/pilots',
    filename: function (req, file, cb) {
        //Extrair o token da cookie
        const token = req.cookies.SessionToken;
        if (!token) {
            res.status(400).json({ message: 'There is no logged user' });
        }

        //Descodificar o token com o secret
        const decoded = jwtDecode(token);
        userid = decoded.userID;
        cb(null, userid + '.png');
    }

});

const upload = multer({
    storage: storage,
    //limite de dados
    // limits:{fileSize: 1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('imagem');

function checkFileType(file, cb) {
    //extencoes permitidas
    const filetypes = /jpeg|jpg|png|gig/;
    //verificar extensao
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWTZYBESnrsKeXaAGPNcLltFAHGk7tF8P-uMx1j3o-6SpYl8_UunEcXZA9G2-yLnuTaY5wSQB1dWOW9n',
    'client_secret': 'EHCu_fmCy05xJvHpdNUYoHEQmy0v8os0XOiNeYCvXmzktyMpoJM1FyZncV66BeFIoOLtRnrDjzmxWb2Y'
});

async function isLoggedIn(req, res) {
    return res.status(200).send({
        status: 200,
        message: "User is logged in"
    })
}

async function getLoggedUser(req, res) {

    //Extrair o token da cookie
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;
    //Query que procura por um utilizador com o email introduzido
    const result = await conn.sobject("Pilot__c").find(
        {
            Id: userid
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
            Password__c: 1,
            Foto__c: 1
        });

    //Verificação da existencia do utilizador
    if (result == "") return res.status(404).send({
        status: req.status,
        message: "No user found"
    })
    const user = result[0];
    return res.send(user);
}

async function getLoggedLicense(req, res) {
    //Extrair o token da cookie
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;
    //Query que procura por um utilizador com o email introduzido
    const result = await conn.sobject("Pilot__c").find(
        {
            Id: userid
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
            Password__c: 1,
            License_Number__c: 1
        });


    console.log(result[0].License_Number__c)
    //Query que procura por uma inscrição no evento introduzido
    const resultLicense = await conn.sobject("License__c").find(
        {
            Id: result[0].License_Number__c,
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
            License_Number__c: 1
        });

    const license = resultLicense[0];
    if (license == '' || license == null) return res.send({
        status: 404,
        message: 'No license found'
    })
    return res.send(license);
}

async function getUserByID(req, res) {

    //Query que procura por um utilizador com o email introduzido
    const result = await conn.sobject("Pilot__c").find(
        {
            Id: req.params.userID
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

async function register(req, res) {

    //Verificação da confirmação de password
    if (req.body.Password != req.body.Rep_Password) return res.status(400).send({
        status: req.status,
        message: 'Passwords do not match'
    });

    //Encriptar a Palavra-Passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password, salt);

    let activationCode = Math.random().toString(36).substring(2);

    //Criar o objeto Piloto no ERP
    const createdUser = await conn.sobject("Pilot__c").create({
        First_Name__c: req.body.First_Name__c,
        Last_Name__c: req.body.Last_Name__c,
        Email__c: req.body.Email__c,
        Password__c: hashedPassword,
        Birth_Date__c: Date.parse(req.body.Birth_Date__c),
        Phone_Number__c: req.body.Phone_Number__c,
        License_Number__c: "no license",
        Identifier__c: req.body.Identifier__c,
        Identifier_Name__c: req.body.Identifier_Name__c,
        NIF__c: req.body.NIF__c,
        Postal_Code__c: req.body.Postal_Code__c,
        Address__c: req.body.Address__c,
        City__c: req.body.City__c,
        Ativado__c: 'nao',
        Codigo_Ativacao__c: activationCode,
        Foto__c: 'Nao'
    }, (err, result) => {

        //Catch de erros na criação do objeto
        if (err) {
            console.log("Error: " + err);
            return res.send("Error: " + err);
        }
    });

    let userId = createdUser.id;

    //Enviar E-mail
    let users = [
        {
            name: req.body.First_Name__c,
            email: req.body.Email__c,
            activationCode: activationCode,
            userId: userId
        }
    ];

    mailer.loadTemplate('welcome', users).then((results) => {
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
        console.log('Email sent');
    });

    //Caso corra tudo bem
    return res.send({
        status: 200,
        message: "Pilot created successfully, email with activation code sent to " + req.body.Email__c
    });
}

async function activateAccount(req, res) {
    //Query que procura por um utilizador com o email introduzido
    const resultPilot = await conn.sobject("Pilot__c").find(
        {
            Id: req.params.userId,
            Codigo_Ativacao__c: req.params.activationCode
        },
        {
            Id: 1
        });
    if (resultPilot[0] == "" || resultPilot[0] == null) return res.send({ status: 404, message: 'No combination of user and activation code found' });


    //Query que procura por um utilizador com o email introduzido
    const updatePilot = await conn.sobject("Pilot__c").update(
        {
            Id: req.params.userId,
            Ativado__c: 'sim'
        });

    return res.sendFile(path.join(__dirname, '../HTML', 'activationSuccess.html'));

}

async function login(req, res) {
    try {
        //Query que procura por um utilizador com o email introduzido
        const result = await conn.sobject("Pilot__c").find(
            {
                Email__c: req.body.email
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
                Password__c: 1,
                Ativado__c: 1
            });

        if (result[0].Ativado__c != 'sim') return res.send({
            status: 500,
            message: 'Account not activated'
        })

        //Verificação da existencia do utilizador
        if (!result) return res.status(404).send({
            status: req.status,
            message: "No user found"
        })
        const user = result[0];

        //Caso o Email exista, compara-se as passwords
        const validPassword = await bcrypt.compare(req.body.password, user.Password__c);
        if (!validPassword) return res.status(400).send({
            status: res.status,
            message: 'Password not valid'
        });

        //Se estiver tudo certo faz login, cria um jwt com id e role e guarda-o numa cookie httpOnly:true
        const token = jwt.sign({ userID: user.Id, role: 'user' }, tokensecret);
        return res.cookie('SessionToken', token, {
            httpOnly: true
            /*sameSite:'none',
            secure: true*/
        }).send({
            status: res.status,
            message: 'Login Successful',
            user: user
        });
    } catch (error) {
        res.send(error);
    }
}

async function RegisterInEvent(req, res) {
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;

    //Query que procura por um utilizador com o email introduzido
    const resultPilot = await conn.sobject("Pilot__c").find(
        {
            Id: userid
        },
        {
            License_Number__c: 1
        });

    if (resultPilot[0].License_Number__c == 'no license') return res.send({ status: 500, message: 'Cant register without license' })

    const resultLicense = await conn.sobject("License__c").find(
        {
            Id: resultPilot[0].License_Number__c
        },
        {
            License_Type__c: 1
        });

    const resultPilotFL = await conn.sobject("Pilot__c").findOne(
        {
            Id: userid
        },
        {
            First_Name__c: 1,
            Last_Name__c: 1
        });

    if (resultLicense[0] == '' || resultLicense[0] == null) return res.send({
        status: 500,
        message: 'You need a license to participate in any events'
    })


    let data = {
        PilotID__c: userid,
        PilotCar__c: req.body.PilotCar__c,
        CarMotor__c: req.body.CarMotor__c,
        CarTransponder__c: req.body.CarTransponder__c,
        Radio__c: req.body.Radio__c,
        MechanicName__c: req.body.MechanicName__c,
        MechanicEmail__c: req.body.MechanicEmail__c,
        MechanicPhone__c: req.body.MechanicPhone__c,
        Table__c: req.body.Table__c,
        EventID__c: req.body.EventID__c,
        Payment_State__c: 'unpaid',
        Pilot_Name__c: resultPilotFL.First_Name__c + " " + resultPilotFL.Last_Name__c
    }

    const resultEvent = await conn.sobject("EventsSP__c").findOne(
        {
            Id: data.EventID__c
        },
        {
            Id: 1,
            EventStatus__c: 1,
            EventType__c: 1,
            Track__c: 1

        }, (err, data) => {
            if (err) return { status: "error", error: err };
            return { status: "success", data: data }
        });

    if (resultEvent.EventType__c == 'trofeu' && resultLicense[0].License_Type__c != 'lazer') {
        if (resultEvent.EventType__c == 'trofeu' && resultLicense[0].License_Type__c != 'nacional') {
            return res.send({ status: 500, message: 'You need a License to participate' })
        }
    }

    if (resultEvent.data.EventType__c == 'campeonatoN' && resultLicense[0].License_Type__c != 'nacional') return res.send({ status: 500, message: 'You need a nacional license to participate' });

    console.log(resultEvent)
    if (resultEvent.status == "error") {
        return res.send("There was an error creating the registration")
    } else if (resultEvent.data == '' || resultEvent.data == null) {
        return res.send("There's no event with that ID")
    } else if (resultEvent.data.EventStatus__c != "insc_abertas") {
        return res.send({ status: 400, message: "Registrations aren't open" })
    }

    //Query que procura por uma pista com o id introduzido
    const resultTrack = await conn.sobject("Track__c").findOne(
        {
            Id: resultEvent.data.Track__c
        },
        {
            Tables__c: 1
        });

    const parsedTables = JSON.parse(resultTrack.Tables__c);
    console.log(parsedTables)

    for (i = 0; i < parsedTables.tables.length; i++) {
        if (parsedTables.tables[i].tableNumber == data.Table__c) {
            const tablecapacity = parsedTables.tables[i].capacity;
            const resultRegistrations = await conn.sobject("Registration__c").find(
                {
                    Table__c: parsedTables.tables[i].tableNumber,
                    EventID__c: data.EventID__c
                },
                {
                    Id: 1
                });
            if (resultRegistrations.length >= tablecapacity) return res.send({
                status: 500,
                message: 'This table is full'
            });
        }
    }

    const resultReg = await conn.sobject("Registration__c").find(
        {
            PilotID__c: userid,
            EventID__c: data.EventID__c
        },
        {
            Id: 1,
            Payment_State__c: 1
        });

    let reg;

    if (resultReg == "") {
        //Criar o objeto Registo no ERP
        const unpaidReg = await conn.sobject("Registration__c").create(data, (err, result) => {
            //Catch de erros na criação do objeto
            if (err) {
                console.log("Error: " + err);
                return res.send("Error: " + err);
            }
        })
        console.log('criado')
        reg = unpaidReg;
    } else if (resultReg[0].Payment_State__c != 'paid') {
        //Atualizar o Objeto encontrado
        const unpaidReg = await conn.sobject("Registration__c").update({
            Id: resultReg[0].Id,
            PilotCar__c: data.PilotCar__c
        });
        console.log('atualizado')

        reg = unpaidReg;
    } else {
        //Se ja estiver 'paid' quer dizer que ja esta inscrito no evento
        return res.send({
            status: 500,
            message: 'Already Registered'
        })
    };

    //Query que procura por todos os eventos
    const event = await conn.sobject("EventsSP__c").findOne(
        {
            Id: data.EventID__c
        },
        {
            Id: 1,
            EventName__c: 1,
            EventStatus__c: 1,
            EventType__c: 1,
            InscPrice__c: 1,
            StartDate__c: 1,
            CloseDate__c: 1,
            Track__c: 1
        });

    console.log(reg.id);
    const precoIVA = event.InscPrice__c + (event.InscPrice__c * 0.23);
    var subTotalFormatted = parseFloat(precoIVA).toFixed(2);
    console.log(subTotalFormatted);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://127.0.0.1:3000/api/user/successRegEvent/" + subTotalFormatted + '/' + reg.id,
            "cancel_url": "http://127.0.0.1:3000/api/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": 'Inscrição em ' + event.EventName__c,
                    "price": subTotalFormatted,
                    "currency": "EUR",
                    "quantity": "1"
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": precoIVA
            },
            "description": "Inscrição num evento"
        }]
    };
    console.log(create_payment_json)

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response)
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({
                        forwardLink: payment.links[i].href
                    });
                }
            }

        }
    });
}

async function successRegPayment(req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("total:" + req.params.total);
    console.log("regID:" + req.params.regID);
    const total = req.params.total;
    const regID = req.params.regID;
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": total
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            //Query que procura por todos os eventos
            const updateReg = await conn.sobject("Registration__c").update(
                {
                    Id: regID,
                    Payment_State__c: 'paid',
                    PaypalSaleID__c: payment.transactions[0].related_resources[0].sale.id
                });
            const getUserFromReg = await conn.sobject("Registration__c").find(
                {
                    Id: regID
                },
                {
                    PilotID__c: 1,
                    EventID__c: 1
                });

            const user = await conn.sobject("Pilot__c").find(
                {
                    Id: getUserFromReg[0].PilotID__c
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

            const getEventDetails = await conn.sobject("EventsSP__c").find(
                {
                    Id: getUserFromReg[0].EventID__c
                },
                {
                    EventName__c: 1,
                    InscPrice__c: 1
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
                "logo": "https://i.ibb.co/BVBJL0j/download.png", //or base64
                //"logoExtension": "png", //only when logo is base64
                "sender": {
                    "company": "SP Modelismo",
                    "address": "Rua dos Limoeiros nº4",
                    "zip": "4700-710",
                    "city": "Braga",
                    "country": "Portugal"
                    //"custom1": "custom value 1",
                    //"custom2": "custom value 2",
                    //"custom3": "custom value 3"
                },
                "client": {
                    "company": user[0].First_Name__c + " " + user[0].Last_Name__c,
                    "address": user[0].Address__c,
                    "zip": user[0].Postal_Code__c,
                    "city": user[0].City__c,
                    "country": "Porgutal"
                    //"custom1": "custom value 1",
                    //"custom2": "custom value 2",
                    //"custom3": "custom value 3"
                },
                "invoiceNumber": regID,
                "invoiceDate": finalData,
                "products": [
                    {
                        "quantity": "1",
                        "description": "Inscrição no evento " + getEventDetails[0].EventName__c,
                        "tax": 23,
                        "price": getEventDetails[0].InscPrice__c
                    }
                ],
                "bottomNotice": "Documento Fatura-Recibo"
            };

            //Create your invoice! Easy!
            easyinvoice.createInvoice(invoice, async function (result) {
                //The response will contain a base64 encoded PDF file
                await fs.writeFileSync('./invoices/' + regID + '.pdf', result.pdf, 'base64');

            });

            await conn.sobject("InvoiceCustom__c").create({
                invoiceID__c: regID,
                userID__c: getUserFromReg[0].PilotID__c,
                TimeStamp__c: finalData
            }, (err, result) => {
                if (err) return res.send(err)
            });

            //Enviar E-mail
            let users = [
                {
                    name: user[0].First_Name__c,
                    email: user[0].Email__c,
                    invoiceID: regID,
                    description: "Inscrição no evento " + getEventDetails[0].EventName__c,
                    price: getEventDetails[0].InscPrice__c + (getEventDetails[0].InscPrice__c * 0.23)
                }
            ];

            await mailer.loadTemplate('payment', users).then((results) => {
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
                console.log('Email sent');
            });

            return res.sendFile(path.join(__dirname, '../HTML', 'paymentSuccess.html'));
        }

    })
}

async function getEvents(req, res) {
    try {
        //Extrair o token da cookie
        const token = req.cookies.SessionToken;
        if (!token) {
            res.status(400).json({ message: 'There is no logged user' });
        }

        //Descodificar o token com o secret
        const decoded = jwtDecode(token);
        userid = decoded.userID;

        let allEvents = [];
        let userRegs = [];
        let notRegs = [];
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
                Track__c: 1
            });

        const getUserRegs = await conn.sobject("Registration__c").find(
            {
                PilotID__c: userid
            },
            {
                EventID__c: 1
            });


        for (i = 0; i < result.length; i++) {
            console.log(result[i].Id)
            allEvents.push(result[i].Id);
        }

        for (i = 0; i < getUserRegs.length; i++) {
            console.log(getUserRegs[i].EventID__c)
            userRegs.push(getUserRegs[i].EventID__c);
        }

        for (i = 0; i < allEvents.length; i++) {
            if(userRegs.includes(allEvents[i])){
                console.log('inclui');
            }else{
                notRegs.push(allEvents[i])
            }
        }

        return res.send({
            all: allEvents,
            userRegs: userRegs,
            notRegs: notRegs
        });

        //Caso haja eventos criados


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
                Track__c: 1
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

async function successLicensePayment(req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("total:" + req.params.total);
    console.log("licenseID:" + req.params.licenseID);
    console.log("totalSiva:" + req.params.totalSiva);
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": req.params.total
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            conn.sobject("License__c").update(
                {
                    Id: req.params.licenseID,
                    State__c: 'paid'
                });

            const license = await conn.sobject("License__c").find(
                {
                    Id: req.params.licenseID
                },
                {
                    Name: 1,
                    userID__c: 1,
                    First_Name__c: 1,
                    Last_Name__c: 1,
                    Birth_Date__c: 1,
                    Phone_Number__c: 1,
                    CC__c: 1,
                    Identifier_Name__c: 1,
                    NIF__c: 1,
                    Postal_Code__c: 1,
                    Address__c: 1,
                    City__c: 1,
                    License_Type__c: 1,
                    License_Number__c: 1
                });

            await conn.sobject("Pilot__c").update(
                {
                    Id: license[0].userID__c,
                    First_Name__c: license[0].First_Name__c,
                    Last_Name__c: license[0].Last_Name__c,
                    Birth_Date__c: license[0].Birth_Date__c,
                    Phone_Number__c: license[0].Phone_Number__c,
                    Identifier__c: license[0].CC__c,
                    Identifier_Name__c: license[0].Identifier_Name__c,
                    NIF__c: license[0].NIF__c,
                    Postal_Code__c: license[0].Postal_Code__c,
                    Address__c: license[0].Address__c,
                    City__c: license[0].City__c,
                    License_Number__c: req.params.licenseID
                });

            const user = await conn.sobject("Pilot__c").find(
                {
                    Id: license[0].userID__c
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

            const newLicense = new License({
                licenseNumber: license[0].License_Number__c,
                firstName: license[0].First_Name__c,
                lastName: license[0].Last_Name__c,
                dateOfBirth: license[0].Birth_Date__c,
                phone_number: license[0].Phone_Number__c,
                identifier_CC: license[0].CC__c,
                identifierName: license[0].Identifier_Name__c,
                NIF: license[0].NIF__c,
                postal_code: license[0].Postal_Code__c,
                city: license[0].City__c,
                Address: license[0].Address__c,
                licenseType: license[0].License_Type__c
            });

            await newLicense.save();

            let licenseType;
            if (license[0].License_Type__c == "lazer") licenseType = 'Licensa de Lazer';
            if (license[0].License_Type__c == "nacional") licenseType = 'Licensa Nacional';

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
                "logo": "https://i.ibb.co/BVBJL0j/download.png", //or base64
                //"logoExtension": "png", //only when logo is base64
                "sender": {
                    "company": "SP Modelismo",
                    "address": "Rua dos Limoeiros nº4",
                    "zip": "4700-710",
                    "city": "Braga",
                    "country": "Portugal"
                    //"custom1": "custom value 1",
                    //"custom2": "custom value 2",
                    //"custom3": "custom value 3"
                },
                "client": {
                    "company": user[0].First_Name__c + " " + user[0].Last_Name__c,
                    "address": user[0].Address__c,
                    "zip": user[0].Postal_Code__c,
                    "city": user[0].City__c,
                    "country": "Porgutal"
                    //"custom1": "custom value 1",
                    //"custom2": "custom value 2",
                    //"custom3": "custom value 3"
                },
                "invoiceNumber": req.params.licenseID,
                "invoiceDate": finalData,
                "products": [
                    {
                        "quantity": "1",
                        "description": licenseType,
                        "tax": 23,
                        "price": req.params.totalSiva
                    }
                ],
                "bottomNotice": "Documento Fatura-Recibo"
            };

            //Create your invoice! Easy!
            easyinvoice.createInvoice(invoice, async function (result) {
                //The response will contain a base64 encoded PDF file
                await fs.writeFileSync('./invoices/' + req.params.licenseID + '.pdf', result.pdf, 'base64');

            });



            conn.sobject("InvoiceCustom__c").create({
                invoiceID__c: req.params.licenseID,
                userID__c: license[0].userID__c,
                TimeStamp__c: finalData
            }, (err, result) => {
                if (err) return res.send(err)
            });

            //Enviar E-mail
            let users = [
                {
                    name: user[0].First_Name__c,
                    email: user[0].Email__c,
                    invoiceID: req.params.licenseID,
                    description: licenseType,
                    price: req.params.total
                }
            ];

            await mailer.loadTemplate('payment', users).then((results) => {
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
                console.log('Email sent');
            });

            const contact = {
                properties: {
                    firstname: user[0].First_Name__c,
                    lastname: user[0].Last_Name__c
                }
            };
            console.log(contact)
            const Createdcontact = await hubspotClient.crm.contacts.basicApi.create(contact)

            return res.sendFile(path.join(__dirname, '../HTML', 'paymentSuccess.html'));

        }
    });

}

async function requestLicense(req, res) {
    let licenseID;
    //Extrair o token da cookie
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;

    //Query que procura por um utilizador com o email introduzido
    const user = await conn.sobject("Pilot__c").find(
        {
            Id: userid
        },
        {
            Id: 1,
            Name: 1,
            First_Name__c: 1,
            Last_Name__c: 1,
            Birth_Date__c: 1,
            License_Number__c: 1
        });

    if (user[0].License_Number__c != 'no license') {
        const licenseAtual = await conn.sobject("License__c").findOne({
            Id: user[0].License_Number__c
        }, {
            Id: 1,
            State__c: 1,
            License_Type__c: 1
        });


        if (licenseAtual != null && licenseAtual.License_Type__c == 'nacional' && req.body.License_Type__c == 'lazer') return res.send({ status: 500, message: 'You already have a nacional license' });
    }

    let data = {
        userID__c: userid,
        First_Name__c: user[0].First_Name__c,
        Last_Name__c: user[0].Last_Name__c,
        Birth_Date__c: user[0].Birth_Date__c,
        Phone_Number__c: req.body.Phone_Number__c,
        CC__c: req.body.CC__c,
        Identifier_Name__c: req.body.Identifier_Name__c,
        NIF__c: req.body.NIF__c,
        Postal_Code__c: req.body.Postal_Code__c,
        Address__c: req.body.Address__c,
        City__c: req.body.City__c,
        License_Type__c: req.body.License_Type__c,
        State__c: 'unpaid'
    }



    const license = await conn.sobject("License__c").find({
        userID__c: userid,
        License_Type__c: data.License_Type__c
    }, {
        Id: 1,
        State__c: 1
    });

    if (license == "") {
        console.log('Create')
        const license = await conn.sobject("License__c").create(data, (err, result) => {
            if (err) return res.send(err)
        });
        licenseID = license.id;
    } else {
        if (license[0].State__c == 'paid') return res.send({ status: 500, message: 'Already Bought' });
        console.log('Update');
        conn.sobject("License__c").update(
            {
                Id: req.params.licenseID,
                First_Name__c: user[0].First_Name__c,
                Last_Name__c: user[0].Last_Name__c,
                Birth_Date__c: user[0].Birth_Date__c,
                Phone_Number__c: req.body.Phone_Number__c,
                CC__c: req.body.CC__c,
                Identifier_Name__c: req.body.Identifier_Name__c,
                NIF__c: req.body.NIF__c,
                Postal_Code__c: req.body.Postal_Code__c,
                Address__c: req.body.Address__c,
                City__c: req.body.City__c,
                License_Type__c: req.body.License_Type__c,
                State__c: 'unpaid'
            });
        licenseID = license[0].Id;
    }

    console.log("LicenseID: " + licenseID);

    const licenseTable = await conn.sobject("LicensePrice__c").find({
        LicenseRef__c: data.License_Type__c
    }, {
        Id: 1,
        Name: 1,
        LicenseRef__c: 1,
        Price__c: 1,
        LicenseDescription__c: 1
    });

    let licensePrice = licenseTable[0].Price__c;
    let licensePriceIVA = licensePrice + (licensePrice * 0.23);

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://127.0.0.1:3000/api/user/successLicense/" + licensePrice + "/" + licensePriceIVA + "/" + licenseID,
            "cancel_url": "http://127.0.0.1:3000/api/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": licenseTable[0].Name,
                    "price": licensePriceIVA,
                    "currency": "EUR",
                    "quantity": "1"
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": licensePriceIVA
            },
            "description": licenseTable[0].LicenseDescription__c
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({
                        forwardLink: payment.links[i].href
                    });
                }
            }

        }
    });
}

async function getInvoiceByID(req, res) {
    res.sendFile(path.join(__dirname, '../invoices', req.params.invoiceName + ".pdf"));
}

async function getLoggedInvoices(req, res) {

    //Extrair o token da cookie
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;

    const result = await conn.sobject('InvoiceCustom__c').find(
        {
            userID__c: userid
        },
        {
            invoiceID__c: 1
        }
    )
    return res.send(result);
}

async function updateUserLicense(req, res) {

    //Extrair o token da cookie
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;

    let data = {
        Phone_Number__c: req.body.Phone_Number__c,
        Postal_Code__c: req.body.Postal_Code__c,
        Address__c: req.body.Address__c,
        City__c: req.body.City__c
    }
    console.log(userid);

    const findUserLicense = await conn.sobject("Pilot__c").findOne(
        {
            Id: userid
        },
        {
            License_Number__c: 1
        }
    )


    //Query que procura por um utilizador com o email introduzido
    const updateLicense = await conn.sobject("License__c").update(
        {
            Id: findUserLicense.License_Number__c,
            Phone_Number__c: data.Phone_Number__c,
            Postal_Code__c: data.Postal_Code__c,
            Address__c: data.Address__c,
            City__c: data.City__c
        });




    const findupdatelicense = await conn.sobject("License__c").findOne(
        {
            Id: updateLicense.id
        },
        {
            License_Number__c: 1
        }
    );

    const updatePilot = await conn.sobject("Pilot__c").update(
        {
            Id: userid,
            Phone_Number__c: data.Phone_Number__c,
            Postal_Code__c: data.Postal_Code__c,
            Address__c: data.Address__c,
            City__c: data.City__c
        });

    const mongoLicense = await License.findOne({ licenseNumber: findupdatelicense.License_Number__c });
    if (!mongoLicense) return res.status(400).send({ message: 'License does not exist in the database' });

    mongoLicense.set({
        phone_number: req.body.Phone_Number__c,
        postal_code: req.body.Postal_Code__c,
        Address: req.body.Address__c,
        city: req.body.City__c
    });
    mongoLicense.save();
    return res.send('ok');

}

async function requestPasswordChange(req, res) {
    const userEmail = req.body.email;

    const findPilot = await conn.sobject('Pilot__c').findOne({
        Email__c: userEmail
    }, {
        Id: 1
    });

    let secretCode = Math.random().toString(36).substring(2);

    let PilotSecret = {
        PilotID__c: findPilot.Id,
        Secret__c: secretCode,
        State__c: 'not used'
    }

    const createdPilotSecret = await conn.sobject('PilotSecret__c').create(PilotSecret);


    //Enviar E-mail
    let users = [
        {
            email: userEmail,
            secret: secretCode,
            userID: findPilot.Id
        }
    ];

    mailer.loadTemplate('RequestPassword', users).then((results) => {
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
        console.log('Email sent');
    });

    return res.send({
        secret: PilotSecret.Secret__c,
        pilotID: PilotSecret.PilotID__c
    });
}

async function changePassword(req, res) {

    const findSecret = await conn.sobject('PilotSecret__c').findOne({
        Secret__c: req.params.pilotSecret,
        State__c: 'not used'
    }, {
        Id: 1,
        Secret__c: 1
    });
    if (!findSecret) return res.send({ status: 500, message: 'Invalid Secret' });

    if (req.body.repPass != req.body.password) return res.send({
        status: 500,
        message: 'Passwords do not match'
    })

    //Encriptar a Palavra-Passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const updatedPilot = await conn.sobject('Pilot__c').update({
        Id: req.params.pilotID,
        Password__c: hashedPassword
    });

    const updatedSecret = await conn.sobject('PilotSecret__c').update({
        Id: findSecret.Id,
        State__c: 'used'
    });

    return res.send({
        status: 200,
        message: 'User updated successfully'
    });

}

async function uploadUserFoto(req, res) {
    //Extrair o token da cookie
    const token = req.cookies.SessionToken;
    if (!token) {
        res.status(400).json({ message: 'There is no logged user' });
    }

    //Descodificar o token com o secret
    const decoded = jwtDecode(token);
    userid = decoded.userID;
    console.log(userid)
    upload(req, res, async (err) => {
        if (err) return res.send({ status: 500, message: 'There was an error while uploading the image' });
        if (req.file == undefined) return res.send('No image selected');
        const updatedUser = await conn.sobject('Pilot__c').update(
            {
                Id: userid,
                Foto__c: 'Sim'
            }
        )

    })
    return res.send({ status: 200, message: 'success' });
}

//Export de funcoes
module.exports = {
    isLoggedIn: isLoggedIn,
    register: register,
    login: login,
    getLoggedUser: getLoggedUser,
    RegisterInEvent: RegisterInEvent,
    getUserByID: getUserByID,
    getEvents: getEvents,
    getEventByID: getEventByID,
    getRegistrationByEventID: getRegistrationByEventID,
    requestLicense: requestLicense,
    successLicensePayment: successLicensePayment,
    getInvoiceByID: getInvoiceByID,
    getLoggedInvoices: getLoggedInvoices,
    successRegPayment: successRegPayment,
    getLoggedLicense: getLoggedLicense,
    activateAccount: activateAccount,
    updateUserLicense: updateUserLicense,
    requestPasswordChange: requestPasswordChange,
    changePassword: changePassword,
    uploadUserFoto: uploadUserFoto
}