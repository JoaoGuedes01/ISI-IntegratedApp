const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const path = require("path");
const connectDB = require('./config/Connection');
const app = express();
const port = 3000;

//Se estas a ver isto Ana não ha nada de mal com o back end xD
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/assets', express.static('./HTML/landing-page/assets'));
app.use('/img', express.static('./img'));

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();


/*app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "./HTML/landing-page/index.html"))
})*/

//Front-End
app.use('/public', express.static('./public'));
app.use('/', express.static('./'));

//Front-Office
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

//SPModelismo
app.get('/sp',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/sp/index.html"))
})

app.get('/tracks',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/sp/pistas.html"))
})

app.get('/trofeus',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/sp/proximostrofeus.html"))
})

app.get('/campeonatos',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/sp/proximoscampeonatos.html"))
})


//Pilotos
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/utilizador/page-login.html"))
})

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/utilizador/page-register.html"))
})

app.get('/changePassword/:secret/:pilotID',(req,res)=>{
    console.log(req.params.secret);
    console.log(req.params.pilotID);
    res.sendFile(path.join(__dirname, "/public/utilizador/changePassword.html"))
})

app.get('/utilizadores',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/utilizador/index.html"))
})




//Webcelos
app.get('/webcelos',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/webcelos/promocoesWC.html"))
})

app.get('/promocoesWC',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/webcelos/promocoesWC.htlm"))
})

app.get('/reportagensWC',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/webcelos/reportagensWC.htlm"))
})


//Federação
app.get('/federacao',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/federação/campeonatos.html"))
})


//Rotas Back-End

//Rotas de User
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

//Rotas de User
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

//Rotas de Federação
const federationRoutes = require('./routes/federationRoutes');
app.use('/api/federation', federationRoutes);

//Rotas de Webcelos
const WebcelosRoutes = require('./routes/WebcelosRoutes');
app.use('/api/webcelos', WebcelosRoutes);

//Rotas de Paypal
const paypalRoutes = require('./routes/paypalRoutes');
app.use('/api/paypal', paypalRoutes);


//Server listen
app.listen(process.env.PORT || port, () => {
    console.log("Server listening on port " + port);
});