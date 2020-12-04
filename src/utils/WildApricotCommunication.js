import axios from 'axios';
import {initializeUnauthorizedInterceptor} from './UnauthorizedInterceptor';
const qs = require('querystring');

const instance = axios.create();

const initInterceptors = async () => {
    await initializeUnauthorizedInterceptor(instance);
};
initInterceptors();

const _getAuthTokens = async () => {
    let body = {
        grant_type: 'client_credentials',
        scope: 'auto',
        obtain_refresh_token: true
    };
    await _axiosAuthRequest(body);
}

export const _refreshAuthTokens = async () => {
    let body = {
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('refresh_token')
    }
    return _axiosAuthRequest(body);
}


// let isRefreshing = false;
// let subscribers = [];
//
// const subscribeTokenRefresh = async (cb) => {
//     subscribers.push(cb);
// }
//
// const subscribersOnRefreshed = async () => {
//     subscribers.map(cb => cb());
// }

// instance.interceptors.response.use(
//     response => response,
//     async err => {
//         const {
//             config,
//             status,
//             data,
//         } = err.response;
//
//
//         if( status===401 && data.reason === 'invalid_token') {
//             if( !isRefreshing) {
//                 isRefreshing = true;
//                 await _refreshAuthTokens();
//                 isRefreshing = false;
//             }
//             config.headers = await makeHeaders();
//             const requestSubscribers = new Promise(resolve => {
//                 subscribeTokenRefresh(() => resolve(axios(config)));    // original request
//             });
//
//             subscribersOnRefreshed();
//
//             return requestSubscribers;
//         }
//     }
// );

export const makeBaseUrl = async () => {
    await _getTokensIfFirstCall();
    return process.env.REACT_APP_WA_BASE_URL + '/accounts/' + localStorage.getItem('AccountId');
}

const makeAuthHeader = async () => {
    await _getTokensIfFirstCall();
    return localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token');
}

export const makeHeaders = async () => {
    await _getTokensIfFirstCall();
    return {
        'Content-Type': 'application/json',
        'Authorization': await makeAuthHeader()
    }
}

const makeBasicAuthHeader = () => {
    return 'Basic ' + new Buffer('APIKEY:' + process.env.REACT_APP_WA_API_KEY).toString('base64');
}

const _saveTokenBitsToLocalStorage = (token) => {
    localStorage.setItem('AccountId', token.Permissions[0].AccountId);
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    localStorage.setItem('token_type', token.token_type);
}

const _getAuthUrl = async () => {
    return await process.env.REACT_APP_WA_OAUTH_URL;
}

const _axiosAuthRequest = async (body) => {
    await instance({
        method: 'POST',
        url: await _getAuthUrl(),
        data: qs.stringify(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': makeBasicAuthHeader()
        },
    })
        .then((result) => _saveTokenBitsToLocalStorage(result.data))
        .catch((err) => {
            console.error('error', err);
        });
}

export const axiosCall = async (method, url, body, cb) => {
    // console.log("Calling - ", url, body, localStorage.getItem('access_token'));
    await _axiosCall(method,url,null,body,cb, err => cb({err}));
}

export const axiosGetCallWithParams = async (url, params, cb) => {
    await _axiosCall('GET',url, params, null,  cb, err => cb([]));
}

const _getTokensIfFirstCall = async () => {
    if(!localStorage.getItem('access_token')) {
        await _getAuthTokens();
    }
}

const _axiosCall = async (methd, url, params, body, cb, errorCb) => {
    await instance({
        method: methd,
        url: url,
        headers: await makeHeaders(),
        data: body,
        params: params
    })
        .then(result => {
            // console.log("RESULT FROM WA", result);
            cb(result.data);
        })
        .catch(err => {
            console.log("*****ERROR*******", err);
            errorCb(err);
        });
}


