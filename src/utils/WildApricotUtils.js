const axios = require('axios');
const qs = require('querystring');


export const makeBaseUrl = () => {
    return process.env.REACT_APP_WA_BASE_URL + '/accounts/' + localStorage.getItem('AccountId');
}

export const makeAuthHeader = () => {
    return localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token');
}

export const makeHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': makeAuthHeader()
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
            let token = result.data;
            localStorage.setItem('AccountId',token.Permissions[0].AccountId);
            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('refresh_token', token.refresh_token);
            localStorage.setItem('token_type', token.token_type);
        })
        .catch( (err) => {
            console.log('error', err);
        });

}

export const axiosCall = async (method, url, body, cb) => {
    console.log("Calling - ", url, body);
    await axios({
        method: method,
        headers: makeHeaders(),
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

export const axiosGetCallWithParams = async (url, params, cb) => {
    await axios({
        method: 'GET',
        url: url,
        headers: makeHeaders(),
        params: params
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb([]);
        });

}