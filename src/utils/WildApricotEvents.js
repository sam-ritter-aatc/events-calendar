import {makeAuthHeader, makeBaseUrl} from "./WildApricotUtils";
const axios = require('axios');

const eventsUrlPart = '/events';

export const getEventById = async (token, eventId, cb) => {
    await axios.get(makeBaseUrl(token)+eventsUrlPart+'/'+eventId, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': makeAuthHeader(token)
        }
    })
        .then((result) => {
            cb(result.data)
        })
        .catch((err) => {
            console.log("Error", err);
            cb({});
        })
}

export const getEvents = async (token, startDate, cb) => {
    await axios.get(makeBaseUrl(token)+eventsUrlPart, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': makeAuthHeader(token)
        },
        params: {
            $filter: "StartDate ge "+startDate
        }
    })
        .then((result) => {
            cb(result.data.Events);
        })
        .catch((err) => {
            console.log("Error", err);
            cb([]);
        });
};

