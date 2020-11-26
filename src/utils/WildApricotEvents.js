import {makeBaseUrl, axiosCall, axiosGetCallWithParams} from "./WildApricotUtils";

const eventsUrl = () => {
    return makeBaseUrl()+'/events';
}

export const createEvent = async (eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axiosCall('POST', eventsUrl(), eventObj, cb);
}

export const updateEvent = async (eventId, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axiosCall('PUT', eventsUrl()+'/'+eventId, eventObj, cb);
}

export const deleteEvent = async (eventId, cb) => {
    console.log("deleting event", eventId);
    await axiosCall('DELETE', eventsUrl()+'/'+eventId, null, cb);
}

export const getEventById = async (eventId, cb) => {
    console.log("getEventById", eventId);
    await axiosCall('GET', eventsUrl()+'/'+eventId, null, cb);
}

export const getEvents = async (startDate, cb) => {
    await axiosGetCallWithParams(eventsUrl(), {$filter: "StartDate ge "+startDate}, (result) => cb(result.Events) )
};
