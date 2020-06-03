const axios = require('axios');
const qs = require('querystring');
require('dotenv').config({path: '../../.env'});

const getAuthTokens = async () => {
    let basicAuthHeader = 'Basic ' + new Buffer('APIKEY:' + process.env.WA_API_KEY).toString('base64');
    let body = {
        grant_type: 'client_credentials',
        scope: 'auto',
        obtain_refresh_token: true
    };

    const postConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': basicAuthHeader},
    }

    await axios.post(process.env.WA_OAUTH_URL, qs.stringify(body), postConfig)
        .then( (result) => {
            console.log('result', result.data)
        })
        .catch( (err) => {
            console.log('error', err);
        });
}

getAuthTokens();