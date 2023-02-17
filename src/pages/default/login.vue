<template>
    <div class="q-pa-md">
        <div class="text-right">
            <chip-lang></chip-lang>
        </div>

        <div>
            <div class="text-center"
                 v-if="prefetchTemplate.hasOwnProperty('template_login') && (prefetchTemplate['template_login']['show_logo'] || prefetchTemplate['template_login']['show_name'])">
                <div v-if="prefetchTemplate['template_login']['show_logo']">
                    <q-img no-spinner :src="imageSrc(appConfig['site_logo'])" width="120px"></q-img>
                </div>
                <div class="text-h5 text-weight-bold q-mt-xs"
                     v-if="prefetchTemplate['template_login']['show_name']">
                    {{ $t(appConfig['site_name']) }}
                </div>
            </div>
            <div class="q-mt-xl text-h4 text-primary text-weight-bold" v-else>{{ $t('login') }}</div>
        </div>

        <div class="q-mt-xl q-gutter-md">
            <q-input v-model="params.username" filled :label="$t('username')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_person" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.password" filled :label="$t('password')" type="password" clearable
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_lock" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model='params.captcha_value' filled :label="$t('captchaValue')" type="number"
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_pin" size="md"></q-icon>
                </template>
                <template v-slot:append>
                    <q-img no-spinner
                           v-if="params.captcha_id !== ''"
                           :src='imageSrc("/captcha/image?id=" + params.captcha_id + "&w=120&h=32")'
                           width='120px' height='32px' @click='refreshCaptchaFunc'></q-img>
                </template>
            </q-input>
        </div>
        <q-btn class='full-width bg-primary text-white q-mt-xl' size="lg" :label="$t('login')"
               @click='submitFunc'></q-btn>

        <q-btn flat class='full-width text-grey q-mt-xs' size="md" :label="$t('noRegister')"
               v-if="prefetchTemplate.hasOwnProperty('template_login') && prefetchTemplate['template_login']['show_register']"
               @click='$router.push({name: "Register"})'></q-btn>
    </div>
</template>

<script lang="ts">
import {reactive, toRefs, onMounted, watch} from 'vue'
import {imageSrc} from 'src/utils';
import {CaptchaAPI, LoginAPI} from 'src/api';
import store from 'src/store'
import Router from 'src/router'
import chipLang from 'components/chipLang.vue';

export default {
    name: 'IndexLogin',
    components: {chipLang},
    setup() {
        const state = reactive({
            prefetchTemplate: JSON.parse(JSON.stringify(store.state.prefetch.template)) as any,
            appConfig: JSON.parse(JSON.stringify(store.state.prefetch.config)) as any,
            params: {
                username: '',
                password: '',
                captcha_id: '',
                captcha_value: ''
            }
        })
        // 初始化
        onMounted(() => {
            refreshCaptchaFunc();
        });

        // 监听模版状态变化
        watch(() => store.state.prefetch.template, (val: any) => {
            state.prefetchTemplate = val
        })

        // 监听配置文件变化
        watch(() => store.state.prefetch.config, (val: any) => {
            state.appConfig = val
        })

        // 刷新验证码
        const refreshCaptchaFunc = () => {
            void CaptchaAPI().then((captchaId: any) => {
                state.params.captcha_id = captchaId;
            });
        };

        // 登陆
        const submitFunc = () => {
            LoginAPI(state.params).then((res: any) => {
                store.commit('user/updateInfo', res.info)
                store.commit('user/updateToken', res.token)
                store.commit('user/updateTokenKey', res.tokenKey)
                void Router.push(<string>Router.currentRoute.value.query.next ?? '/');
            }).catch(() => {
                refreshCaptchaFunc()
            })
        }

        return {
            imageSrc,
            refreshCaptchaFunc,
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
