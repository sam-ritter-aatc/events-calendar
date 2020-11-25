import {makeBaseUrl, makeHeaders, axiosCall} from "./WildApricotUtils";
const axios = require('axios');

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
    await axios({
        method: 'GET',
        url: eventsUrl(token),
        headers: makeHeaders(token),
        params: {
            $filter: "StartDate ge "+startDate
        }
    })
        .then((result) => {
            cb(result.data.Events);
        })
        .catch((err) => {
            cb([]);
        });
};
