const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        trim:true,
        required:true
    },
    firstName: {
        type: String,
        trim:true,
        required:true
    },
    lastName: {
        type: String,
        trim:true,
        required:true
    },
    dateOfBirth:{
        type:Date,
        trim:true,
        required:false,
        default:"0000"
    },
    phone_number:{
        type:Number,
        trim:true,
        required:false,
        default:"000000000"
    },
    identifier_CC: {
        type: String,
        trim:true,
        required:true
    },
    identifierName: {
        type: String,
        trim:true,
        required:true
    },
    NIF: {
        type: String,
        trim:true,
        required:true
    },
    postal_code: {
        type: String,
        trim:true,
        required:true
    },
    city: {
        type: String,
        trim:true,
        required:true
    },
    Address: {
        type: String,
        trim:true,
        required:true
    },
    licenseType: {
        type: String,
        trim:true,
        required:true
    }
})

module.exports = mongoose.model('licenses', LicenseSchema);