import axios from 'axios';
import {makeHeaders, _refreshAuthTokens} from './WildApricotCommunication';

let isRefreshing = false;
let subscribers = [];

const subscribeTokenRefresh = async (cb) => {
    subscribers.push(cb);
}

const subscribersOnRefreshed = async () => {
    subscribers.map(cb => cb());
}

export const initializeUnauthorizedInterceptor = async (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        response => {
            console.log("In interceptor");
            return response
        },
        async err => {
            const {
                config,
                status,
                data,
            } = err.response;


            if (status === 401 && data.reason === 'invalid_token') {
                if (!isRefreshing) {
                    isRefreshing = true;
                    await _refreshAuthTokens();
                    isRefreshing = false;
                }
                config.headers = await makeHeaders();
                const requestSubscribers = new Promise(resolve => {
                    subscribeTokenRefresh(() => resolve(axios(config)));    // original request
                });

                subscribersOnRefreshed();

                return requestSubscribers;
            }
        }
    );
};