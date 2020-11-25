import {makeBaseUrl, axiosCall} from "./WildApricotUtils";

const registrationsUrl = (token) => {
    return makeBaseUrl(token)+'/eventregistrations';
}

export const getRegistrationsForEventId = async (token, eventId, cb) => {
    await axiosCall(token, 'GET',registrationsUrl(token)+'?eventId='+eventId, null, cb );
}

export const createInitialRegistrationForEvent = async (token, eventId, userId, cb) => {
    console.log("Token ",token);
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
    console.log("registering user for event", eventId, userId, token);
    let regType = null;
    await getRegistrationTypesForEvent(token, eventId,(data) => {
        console.log("Registration Data -> ", data);
        regType = data[0].Id;
    })
    await sendRegistrationForEvent(token, eventId, userId, regType, cb)
}

const sendRegistrationForEvent = async (token, eventId, userId, regType, cb) => {
    await axiosCall(token, 'POST', registrationsUrl(token),createRegistration(eventId, userId, '', 0, regType), cb);
}

export const unregisterFromEvent = async (token, regId, cb) => {
    console.log("unregistering", regId);
    await axiosCall(token, 'DELETE', registrationsUrl(token)+'/'+regId, null, cb);
}

export const updateRegistration = async (token, reg, cb) => {
    console.log("UpdateReg - ", token, reg)
    let updatedReg = createRegistration(reg.eventId, reg.memberId, reg.message, reg.numGuests);
    updatedReg.Id = reg.regId;
    updatedReg.RegistrationDate = reg.dateRegistered;

    await axiosCall(token, 'PUT', registrationsUrl(token)+'/'+ reg.regId, updatedReg, cb)
}

const getRegistrationTypesForEvent = async (token, eventId, cb) => {
    await axiosCall(token, 'GET', makeBaseUrl(token)+'/EventRegistrationTypes?eventId='+eventId, null, cb);
}

const updateRegistrationTypeForEvent = async (token, regTypeId, eventId, cb) => {
    console.log("Token ",token);
    let regTypeUpdate = createRegistrationTypeUpdateRecord(regTypeId, eventId);
    await axiosCall(token, 'PUT', makeBaseUrl(token)+'/EventRegistrationTypes/'+regTypeId, regTypeUpdate, cb);
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