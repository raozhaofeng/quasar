import {api} from 'boot/axios';

// 钱包记录列表
export const WalletIndexAPI = () => {
    return api.post('/wallet/index')
}

// 钱包充值信息
export const WalletDepositInfoAPI = () => {
    return api.post('/wallet/deposit/info')
}

// 钱包充值
export const WalletDepositAPI = (params: any) => {
    return api.post('/wallet/deposit', params)
}


// 钱包提现信息
export const WalletWithdrawInfoAPI = () => {
    return api.post('/wallet/withdraw/info')
}

// 钱包提现账户列表
export const WalletAccountIndexAPI = () => {
    return api.post('/wallet/account/index')
}

// 钱包提现账户新增
export const WalletAccountAPI = (params: any) => {
    return api.post('/wallet/account', params)
}

// 钱包提现账户更新
export const WalletAccountUpdateAPI = (params: any) => {
    return api.post('/wallet/account/update', params)
}

// 钱包提现账户删除
export const WalletAccountDeleteAPI = (params: any) => {
    return api.post('/wallet/account/delete', params)
}

// 钱包提现
export const WalletWithdrawAPI = (params: any) => {
    return api.post('/wallet/withdraw', params)
}
