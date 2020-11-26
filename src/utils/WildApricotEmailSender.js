import {axiosCall} from "./WildApricotUtils";

const makeEmailUrl = () => {
    return 'https://cors-anywhere.herokuapp.com/https://api.wildapricot.org/v2.2/rpc/' + localStorage.getItem('AccountId') + '/email/SendEmail';
}

export const sendEmail = async (eventId, recipArray, subject, text, cb) => {
    // let msg = makeMessage(eventId,recipArray,subject, text);
    axiosCall('POST', makeEmailUrl(), makeMessage(eventId, recipArray, subject, text), cb);
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
