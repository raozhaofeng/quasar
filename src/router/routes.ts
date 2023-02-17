import {RouteRecordRaw} from 'vue-router';

export interface TemplateRouteInterface {
    path: string
    name: string
    component: string
    componentPath: string
    meta: any
    children: TemplateRouteInterface[]
}

export const templateRoutes: TemplateRouteInterface[] = [
    {
        path: '/', name: 'Layouts', componentPath: 'layouts', component: 'tabs.vue', children: [
            {
                path: '/',
                name: 'Home',
                componentPath: 'pages',
                component: 'index.vue',
                children: [],
                meta: {requireAuth: false, keepAlive: false}
            }, {
                path: '/product',
                name: 'Product',
                componentPath: 'pages',
                component: 'product/index.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/product/order',
                name: 'ProductOrder',
                componentPath: 'pages',
                component: 'product/order.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/service',
                name: 'Service',
                componentPath: 'pages',
                component: 'service.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user',
                name: 'UserIndex',
                componentPath: 'pages',
                component: 'user/index.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }
        ],
        meta: {}
    }, {
        path: '/layouts/main', name: 'LayoutsMain', componentPath: 'layouts', component: 'main.vue', children: [
            {
                path: '/login',
                name: 'Login',
                componentPath: 'pages',
                component: 'login.vue',
                children: [], meta: {}
            }, {
                path: '/register',
                name: 'Register',
                componentPath: 'pages',
                component: 'register.vue',
                children: [], meta: {}
            }, {
                path: '/download',
                name: 'Download',
                componentPath: 'pages',
                component: 'download.vue',
                children: [], meta: {}
            }, {
                path: '/lang',
                name: 'Lang',
                componentPath: 'pages',
                component: 'lang.vue',
                children: [], meta: {}
            }, {
                path: '/wallet',
                name: 'WalletIndex',
                componentPath: 'pages',
                component: 'user/wallet/index.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/wallet/account',
                name: 'WalletAccount',
                componentPath: 'pages',
                component: 'user/wallet/account.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/wallet/deposit',
                name: 'WalletDeposit',
                componentPath: 'pages',
                component: 'user/wallet/deposit.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/wallet/withdraw',
                name: 'WalletWithdraw',
                componentPath: 'pages',
                component: 'user/wallet/withdraw.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/bill',
                name: 'UserBill',
                componentPath: 'pages',
                component: 'user/bill.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/setting',
                name: 'UserSetting',
                componentPath: 'pages',
                component: 'user/setting.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/article',
                name: 'UserArticle',
                componentPath: 'pages',
                component: 'user/article.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/update',
                name: 'UserUpdate',
                componentPath: 'pages',
                component: 'user/update.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/verify',
                name: 'UserVerify',
                componentPath: 'pages',
                component: 'user/verify.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/update/password',
                name: 'UserUpdatePassword',
                componentPath: 'pages',
                component: 'user/updatePassword.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/update/security',
                name: 'UserUpdateSecurity',
                componentPath: 'pages',
                component: 'user/updateSecurity.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/level',
                name: 'UserLevel',
                componentPath: 'pages',
                component: 'user/level.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/invite',
                name: 'UserInvite',
                componentPath: 'pages',
                component: 'user/invite.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/user/team',
                name: 'UserTeam',
                componentPath: 'pages',
                component: 'user/team.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/product/details',
                name: 'ProductDetails',
                componentPath: 'pages',
                component: 'product/details.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/task/index',
                name: 'TaskIndex',
                componentPath: 'pages',
                component: 'task/index.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/task/details',
                name: 'TaskDetails',
                componentPath: 'pages',
                component: 'task/details.vue',
                children: [],
                meta: {requireAuth: true, keepAlive: true}
            }, {
                path: '/online',
                name: 'IndexOnline',
                componentPath: 'pages',
                component: 'online.vue',
                children: [],
                meta: {requireAuth: false, keepAlive: false}
            }
        ], meta: {}
    }
]


const routes: RouteRecordRaw[] = [
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/404.vue')
    }
];

export default routes;
