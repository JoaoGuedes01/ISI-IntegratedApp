const request = require('request');
async function getMoloniToken(cb){
    await request({
        url:'https://api.moloni.pt/v1/grant/?grant_type=password&client_id=webcelosAPI&client_secret=5ee247c43af6851d8c566cfd3e6b57ada118076f&username=spmodelismoisi@gmail.com&password=isi2021aaa',
        method: 'GET',

    },async(err,response)=>{
        if(response){
            let json = JSON.parse(response.body);
            let secretToken = json.access_token;
            return cb(secretToken);
        }
    })
}

module.exports = getMoloniToken