const axios = require('axios');

const getEvents = async (token, startDate, cb) => {
    let authHdr = token.token_type + ' ' +token.access_token;
    let acct = token.Permissions[0].AccountId;
    let baseUrl = process.env.REACT_APP_WA_BASE_URL + '/accounts/' + acct + '/events'
console.log("auth",authHdr);
    const getConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHdr
        },
        params: {
            $filter: "StartDate ge "+startDate
        }
    };

    await axios.get(baseUrl, getConfig)
        .then((result) => {
            cb(result.data.Events);
        })
        .catch((err) => {
            console.log("Error", err);
            cb([]);
        });
};

module.exports = getEvents;