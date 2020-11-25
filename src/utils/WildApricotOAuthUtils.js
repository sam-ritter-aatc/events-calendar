const axios = require('axios');
const qs = require('querystring');

export const getAuthTokens = async (cb) => {
    // let basicAuthHeader = makeBasicAuthHeader();
    let body = {
        grant_type: 'client_credentials',
        scope: 'auto',
        obtain_refresh_token: true
    };
    await sendAxiosRequest(body, cb);
 }

export const refreshAuthTokens = async (refreshToken, cb) => {
    // let basicAuthHeader = makeBasicAuthHeader();
    let body = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }
    await sendAxiosRequest(body, cb);
}

const sendAxiosRequest = async (body, cb) => {
    await axios({
        method: 'POST',
        url: process.env.REACT_APP_WA_OAUTH_URL,
        data: qs.stringify(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': makeBasicAuthHeader()},
    })
        .then( (result) => {
            cb(result.data);
        })
        .catch( (err) => {
            console.log('error', err);
        });

}

const makeBasicAuthHeader = () => {
    return 'Basic ' + new Buffer('APIKEY:' + process.env.REACT_APP_WA_API_KEY).toString('base64');
}