import {api} from 'boot/axios';

// 产品列表
export const ProductIndexAPI = (params: any) => {
    return api.post('/product/index', params)
}

// 购买产品
export const ProductCreateAPI = (params: any) => {
    return api.post('/product/create', params)
}

// 产品收益
export const ProductEarningsAPI = (params: any) => {
    return api.post('/product/earnings', params)
}

// 产品订单列表
export const ProductOrderAPI = () => {
    return api.post('/product/order', {}, {showLoading: false} as any)
}

// 产品详情
export const ProductDetailsAPI = (params: any) => {
    return api.post('/product/details', params)
}
