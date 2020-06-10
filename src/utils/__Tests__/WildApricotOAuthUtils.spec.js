import axios from 'axios';

let getAuthTokens = require('../WildAppricotOAuthUtils');
let token = require('./sampleToken.json');

jest.mock('axios');
//const mockedAxios = axios as jest.Mocked<typeof axios>

describe.skip('OAuth Utils', () => {
    test('WildApricot OAuth returns expected token', () => {
        const resp = { data: token};
        mockedAxios.post.mockReturnValueOnce(resp);
        // axios.post.mockReturnValueOnce({data: {"foo":"bar"}});
        let rcvd = {};
        getAuthTokens((data) => {
            rcvd = data;
        });

        expect(rcvd).toEqual({
            "access_token": "the-access-token",
            "token_type": "Bearer",
            "expires_in": 42,
            "refresh_token": "the-refresh-token",
            "Permissions": [
                {
                    "AccountId": 123456,
                    "SecurityProfileId": 13136969,
                    "AvailableScopes": [
                        "contacts_view",
                        "contacts_edit",
                        "contacts_membership_edit",
                        "finances_edit",
                        "finances_view",
                        "emails_view",
                        "emails_edit",
                        "events_view",
                        "events_edit",
                        "event_registrations_edit",
                        "event_registrations_view",
                        "account_view",
                        "membership_levels_view"
                    ]
                }
            ]
        });
    })
})