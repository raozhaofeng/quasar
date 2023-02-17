export interface UserStateInterface {
    token: string;
    tokenKey: string;
    info: any;
    lang: string;
}

export const UserToken = '_token';
export const UserTokenKey = '_tokenKey';
export const UserInfo = '_userInfo';
export const UserLang = '_userLang';

function state(): UserStateInterface {
    return {
        token: localStorage.getItem(UserToken) ?? '',
        tokenKey: localStorage.getItem(UserTokenKey) ?? '',
        info: localStorage.getItem(UserInfo) ? JSON.parse(<string>localStorage.getItem(UserInfo)) : {},
        lang: localStorage.getItem(UserLang) ?? '',
    };
}

export default state;
