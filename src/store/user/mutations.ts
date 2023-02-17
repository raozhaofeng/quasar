import {MutationTree} from 'vuex';
import {UserStateInterface} from './state';
import {UserToken, UserTokenKey, UserInfo, UserLang} from './state';

const mutation: MutationTree<UserStateInterface> = {
    // 更新用户Token
    updateToken(state: UserStateInterface, token: string) {
        state.token = token;
        localStorage.setItem(UserToken, token);
    },
    // 更新用户Token key
    updateTokenKey(state: UserStateInterface, tokenKey: string) {
        state.tokenKey = tokenKey
        localStorage.setItem(UserTokenKey, tokenKey)
    },
    // 更新用户信息
    updateInfo(state: UserStateInterface, info: object) {
        state.info = info;
        localStorage.setItem(UserInfo, JSON.stringify(info));
    },
    // 更新用户语言
    updateLang(state: UserStateInterface, lang: string) {
        state.lang = lang
        localStorage.setItem(UserLang, lang)
    }
};

export default mutation;
