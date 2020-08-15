import {makeHeaders} from "./WildApricotUtils";
const axios = require('axios');

const makeEmailUrl = (token) => {
    // return 'https://api.wildapricot.org/v2.2/rpc/' + token.Permissions[0].AccountId + '/email/SendEmail';
    return 'https://cors-anywhere.herokuapp.com/https://api.wildapricot.org/v2.2/rpc/' + token.Permissions[0].AccountId + '/email/SendEmail';
}

export const sendEmail = async (token, eventId, recipArray, subject, text, cb) => {
    console.log("Sending email", makeEmailUrl(token))
    let msg = makeMessage(eventId,recipArray,subject, text);
    console.log("RequestBody for SendEmail", msg, process.env.REACT_APP_WA_BASE_URL);

    await axios.post(makeEmailUrl(token), makeMessage(eventId, recipArray, subject, text), {headers: makeHeaders(token)} )
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

const makeMessage = (eventId, recipArray, subject, text) => {
    return {
        Subject: subject,
        Body: text,
        Recipients: processRecipients(recipArray),
        EventId: eventId
    }
}

const processRecipients = (recipArray) => {
    let recipients = recipArray.map((recip) => {
        return {
            Id: recip.memberId,
            Type: "IndividualContactRecipient"
        }
    });

    return recipients;
}
