const axios = require('axios');

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