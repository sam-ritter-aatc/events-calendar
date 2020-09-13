import {makeBaseUrl, makeHeaders} from "./WildApricotUtils";
const axios = require('axios');

const registrationsUrl = (token) => {
    return makeBaseUrl(token)+'/eventregistrations';
}

export const getRegistrationsForEventId = async (token, eventId, cb) => {
    await axios({
        method: 'GET',
        url: registrationsUrl(token)+'?eventId='+eventId,
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

export const createInitialRegistrationForEvent = async (token, eventId, userId, cb) => {
    let regTypeId = null;
    await getRegistrationTypesForEvent(token, eventId, (data) => {
        regTypeId = data[0].Id;
    });
    await updateRegistrationTypeForEvent(token, regTypeId, eventId, (data) => {
        console.log("updated registration type", data);
    });
    await sendRegistrationForEvent(token, eventId, userId, regTypeId, cb);
}

export const registerUserForEventId = async (token, eventId, userId, cb) => {
    console.log("registering user for event", eventId, userId);
    let regType = null;
    await getRegistrationTypesForEvent(token, eventId,(data) => {
        regType = data[0].Id;
    })
    await sendRegistrationForEvent(token, eventId, userId, regType, cb)
}

const sendRegistrationForEvent = async (token, eventId, userId, regType, cb) => {
    await axios({
        method: 'POST',
        url: registrationsUrl(token),
        data: createRegistration(eventId, userId, '', 0, regType),
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

export const unregisterFromEvent = async (token, regId, cb) => {
    console.log("unregistering", regId);
    await axios({
        method: 'DELETE',
        url: registrationsUrl(token)+'/'+regId,
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

export const updateRegistration = async (token, reg, cb) => {
    let updatedReg = createRegistration(reg.eventId, reg.memberId, reg.message, reg.numGuests);
    updatedReg.Id = reg.regId;
    updatedReg.RegistrationDate = reg.dateRegistered;

    await axios({
        method: 'PUT',
        url: registrationsUrl(token)+'/'+ reg.regId,
        data: updatedReg,
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

const getRegistrationTypesForEvent = async (token, eventId, cb) => {
    await axios({
        method: 'GET',
        url: makeBaseUrl(token)+'/EventRegistrationTypes?eventId='+eventId,
        headers: makeHeaders(token)
    })
        .then( (result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

const updateRegistrationTypeForEvent = async (token, regTypeId, eventId, cb) => {
    let regTypeUpdate = createRegistrationTypeUpdateRecord(regTypeId, eventId);
    await axios({
        method: 'PUT',
        url: makeBaseUrl(token)+'/EventRegistrationTypes/'+regTypeId,
        data: regTypeUpdate,
        headers: makeHeaders(token)
    })
        .then( (result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

const createRegistration = (eventId, userId, msg, numGuests, regType) => {
    return {
        "Event": {
            "Id": eventId
        },
        "Contact": {
            "Id" : userId
        },
        "RegistrationTypeId": regType,
        "GuestRegistrationsSummary": {
            "NumberOfGuests": numGuests,
            "NumberOfGuestsCheckedIn": 0
        },
        "IsCheckedIn": false,
        "ShowToPublic": true,
        "RegistrationDate": new Date(),
        "Memo": msg,
        "RecreateInvoice": false
    }
}

const createRegistrationTypeUpdateRecord = (regTypeId, eventId) => {
    return {
        "Id": regTypeId,
        "EventId": eventId,
        "IsEnabled": true,
        "Description": "",
        "BasePrice": 0.0000,
        "GuestPrice": 0.0000,
        "UseTaxScopeSettings": null,
        "Availability": "Everyone",
        "AvailableForMembershipLevels": null,
        "GuestRegistrationPolicy": "NumberOfGuests",
        "CurrentRegistrantsCount": 0,
        "MultipleRegistrationAllowed": false,
        "UnavailabilityPolicy": "Undefined",
        "CancellationBehaviour": "DoNotAllow",
        "CancellationDaysBeforeEvent": null,
        "IsWaitlistEnabled": false,
        "Name": "RSVP"
    }
}