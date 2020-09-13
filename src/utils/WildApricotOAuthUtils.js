const axios = require('axios');
const qs = require('querystring');

export const getAuthTokens = async (cb) => {
    let basicAuthHeader = 'Basic ' + new Buffer('APIKEY:' + process.env.REACT_APP_WA_API_KEY).toString('base64');
    let body = {
        grant_type: 'client_credentials',
        scope: 'auto',
        obtain_refresh_token: true
    };

    await axios({
        method: 'POST',
        url: process.env.REACT_APP_WA_OAUTH_URL,
        data: qs.stringify(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': basicAuthHeader},
    })
        .then( (result) => {
            cb(result.data);
        })
        .catch( (err) => {
            console.log('error', err);
        });
}

