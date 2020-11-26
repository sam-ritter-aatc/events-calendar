const axios = require('axios');
const qs = require('querystring');


export const makeBaseUrl = async () => {
    await _getTokensIfFirstCall();
    return process.env.REACT_APP_WA_BASE_URL + '/accounts/' + localStorage.getItem('AccountId');
}

const makeAuthHeader = async () => {
    await _getTokensIfFirstCall();
    return localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token');
}

const makeHeaders = async () => {
    await _getTokensIfFirstCall();
    return {
        'Content-Type': 'application/json',
        'Authorization': await makeAuthHeader()
    }
}

const makeBasicAuthHeader = () => {
    return 'Basic ' + new Buffer('APIKEY:' + process.env.REACT_APP_WA_API_KEY).toString('base64');
}


export const getAuthTokens = async () => {
    let body = {
        grant_type: 'client_credentials',
        scope: 'auto',
        obtain_refresh_token: true
    };
    await axiosAuthRequest(body);
}

export const refreshAuthTokens = async () => {
    let body = {
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('refresh_token')
    }
    await axiosAuthRequest(body);
}

const axiosAuthRequest = async (body) => {
    await axios({
        method: 'POST',
        url: process.env.REACT_APP_WA_OAUTH_URL,
        data: qs.stringify(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': makeBasicAuthHeader()
        },
    })
        .then((result) => {
            let token = result.data;
            localStorage.setItem('AccountId', token.Permissions[0].AccountId);
            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('refresh_token', token.refresh_token);
            localStorage.setItem('token_type', token.token_type);
            localStorage.setItem('token', token);
        })
        .catch((err) => {
            console.log('error', err);
        });

}

export const axiosCall = async (method, url, body, cb) => {
    console.log("Calling - ", url, body, localStorage.getItem('access_token'));
    await _axiosCall(method,url,null,body,cb, err => cb({err}));
}

export const axiosGetCallWithParams = async (url, params, cb) => {
    await _axiosCall('GET',url, params, null,  cb, err => cb([]));
}

const _getTokensIfFirstCall = async () => {
    if(!localStorage.getItem('access_token')) {
        await getAuthTokens();
    }
}
const _axiosCall = async (methd, url, params, body, cb, errorCb) => {
     // const firstCall = true;
    await axios({
        method: methd,
        url: url,
        headers: await makeHeaders(),
        data: body,
        params: params
    })
        .then(result => {
            console.log("RESULT FROM WA", result);
            cb(result.data);
        })
        .catch(err => {
            console.log("*****ERROR*******", err);
            // if(err.response.status === 401) {
            //     console.log("************");
            //
            // }
            errorCb(err);
        });
}