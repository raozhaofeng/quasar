// import { route } from 'quasar/wrappers';
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory
} from 'vue-router';
import store from 'src/store';
// import { StateInterface } from 'src/store';

import routes, {TemplateRouteInterface, templateRoutes} from 'src/router/routes';

const componentPathList = {
    layouts: import.meta.glob('../layouts/**/*.vue'),
    pages: import.meta.glob('../pages/**/*.vue')
} as any

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// export default route<StateInterface>(function({ /* store, ssrContext */ }) {
//     const createHistory = process.env.SERVER
//         ? createMemoryHistory
//         : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);
//
//     const Router = createRouter({
//         scrollBehavior: () => ({ left: 0, top: 0 }),
//         routes,
//
//         // Leave this as is and make changes in quasar.conf.js instead!
//         // quasar.conf.js -> build -> vueRouterMode
//         // quasar.conf.js -> build -> publicPath
//         history: createHistory(process.env.VUE_ROUTER_BASE)
//     });
//
//     return Router;
// });


const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

const Router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
});

// 路由前置守卫
Router.beforeEach((to, form, next) => {
    //  如果是进入登录页面并且
    if ((to.name === 'Login' || to.name === 'Register') && store.getters['user/isLogin']) {
        next({name: 'Home'});
    } else {
        // 验证是否跳转到登录页面
        if (to.matched.some(record => record.meta.requireAuth) && !store.getters['user/isLogin']) {
            next({name: 'Login', query: {next: to.fullPath}});
        } else {
            next();
        }
    }
});

// dynamicTemplate 动态添加模版
export const dynamicTemplate = (templateRoutes: TemplateRouteInterface[], template: string, parentName = '') => {
    if (template && template !== '') {
        templateRoutes.forEach((item) => {
            if (parentName === '') {
                let vuePath = '../' + item.componentPath + '/' + item.component
                if (item.componentPath === 'pages') {
                    vuePath = '../pages/' + template + '/' + item.component
                }
                Router.addRoute({
                    name: item.name,
                    path: item.path,
                    component: componentPathList[item.componentPath][vuePath],
                    meta: item.meta
                })
            } else {
                Router.addRoute(parentName, {
                    path: item.path,
                    name: item.name,
                    component: componentPathList[item.componentPath]['../pages/' + template + '/' + item.component],
                    meta: item.meta
                })
            }
            if (item.hasOwnProperty('children') && item.children !== null && item.children.length > 0) {
                dynamicTemplate(item.children, template, item.name)
            }
        });
    }
}

const storeTemplate = store.state.prefetch.template
if (storeTemplate.hasOwnProperty('template')) {
    dynamicTemplate(templateRoutes.get(storeTemplate['template']), storeTemplate['template'], '');
}
export default Router;
