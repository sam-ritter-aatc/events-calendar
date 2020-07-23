import {makeBaseUrl, makeHeaders} from "./WildApricotUtils";
const axios = require('axios');

const registrationsUrl = (token) => {
    return makeBaseUrl(token)+'/eventregistrations';
}

export const getRegistrationsForEventId = async (token, eventId, cb) => {
    console.log("getting registrations for eventId", eventId);
    await axios.get(registrationsUrl(token)+'?eventId='+eventId,{headers: makeHeaders(token)})
        // eventsUrl(token), qs.stringify(eventObj), { headers: makeHeaders(token)})
        .then((result) => {
            console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            console.log("## Error ##", err);
            console.log("error", err);
            cb({err});
        })
}

export const registerUserForEventId = async (token, eventId, userId, cb) => {
    console.log("registering user for event", eventId, userId);
    await axios.post(registrationsUrl(token), createRegistration(eventId, userId), {headers: makeHeaders(token)} )
        .then((result) => {
            console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            console.log("## Error ##", err);
            console.log("error", err);
            cb({err});
        })
}

export const unregisterFromEvent = async (token, regId, cb) => {
    console.log("unregistering", regId);
    await axios.delete(registrationsUrl(token)+'/'+regId, {headers: makeHeaders(token)})
        .then((result) => {
            console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            console.log("## Error ##", err);
            console.log("error", err);
            cb({err});
        })
}

const createRegistration = (eventId, userId) => {
    return {
        "Event": {
            "Id": eventId
        },
        "Contact": {
            "Id" : userId
        },
        "RegistrationTypeId": 5895025,
        "GuestRegistrationsSummary": {
            "NumberOfGuests": 0,
            "NumberOfGuestsCheckedIn": 0
        },
        "IsCheckedIn": false,
        "ShowToPublic": true,
        "RegistrationDate": new Date(),
        "RecreateInvoice": false
    }
}
