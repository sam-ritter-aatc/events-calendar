// import mockAxios from '../../__mocks__/axios';
import {axiosCall} from "../WildApricotUtils";
import axios from 'axios';

// const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('getRequest returns', () => {
    const token = require('./sampleToken.json');

    it('returms success', async () => {
        const retData = { status: 200 , data: {thing:'the success thing'}};
        axios.post.mockImplementationOnce(() => Promise.resolve(token));
        axios.get.mockImplementationOnce( () => Promise.resolve(retData));

        let foo = {};
        await axiosCall('GET',"http://example.com", null, (data) => { foo = data} );
    });

    it('returns umauthentication', () => {

    });
});
