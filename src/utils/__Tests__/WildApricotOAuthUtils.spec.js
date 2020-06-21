import axios from 'axios';
import {getAuthTokens} from '../WildAppricotOAuthUtils';

let token = require('./sampleToken.json');

jest.mock('axios');
//const mockedAxios = axios as jest.Mocked<typeof axios>

describe('OAuth Utils', () => {
    test('WildApricot OAuth returns expected token', async () => {
        const resp = { data: token};
        axios.post.mockImplementationOnce(() => Promise.resolve(resp));
        // axios.post.mockReturnValueOnce({data: {"foo":"bar"}});
        let rcvd = null;
        await getAuthTokens((data) => { rcvd = Object.assign({}, data)});

        expect(rcvd).toEqual({
            "access_token": "the-access-token",
            "token_type": "Bearer",
            "expires_in": 1800,
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