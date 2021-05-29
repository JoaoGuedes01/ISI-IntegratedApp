const mongoose = require('mongoose');

const rankingCampeonatoSchema = new mongoose.Schema({
    eventID: {
        type: String,
        trim:true,
        required:true
    },
    nomeEvento: {
        type: String,
        trim:true,
        required:true
    },
    ranking: { type : Array , "default" : [] }
    
})

module.exports = mongoose.model('rankingsCampeonatos', rankingCampeonatoSchema);