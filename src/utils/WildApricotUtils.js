const axios = require('axios');
const qs = require('querystring');

export const makeBaseUrl = (token) => {
    return process.env.REACT_APP_WA_BASE_URL + '/accounts/' + token.Permissions[0].AccountId;
}

export const makeAuthHeader = (token) => {
    return token.token_type + ' ' + token.access_token;
}

export const makeHeaders = (token) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': makeAuthHeader(token)
    }
}

const makeBasicAuthHeader = () => {
    return 'Basic ' + new Buffer('APIKEY:' + process.env.REACT_APP_WA_API_KEY).toString('base64');
}


export const getAuthTokens = async (cb) => {
    let body = {
        grant_type: 'client_credentials',
        scope: 'auto',
        obtain_refresh_token: true
    };
    await axiosAuthRequest(body, cb);
}

export const refreshAuthTokens = async (refreshToken, cb) => {
    let body = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }
    await axiosAuthRequest(body, cb);
}

const axiosAuthRequest = async (body, cb) => {
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

export const axiosCall = async (token, method, url, body, cb) => {
    console.log("Calling - ", url, body);
    await axios({
        method: method,
        headers: makeHeaders(token),
        data: body,
        url: url
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            if (err.response) {
                console.log(err.response);
            }
            cb({err});
        })
}

export const axiosGetCallWithParams = async (token, url, params, cb) => {
    await axios({
        method: 'GET',
        url: url,
        headers: makeHeaders(token),
        params: params
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb([]);
        });

}