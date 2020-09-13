import {makeBaseUrl, makeHeaders} from "./WildApricotUtils";
const axios = require('axios');

const eventsUrl = (token) => {
    return makeBaseUrl(token)+'/events';
}

export const createEvent = async (token, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axios.post(eventsUrl(token), eventObj,{headers: makeHeaders(token)})
        // eventsUrl(token), qs.stringify(eventObj), { headers: makeHeaders(token)})
        .then((result) => {
            // console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            // console.log("## Error ##", err);
            // console.log("error", err);
            cb({err});
        })
}

export const updateEvent = async (token, eventId, eventObj, cb) => {
    console.log("creating new event", eventObj);
    await axios.put(eventsUrl(token)+'/'+eventId, eventObj,{headers: makeHeaders(token)})
        // eventsUrl(token), qs.stringify(eventObj), { headers: makeHeaders(token)})
        .then((result) => {
            // console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            // console.log("## Error ##", err);
            // console.log("error", err);
            cb({err});
        })
}

export const deleteEvent = async (token, eventId, cb) => {
    console.log("deleting event", eventId);
    await axios.delete(eventsUrl(token)+'/'+eventId, {headers: makeHeaders(token)})
        // eventsUrl(token), qs.stringify(eventObj), { headers: makeHeaders(token)})
        .then((result) => {
            // console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            // console.log("## Error ##", err);
            // console.log("error", err);
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
            // console.log("RESULT", result)
            cb(result.data);
             // return result.data;
        })
        .catch((err) => {
            // console.log("## Error ##", err);
            cb({});
        })
}

export const getEvents = async (token, startDate, cb) => {
    await axios.get(eventsUrl(token), {
        headers: makeHeaders(token),
        params: {
            $filter: "StartDate ge "+startDate
        }
    })
        .then((result) => {
            cb(result.data.Events);
        })
        .catch((err) => {
            // console.log("Error", err);
            cb([]);
        });
};

