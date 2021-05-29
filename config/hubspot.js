const hubspot = require('@hubspot/api-client')
const hubspotClient = new hubspot.Client({ apiKey: 'a19bcd48-5dda-45df-b7f9-323e72b2a975' })

module.exports = hubspotClient;