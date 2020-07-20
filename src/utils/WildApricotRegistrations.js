import {makeBaseUrl, makeHeaders} from "./WildApricotUtils";
const axios = require('axios');

const registrationsUrl = (token) => {
    return makeBaseUrl(token)+'/eventregistrations';
}

export const getRegistrationsForEventId = async (token, eventId, cb) => {
    console.log("getting registrations for eventId", eventId);
    await axios.get(registrationsUrl(token)+'?eventId='+eventId,{headers: makeHeaders(token)})
        // eventsUrl(token), qs.stringify(eventObj), { headers: makeHeaders(token)})
        .then((result) => {
            console.log("RESULT", result)
            cb(result.data);
        })
        .catch((err) => {
            console.log("## Error ##", err);
            console.log("error", err);
            cb({err});
        })
}
