const configFile = require('./salesforce.json')
const jsforce = require('jsforce');
const conn = new jsforce.Connection({
    loginUrl: configFile.SF_LOGIN_URL
});

conn.login(configFile.SF_USERNAME, configFile.SF_PASSWORD + configFile.SF_TOKEN, (err, userInfo) => {
    if (err) {
        console.log("Error: " + err);
        return
    }
    console.log("Connection to salesforce successful");
});

module.exports = conn;