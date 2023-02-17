<template>
    <router-view/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {PreFetchAPI} from 'src/api';
import store from 'src/store'
import Router from 'src/router'
import {dynamicTemplate} from 'src/router';
import {templateRoutes} from 'src/router/routes';
import {setLocales} from 'boot/i18n';
import {setCssVar} from 'quasar'
import {imageSrc} from 'src/utils';

export default defineComponent({
    name: 'App',
    preFetch: () => {
        // 设置样式方法
        const setCssValFunc = (template: any) => {
            setCssVar('primary', template['color_primary'])
            setCssVar('secondary', template['color_secondary'])
            setCssVar('accent', template['color_accent'])
        }

        //  设置logo图标
        const setAppLogoFunc = (logoPath: string) => {
            logoPath = imageSrc(logoPath)
            localStorage.setItem('_appIco', logoPath)
            let documentLink = document.createElement('link')
            documentLink.type = 'image/x-icon';
            documentLink.rel = 'shortcut icon';
            documentLink.href = imageSrc(logoPath)
            document.getElementsByTagName('head')[0].appendChild(documentLink)
        }

        // 默认设置主题颜色
        if (store.state.prefetch.template.hasOwnProperty('color_primary')) {
            setCssValFunc(store.state.prefetch.template)
        }

        // 如果还没到时间，那么不请求数据
        let nowTime = parseInt((new Date().getTime() / 1000).toString())
        if (!store.state.prefetch.config.hasOwnProperty('cache_expire') || store.state.prefetch.config['cache_expire'] < nowTime) {
            // 判断是否带参数语言
            const urlParams = new URLSearchParams(window.location.search)
            if (urlParams.has('lang')) {
                store.commit('user/updateLang', urlParams.get('lang'))
            }

            //  请求预设数据
            PreFetchAPI().then(async (res: any) => {
                dynamicTemplate(templateRoutes, res.template['template'], '')
                await Router.replace(Router.currentRoute.value.fullPath)
                res.config['cache_expire'] = nowTime + parseInt(res.config['cache_expire'])
                store.commit('prefetch/updateConfig', res.config)           //  保存配置
                store.commit('prefetch/updateTemplate', res.template)       //  保存模版
                store.commit('prefetch/updateLocales', res.locales)         //  保存语言包
                store.commit('prefetch/updateLangList', res.langList)      //  保存语言列表
                store.commit('prefetch/updateCountries', res.countries)     //  保存国家列表
                store.commit('user/updateLang', res.lang)                   //  用户语言
                // 设置网站图标ICO
                setAppLogoFunc(res.config['site_logo'])
                // 设置主题颜色
                setCssValFunc(res.template)
                // 重新载入语言包
                setLocales(res.locales, res.lang)
            })
        }
    }
});
</script>
