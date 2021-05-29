const mongoose = require('mongoose');

const rankingTrofeuSchema = new mongoose.Schema({
    eventID: {
        type: String,
        trim:true,
        required:true
    },
    numero: {
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

module.exports = mongoose.model('rankingsTrofeus', rankingTrofeuSchema);