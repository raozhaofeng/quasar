import {api} from 'boot/axios';
import store from 'src/store';
import router from 'src/router';

// captcha 验证码
export const CaptchaAPI = () => {
    return api.get('/captcha/generate', {showLoading: false} as any);
};

// 站点预处理
export const PreFetchAPI = () => {
    return api.post('/prefetch', {}, {showLoading: false} as any)
}

// 获取语言包
export const LocalesAPI = () => {
    return api.post('/locales')
}

// 获取下载文件
export const DownFileAPI = () => {
    return api.post('/down')
}

// 首页信息
export const IndexAPI = () => {
    return api.post('/index')
}

// 文章内容
export const UserArticleAPI = (params: any) => {
    return api.post('/article', params)
}

// 用户登陆
export const LoginAPI = (params: any) => {
    return api.post('/login', params)
}

// 用户注册
export const RegisterAPI = (params: any) => {
    return api.post('/register', params)
}

// 用户退出
export const LogoutAPI = () => {
    localStorage.clear();
    store.commit('user/updateToken', '');
    void router.push({name: 'Login'});
};
