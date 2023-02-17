<template>
    <q-layout view='hHh lpR fFf' class='bg-grey-1'>
        <q-page-container>
            <router-view/>
        </q-page-container>
        <q-footer v-if="tabBarItems.length > 0">
            <q-tabs v-model='currentTab' :active-color='currentTextColor' narrow-indicator indicator-color='transparent'
                    dense no-caps align='justify' :class='tabClass' :style='tabStyle'>
                <q-route-tab :ripple='false' exact replace :name='item.name'
                             :icon='currentTab === item.name ? item.activeIcon : item.icon'
                             :to='item.router'
                             :label="item.label ?? ''"
                             v-for='(item, index) in tabBarItems' :key='index'/>
            </q-tabs>
        </q-footer>
        <div class="fixed-bottom-right q-mr-lg" style="margin-bottom: 86px" v-if="appConfig['home_online'] !== ''">
            <q-avatar size="60px" color="primary" @click="linkOnlineFunc">
                <q-icon name="sym_o_support_agent" size="50px" color="white"></q-icon>
            </q-avatar>
        </div>
    </q-layout>
</template>

<script lang='ts'>
import {onMounted, reactive, toRefs, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import store from 'src/store'
import {imageSrc} from 'src/utils';
import Router from 'src/router';

export default {
    name: 'LayoutsTabs',
    setup() {
        const $i18n = useI18n()
        const state = reactive({
            appConfig: store.state.prefetch.config,
            tabBarItems: [] as any,
            currentTab: '',
            currentTextColor: 'primary',
            tabStyle: {height: '56px'},
            tabClass: ['bg-white', 'text-grey', 'shadow-1']
        });

        onMounted(() => {
            initTabsFunc()
        })

        // 监听配置信息
        watch(() => store.state.prefetch.config, (val: any) => {
            state.appConfig = val
            initTabsFunc()
        })

        // 初始化Tabs
        const initTabsFunc = () => {
            if (state.appConfig.hasOwnProperty('admin_tabs') && state.tabBarItems.length === 0) {
                for (let i = 0; i < state.appConfig['admin_tabs'].length; i++) {
                    const tabsItem = state.appConfig['admin_tabs'][i]
                    const tabLabel = tabsItem['label'] === '' ? 'tab' + i : tabsItem['label']
                    state.tabBarItems.push({
                        name: tabLabel,
                        label: tabsItem['label'] === '' ? '' : $i18n.t(tabsItem['label']),
                        icon: 'img:' + imageSrc(tabsItem['icon']),
                        activeIcon: 'img:' + imageSrc(tabsItem['active_icon']),
                        router: tabsItem['router']
                    })
                }
            }
        }

        // 跳转到在线客服
        const linkOnlineFunc = () => {
            if (state.appConfig['home_online'].indexOf('http') > -1) {
                window.location.href = state.appConfig['home_online']
            } else {
                Router.push({name: 'IndexOnline'})
            }
        }

        return {
            linkOnlineFunc,
            ...toRefs(state)
        };
    }
};
</script>

<style scoped>

</style>
