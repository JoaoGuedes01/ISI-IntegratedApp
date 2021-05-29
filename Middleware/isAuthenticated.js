const jwt = require('jsonwebtoken');
const tokensecret = "OJoaoGuedeséOmelhorProgramadorQueExiste";
const jwtDecode = require('jwt-decode');

module.exports = async function (req, res, next) {
    try {
        //Extracting token from the HttpOnly cookie
        const token = req.cookies.SessionToken;
        if (!token) return res.status(401).send({
            status: "401",
            message: 'Access Denied'
        });
        //Verifying if the token is valid with the tokenSecret
        const verified = await jwt.verify(token, tokensecret);
        if (verified) {
            next();
        }

    } catch (error) {
        return res.status(400).send({
            status: res.status,
            message: 'Invalid Token'
        });
    }

}