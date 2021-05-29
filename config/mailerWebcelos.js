const nodemailer = require('nodemailer'),
transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'webcelosisi@gmail.com',
        pass: 'isi2021aaa',
    },
}),
EmailTemplate = require('email-templates').EmailTemplate,
path = require('path'),
Promise = require('bluebird');

function sendEmail (obj) {
    return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts){
    let template = new EmailTemplate(path.join(__dirname, '../EmailTemplates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if(err) reject (err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}

module.exports={
    sendEmail: sendEmail,
    loadTemplate: loadTemplate
}

