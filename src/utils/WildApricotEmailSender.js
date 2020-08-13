

const makeEmailUrl = (token) => {
    return 'https://api.wildapricot.org/v2.2/rpc/' + token.Permissions[0].AccountId + '/email/SendEmail';
}

export const sendEmail = async (eventId, recipArray, subject, text) => {
    let msg = makeMessage(eventId,recipArray,subject, text);
    console.log("RequestBody for SendEmail", msg);

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
