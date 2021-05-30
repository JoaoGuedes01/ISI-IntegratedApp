const accountSid = "AC7a78771df82b5658f76d10c6c6e3057b";
const authToken = "78fc7afcb9d6d179754d163efd594a4c";
const client = require('twilio')(accountSid, authToken);

module.exports = client;