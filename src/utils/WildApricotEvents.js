import {makeAuthHeader, makeBaseUrl} from "./WildApricotUtils";
const axios = require('axios');

const eventsUrlPart = '/events';

export const getEventById = async (token, eventId, cb) => {
    console.log("getEventById", eventId);
    await axios({
        url: makeBaseUrl(token)+eventsUrlPart+'/'+eventId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': makeAuthHeader(token)
        }
    })
        .then((result) => {
            console.log("RESULT", result)
            cb(result.data);
             // return result.data;
        })
        .catch((err) => {
            console.log("## Error ##", err);
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

