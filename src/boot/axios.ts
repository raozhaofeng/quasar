import {boot} from 'quasar/wrappers';
import {Loading, QSpinnerBars} from 'quasar';
import axios, {AxiosInstance} from 'axios';
import store from 'src/store';
import {negativeNotify} from 'src/utils';
import {LogoutAPI} from 'src/api';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({baseURL: process.env.baseURL});

// 请求数据拦截
api.interceptors.request.use(
    (config: any) => {
        if (!config.hasOwnProperty('showLoading') || config.showLoading) {
            Loading.show({
                spinner: QSpinnerBars,
                spinnerColor: 'secondary',
                spinnerSize: 50,
                message: 'Some important process is in progress. Hang on...'
            });
        }

        // 如果存在Token，那么请求带上Token
        if (store.state.user.token !== '' && !config.headers.hasOwnProperty('Token')) {
            config.headers['Token'] = store.state.user.token;
            config.headers['Token-Key'] = store.state.user.tokenKey
        }

        // 如果设置了语言，那么请求带上语言
        if (store.state.user.lang !== '') {
            config.headers['Accept-Language'] = store.state.user.lang
        }
        return config;
    },
    (err) => {
        void Promise.reject(err);
    }
);

// 响应数据拦截
api.interceptors.response.use(
    (response) => {
        Loading.hide();
        const res = response.data;
        if (res.code === 0) {
            return res.data;
        }
        negativeNotify(res.msg);
        return Promise.reject(res.msg);
    },
    (err) => {
        Loading.hide();
        if (err.response) {
            switch (err.response.status) {
                case 401:
                    LogoutAPI();
                    break;
                case 500:
                    negativeNotify('The system is busy, please try again');
                    break;
                default:
                    negativeNotify('Network connection errors');
            }
        }
        return Promise.reject(err);
    }
);

export default boot(({app}) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
});

export {api};
