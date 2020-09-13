import {makeBaseUrl, makeHeaders} from "./WildApricotUtils";
const axios = require('axios');

const eventsUrl = (token) => {
    return makeBaseUrl(token)+'/events';
}

export const createEvent = async (token, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axios( {
        method: 'POST',
        url: eventsUrl(token),
        data: eventObj,
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

export const updateEvent = async (token, eventId, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axios({
        method: 'PUT',
        url: eventsUrl(token)+'/'+eventId,
        data: eventObj,
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

export const deleteEvent = async (token, eventId, cb) => {
    console.log("deleting event", eventId);
    await axios({
        method: 'DELETE',
        url: eventsUrl(token)+'/'+eventId,
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({err});
        })
}

export const getEventById = async (token, eventId, cb) => {
    // console.log("getEventById", eventId);
    await axios({
        url: eventsUrl(token)+'/'+eventId,
        method: 'GET',
        headers: makeHeaders(token)
    })
        .then((result) => {
            cb(result.data);
        })
        .catch((err) => {
            cb({});
        })
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
