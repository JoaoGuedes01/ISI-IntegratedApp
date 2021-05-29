const mongoose = require('mongoose');


const URI = "mongodb+srv://root:123@isi-backend.yzlml.mongodb.net/FederationDB?retryWrites=true&w=majority";



const connectDB = async() => {
    await mongoose.connect(URI, {
        useUnifiedTopology: true, 
        useNewUrlParser: true
    });
    console.log('Connected to Federation Database');
}

module.exports = connectDB;