<template>
    <div class="q-pa-md">
        <div class="text-right">
            <chip-lang></chip-lang>
        </div>

        <div>
            <div class="text-center"
                 v-if="prefetchTemplate.hasOwnProperty('template_register') && (prefetchTemplate['template_register']['show_logo'] || prefetchTemplate['template_register']['show_name'])">
                <div v-if="prefetchTemplate['template_register']['show_logo']">
                    <q-img no-spinner :src="imageSrc(appConfig['site_logo'])" width="120px"></q-img>
                </div>
                <div class="text-h5 text-weight-bold q-mt-xs"
                     v-if="prefetchTemplate['template_register']['show_name']">
                    {{ $t(appConfig['site_name']) }}
                </div>
            </div>
            <div class="q-mt-xl text-h4 text-primary text-weight-bold" v-else>{{ $t('register') }}</div>
        </div>

        <div class="q-mt-xl q-gutter-md">
            <q-input v-model="params.nickname"
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['nickname']"
                     filled :label="$t('nickname')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_badge" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.username" filled :label="$t('username')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_person" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.telephone" type="number"
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['telephone']"
                     filled :label="$t('telephone')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-chip class="bg-transparent" size="20px" clickable @click="switchCountryFunc">
                        <q-avatar>
                            <img :src="imageSrc(currentCountry.icon)">
                        </q-avatar>
                        <div class="text-weight-light">+{{ currentCountry.code }}</div>
                    </q-chip>
                </template>
            </q-input>

            <q-input v-model="params.email"
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['email']"
                     filled :label="$t('email')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_mail" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.password" filled :label="$t('password')" type="password" clearable
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_lock" size="md"></q-icon>
                </template>
            </q-input>
            <q-input v-model="params.cmf_password"
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['confirm_password']"
                     filled :label="$t('cmfPassword')" type="password" clearable
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_lock" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.security_key" filled :label="$t('securityPassword')" type="password" clearable
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['security_key']"
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_security" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.cmf_security_key"
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['security_key'] && prefetchTemplate['template_register']['confirm_password']"
                     filled :label="$t('cmfSecurityPassword')" type="password"
                     clearable
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_security" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.invite_code"
                     v-if="prefetchTemplate.hasOwnProperty('template_register') && prefetchTemplate['template_register']['invite_code']"
                     filled :label="$t('inviteCode')" clearable
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_share" size="md"></q-icon>
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
        <q-btn class='full-width bg-primary text-white q-mt-xl' size="lg" :label="$t('register')"
               @click='submitFunc'></q-btn>

        <q-btn flat class='full-width text-grey q-mt-xs' size="md" :label="$t('alreadyLogin')"
               @click='$router.push({name: "Login"})'></q-btn>
    </div>

    <!--        默认国家选择-->
    <q-select v-model="currentCountry" :options="countries" option-label="code" hide-selected ref="countrySelectRef"
              @update:model-value="params.country_id = currentCountry.id" use-input behavior="dialog"
              @filter="countryFilterFunc" class="hidden"
              option-value="id">
        <template v-slot:option="{ itemProps, opt }">
            <q-item v-bind="itemProps">
                <q-item-section avatar>
                    <q-avatar>
                        <img :src="imageSrc(opt.icon)">
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <div class="text-body1">{{ opt.name }}</div>
                </q-item-section>
                <q-item-section side>
                    <div class="text-body1">+{{ opt.code }}</div>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs, watch} from 'vue';
import store from 'src/store';
import {CaptchaAPI, RegisterAPI} from 'src/api';
import {imageSrc} from 'src/utils';
import {useI18n} from 'vue-i18n';
import {negativeNotify} from 'src/utils';
import chipLang from 'components/chipLang.vue';
import Router from 'src/router'
import {connectWebsocket} from 'boot/websocket';

export default {
    name: 'IndexRegister',
    components: {chipLang},
    setup() {
        const $i18n = useI18n()
        const countrySelectRef = ref(null) as any
        const state = reactive({
            prefetchTemplate: JSON.parse(JSON.stringify(store.state.prefetch.template)) as any,
            appConfig: JSON.parse(JSON.stringify(store.state.prefetch.config)) as any,
            countries: JSON.parse(JSON.stringify(store.state.prefetch.countries)) as any,
            currentCountry: store.state.prefetch.countries[0] as any,
            params: {
                username: '',
                country_id: store.state.prefetch.countries.length > 0 ? store.state.prefetch.countries[0].id : 0,
                telephone: '',
                nickname: '',
                email: '',
                password: '',
                cmf_password: '',
                security_key: '',
                cmf_security_key: '',
                invite_code: Router.currentRoute.value.query.code ?? '',
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

        // 监听国家列表变化
        watch(() => store.state.prefetch.countries, (val: any) => {
            state.currentCountry = val[0]
            state.params.country_id = state.currentCountry.id
        })

        // 监听配置文件变化
        watch(() => store.state.prefetch.config, (val: any) => {
            state.appConfig = val
        })

        // 切换国家
        const switchCountryFunc = () => {
            countrySelectRef.value.showPopup()
        }

        // 过滤国家
        const countryFilterFunc = (val: any, update: any) => {
            if (val === '') {
                update(() => {
                    state.countries = JSON.parse(JSON.stringify(store.state.prefetch.countries))
                })
                return
            }

            update(() => {
                const needle = val.toLowerCase()
                state.countries = store.state.prefetch.countries.filter((v: any) => v.name.toLowerCase().indexOf(needle) > -1)
            })
        }

        // 刷新验证码
        const refreshCaptchaFunc = () => {
            void CaptchaAPI().then((captchaId: any) => {
                state.params.captcha_id = captchaId;
            });
        };

        // 登陆
        const submitFunc = () => {
            if (state.prefetchTemplate['template_register']['confirm_password']) {
                if (state.params.password !== state.params.cmf_password) {
                    negativeNotify($i18n.t('twicePasswordNoMatch'))
                    return
                }

                if (state.params.security_key !== state.params.cmf_security_key) {
                    negativeNotify($i18n.t('twiceSecurityPasswordNoMatch'))
                    return
                }
            }

            RegisterAPI(state.params).then((res: any) => {
                store.commit('user/updateInfo', res.info)
                store.commit('user/updateToken', res.token)
                store.commit('user/updateTokenKey', res.tokenKey)
                void Router.push({name: 'Home'})
            }).catch(() => {
                refreshCaptchaFunc()
            })
        }

        return {
            imageSrc,
            countrySelectRef,
            switchCountryFunc,
            countryFilterFunc,
            refreshCaptchaFunc,
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
