import {axiosCall, axiosGetCallWithParams, makeBaseUrl} from "../WildApricotCommunication";
import mockAxios from 'axios';

const token = require('./sampleToken.json');
const singleEvent = require('./sample-single-event.json');

jest.mock('axios');
// REACT_APP_WA_BASE_URL
// REACT_APP_WA_OAUTH_URL
describe('WildApricotCommunications', () => {
    const OLD_ENV = process.env;
    beforeAll(() => {
        process.env.REACT_APP_WA_BASE_URL = 'http://example.com';
        process.env.REACT_APP_WA_OAUTH_URL = 'http://oauth.example.com';
    })
    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        process.env = OLD_ENV;
    })
    describe('axiosCall functions', () => {
        it("should return a single event", async () => {
            mockAxios.mockImplementationOnce(() => Promise.resolve({data: token}));
            mockAxios.mockImplementationOnce(() => Promise.resolve({data: singleEvent}));
            let localData = null;
            await axiosCall('GET', '/getEventById', null, res => {
                localData = res
            });
            expect(localData).toEqual(singleEvent);
        });

        // it('handles expired token', async () => {
        //     mockAxios.mockImplementationOnce(() => Promise.resolve({data: token}));
        //     mockAxios.mockImplementationOnce(() => Promise.resolve({
        //         data: {
        //             status: 401,
        //             data: {reason: 'invalid_token'},
        //             config: {
        //                 url: '/theThing',
        //                 headers: {Authorization: 'Bearer fwefihasdg', ContentType: 'application/json'}
        //             }
        //         }
        //     }));
        //     let localData = null;
        //     await axiosCall('GET', '/getEventById', null, res => {
        //         localData = res
        //     });
        //     expect(localData).toEqual(singleEvent);
        // });
    });

    describe('axiosCallWithParams functions', () => {

    });

    describe('maxBaseUrl function', () => {
        it('should produce base api url for WildApricot', async () => {
            mockAxios.mockImplementationOnce(() => Promise.resolve({data: token}));
            expect(await makeBaseUrl()).toEqual('http://example.com/accounts/123456');
        })
    });
});