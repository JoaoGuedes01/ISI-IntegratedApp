const accountSid = "AC7a78771df82b5658f76d10c6c6e3057b";
const authToken = "73ffd2ea39b32c181db359997bf7a279";
const client = require('twilio')(accountSid, authToken);

module.exports = client;