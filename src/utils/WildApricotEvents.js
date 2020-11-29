import {makeBaseUrl, axiosCall, axiosGetCallWithParams} from "./WildApricotCommunication";

const eventsUrl = async () => {
    return await makeBaseUrl()+'/events';
}

export const createEvent = async (eventObj, cb) => {
    // console.log("creating new event", eventObj);
    await axiosCall('POST', await eventsUrl(), eventObj, cb);
}

export const updateEvent = async (eventId, eventObj, cb) => {
    // console.log("creating new event", eventObj);
    await axiosCall('PUT', await eventsUrl()+'/'+eventId, eventObj, cb);
}

export const deleteEvent = async (eventId, cb) => {
    // console.log("deleting event", eventId);
    await axiosCall('DELETE', await eventsUrl()+'/'+eventId, null, cb);
}

export const getEventById = async (eventId, cb) => {
    // console.log("getEventById", eventId);
    await axiosCall('GET', await eventsUrl()+'/'+eventId, null, cb);
}

export const getEvents = async (startDate, cb) => {
    await axiosGetCallWithParams(await eventsUrl(), {$filter: "StartDate ge "+startDate}, result => cb(result.Events) );
};
