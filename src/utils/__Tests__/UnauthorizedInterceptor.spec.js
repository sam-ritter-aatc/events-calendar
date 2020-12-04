import axios from 'axios';
import {initializeUnauthorizedInterceptor} from "../UnauthorizedInterceptor";
import mockAxios from 'axios';

const myAxios = axios.create();

const axiosInst = mockAxios.create;

const initInterceptor = async () => {
    initializeUnauthorizedInterceptor(myAxios);
}

// https://github.com/axios/axios/issues/511


describe('Interceptors', () => {
    beforeAll(() => initInterceptor());

    describe('initUnauthorizedResponseInterceptor',  () => {
        it('should handle 401', async () => {
            myAxios.mockImplementationOnce(() => Promise.resolve({data: 'fubar'}));
            await myAxios({method: 'GET', url: 'http://example.com'})
        })
        // initUnauthorizedResponseInterceptor(myAxios);

        // it('should throw error if response status is other then 403', () => {
        //     const res = {
        //         response: { status: 401 },
        //     };
        //     const rejectedRes = axios.interceptors.response.handlers[0].rejected(res);
        //
        //     expect(rejectedRes).rejects.toMatchObject(res);
        // });

        // it('it should redirect to login page if response status is 403', () => {
        //     // global is `window` in jest
        //     global.location.replace = jest.fn();
        //
        //     const rejectedRes = axios.interceptors.response.handlers[0].rejected({
        //         response: { status: 403 },
        //     });
        //
        //     expect(global.location.replace).toBeCalledWith('/login');
        //     expect(rejectedRes).toBeUndefined();
        // });
    });
});


// import axios from 'axios';
// import * as interceptor from '../interceptors';
//
// describe('Interceptors', () => {
//     describe('initUnauthorizedResponseInterceptor', () => {
//         interceptor.initUnauthorizedResponseInterceptor();
//
//         it('should throw error if response status is other then 403', () => {
//             const res = {
//                 response: { status: 401 },
//             };
//             const rejectedRes = axios.interceptors.response.handlers[0].rejected(res);
//
//             expect(rejectedRes).rejects.toMatchObject(res);
//         });
//
//         it('it should redirect to login page if response status is 403', () => {
//             // global is `window` in jest
//             global.location.replace = jest.fn();
//
//             const rejectedRes = axios.interceptors.response.handlers[0].rejected({
//                 response: { status: 403 },
//             });
//
//             expect(global.location.replace).toBeCalledWith('/login');
//             expect(rejectedRes).toBeUndefined();
//         });
//     });
// });