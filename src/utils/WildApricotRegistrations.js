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
    await axios.post(registrationsUrl(token), createRegistration(eventId, userId, null, null), {headers: makeHeaders(token)} )
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

export const addGuestToRegistration = async (token, reg, cb) => {
    let updatedReg = createRegistration(reg.eventId, reg.memberId, reg.message, reg.numGuests+1);
    updatedReg.Id = reg.regId;
    updatedReg.RegistrationDate = reg.dateRegistered;

    await axios.put(registrationsUrl(token)+'/'+ reg.regId, updatedReg, {headers: makeHeaders(token)})
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

const createRegistration = (eventId, userId, msg, numGuests) => {
    return {
        "Event": {
            "Id": eventId
        },
        "Contact": {
            "Id" : userId
        },
        "RegistrationTypeId": 5895025,
        "GuestRegistrationsSummary": {
            "NumberOfGuests": numGuests,
            "NumberOfGuestsCheckedIn": 0
        },
        "Memo": msg,
        "IsCheckedIn": false,
        "ShowToPublic": true,
        "RegistrationDate": new Date(),
        "RecreateInvoice": false
    }
}
