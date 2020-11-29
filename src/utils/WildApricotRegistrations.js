import {makeBaseUrl, axiosCall} from "./WildApricotCommunication";

const registrationsUrl = async () => {
    return await makeBaseUrl()+'/eventregistrations';
}

export const getRegistrationsForEventId = async ( eventId, cb) => {
    await axiosCall( 'GET',await registrationsUrl()+'?eventId='+eventId, null, cb );
}

export const createInitialRegistrationForEvent = async (eventId, userId, cb) => {
    let regTypeId = null;
    await getRegistrationTypesForEvent(eventId, data => {regTypeId = data[0].Id;});
    await updateRegistrationTypeForEvent(regTypeId, eventId, data => {
        // console.log("updated registration type", data);
    });
    await sendRegistrationForEvent(eventId, userId, regTypeId, cb);
}

export const registerUserForEventId = async (eventId, userId, cb) => {
    let regType = null;
    await getRegistrationTypesForEvent(eventId,(data) => {
        console.log("Registration Data -> ", data);
        regType = data[0].Id;
    })
    await sendRegistrationForEvent(eventId, userId, regType, cb)
}

const sendRegistrationForEvent = async (eventId, userId, regType, cb) => {
    await axiosCall('POST', await registrationsUrl(),createRegistration(eventId, userId, '', 0, regType), cb);
}

export const unregisterFromEvent = async (regId, cb) => {
    console.log("unregistering", regId);
    await axiosCall('DELETE', await registrationsUrl()+'/'+regId, null, cb);
}

export const updateRegistration = async (reg, cb) => {
    let updatedReg = createRegistration(reg.eventId, reg.memberId, reg.message, reg.numGuests);
    updatedReg.Id = reg.regId;
    updatedReg.RegistrationDate = reg.dateRegistered;

    await axiosCall('PUT', await registrationsUrl()+'/'+ reg.regId, updatedReg, cb)
}

const getRegistrationTypesForEvent = async (eventId, cb) => {
    await axiosCall('GET', await makeBaseUrl()+'/EventRegistrationTypes?eventId='+eventId, null, cb);
}

const updateRegistrationTypeForEvent = async (regTypeId, eventId, cb) => {
    let regTypeUpdate = createRegistrationTypeUpdateRecord(regTypeId, eventId);
    await axiosCall('PUT', await makeBaseUrl()+'/EventRegistrationTypes/'+regTypeId, regTypeUpdate, cb);
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