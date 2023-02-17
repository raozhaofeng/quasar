import {api} from 'boot/axios';

// 帮助中心
export const UserHelpers = () => {
    return api.post('/user/helpers')
}

// 用户信息
export const UserInfoAPI = () => {
    return api.post('/user/info', {}, {showLoading: false} as any)
}

// 用户账单列表
export const UserBillAPI = () => {
    return api.post('/user/bill')
}

// 用户信息更新
export const UserUpdateAPI = (params: any) => {
    return api.post('/user/update', params)
}

// 用户更新登陆密码
export const UserUpdatePasswordAPI = (params: any) => {
    return api.post('/user/update/password', params)
}

// 用户更新安全密钥
export const UserUpdateSecurityAPI = (params: any) => {
    return api.post('/user/update/security', params)
}

// 用户验证信息
export const UserVerifyInfoAPI = () => {
    return api.post('/user/verify/info')
}

// 用户验证
export const UserVerifyAPI = (params: any) => {
    return api.post('/user/verify', params)
}

// 用户团队
export const UserTeamAPI = () => {
    return api.post('/user/team')
}

// 用户等级列表
export const UserLevelListAPI = () => {
    return api.post('/user/level/index')
}

// 用户购买等级
export const UserLevelAPI = (params: any) => {
    return api.post('/user/level', params)
}
