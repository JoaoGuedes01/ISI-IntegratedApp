const getMoloniToken = require('../config/moloni');
const conn = require('../config/salesforce');
const path = require('path')
const multer = require('multer');
const request = require('request');
const querystring = require('querystring');


//Multer Config
const storage = multer.diskStorage({
    destination: './img/events',
    filename: function (req, file, cb) {
        cb(null, req.params.eventID + '.png');
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


async function getAllRequests(req, res) {
    await getMoloniToken(async (response) => {
        console.log('ayo')
        let access_token = response;
        let data = querystring.stringify({
            company_id: 182132,
            category_id: 3732578,
        });
        var options = {
            method: 'POST',
            url: 'https://api.moloni.pt/v1/products/getAll/?access_token=' + access_token,
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            return res.send(JSON.parse(body));
        });
    });
}

async function getRequestByID(req, res) {
    await getMoloniToken(async (response) => {
        let access_token = response;
        let data = querystring.stringify({
            company_id: 182132,
            product_id: req.params.requestID
        });
        var options = {
            method: 'POST',
            url: 'https://api.moloni.pt/v1/products/getOne/?access_token=' + access_token,
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            return res.send(JSON.parse(body));
        });
    });
}

async function getRequestDeatilsByID(req, res) {
    await getMoloniToken(async (response) => {
        let access_token = response;
        let data = querystring.stringify({
            company_id: 182132,
            product_id: req.params.requestID
        });
        var options = {
            method: 'POST',
            url: 'https://api.moloni.pt/v1/products/getOne/?access_token=' + access_token,
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            let resJson = JSON.parse(body);

            //Query que procura por um utilizador com o email introduzido
            const result = await conn.sobject("EventsSP__c").find(
                {
                    Id: resJson.reference
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


            return res.send({
                moloni: resJson,
                salesforce: result
            });
        });
    });
}

async function sendPromLogo(req, res) {

            conn.sobject('EventsSP__c').update({
                Id: req.params.eventID,
                Foto__c: req.params.eventID
            })

            upload(req,res,(err)=>{
                if(err) return res.send({status:500, message: 'There was an error while uploading the image'});
                if(req.file == undefined) return res.send({status:500, message:'No image selected'});
                return res.send({status:200, message: 'success'});
            })
}

module.exports = {
    getAllRequests: getAllRequests,
    getRequestByID: getRequestByID,
    getRequestDeatilsByID: getRequestDeatilsByID,
    sendPromLogo: sendPromLogo
}
