import {makeBaseUrl, makeAuthHeader} from "./WildApricotUtils";

const axios = require('axios');

export const getContact = async (token, contactId, cb) => {
    await axios.get(makeBaseUrl(token) + '/contacts/' + contactId, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': makeAuthHeader(token)
        }
    })
        .then((result) => {
            let e = {};

            e.firstName = result.data.FirstName;
            e.lastName = result.data.LastName;
            e.email = result.data.Email;
            e.display = result.data.DisplayName;

            cb(e);
        })
        .catch((err) => {
            return {};
        })
}