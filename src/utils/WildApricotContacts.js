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

            e.id = result.data.Id;
            e.firstName = result.data.FirstName;
            e.lastName = result.data.LastName;
            e.email = result.data.Email;
            e.displayName = result.data.DisplayName;
            e.isAdmin = isAdmin(result.data.FieldValues);

            cb(e);
        })
        .catch((err) => {
            cb(null);
        })
}

const isAdmin = (fields) => {
    let adminField = fields.filter(x => x.SystemCode === 'AdminRole');
    return adminField.length>0 && adminField[0].Value.length > 0;
}