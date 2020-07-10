
export const makeBaseUrl = (token) => {
    return process.env.REACT_APP_WA_BASE_URL + '/accounts/' + token.Permissions[0].AccountId;
}

export const makeAuthHeader = (token) => {
    return token.token_type + ' ' +token.access_token;
}

export const makeHeaders = (token) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': makeAuthHeader(token)
        // 'Host': 'api.wildapricot.org'
    }
}