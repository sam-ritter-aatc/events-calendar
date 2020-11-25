import {makeBaseUrl, axiosCall, axiosGetCallWithParams} from "./WildApricotUtils";

const eventsUrl = (token) => {
    return makeBaseUrl(token)+'/events';
}

export const createEvent = async (token, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axiosCall(token, 'POST', eventsUrl(token), eventObj, cb);
}

export const updateEvent = async (token, eventId, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axiosCall(token, 'PUT', eventsUrl(token)+'/'+eventId, eventObj, cb);
}

export const deleteEvent = async (token, eventId, cb) => {
    console.log("deleting event", eventId);
    await axiosCall(token, 'DELETE', eventsUrl(token)+'/'+eventId, null, cb);
}

export const getEventById = async (token, eventId, cb) => {
    // console.log("getEventById", eventId);
    await axiosCall(token, 'GET', eventsUrl(token)+'/'+eventId, null, cb);
}

export const getEvents = async (token, startDate, cb) => {
    await axiosGetCallWithParams(token, eventsUrl(token), {$filter: "StartDate ge "+startDate}, (result) => cb(result.Events) )
};
