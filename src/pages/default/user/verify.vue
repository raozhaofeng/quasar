<template>
    <div>
        <backtrack :title="$t('realNameVerify')"></backtrack>

        <div class="q-ma-md">
            <q-banner inline-actions rounded class="bg-red text-white q-mb-md"
                      v-if="verifyInfo.hasOwnProperty('data') && verifyInfo.data !== ''">
                {{ verifyInfo.data }}
            </q-banner>

            <q-input v-model="params.real_name" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['real_name']"
                     filled :label="$t('realName')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_badge" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.id_number" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['id_number']"
                     filled :label="$t('iDNumber')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_pin" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.telephone" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['telephone']"
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

            <q-input v-model="params.email" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['email']"
                     filled :label="$t('email')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_mail" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.address" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['address']"
                     filled :label="$t('idAddress')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_location_on" size="md"></q-icon>
                </template>
            </q-input>

            <div class="row items-center">
                <div class="col"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['photo_front']">
                    <q-uploader flat style='width: 100%;' auto-upload class="bg-transparent"
                                :url='baseURL + "/upload"' field-name='file'
                                accept='.jpg,.png,image/*'
                                @uploaded='(info) => {params.id_photo1 = JSON.parse(info.xhr.response).data}'
                                :headers="[{name: 'Token', value: $store.state.user.token}, {name: 'Token-Key', value: $store.state.user.tokenKey}]">
                        <template v-slot:header></template>
                        <template v-slot:list='scope'>
                            <div @click='scope.pickFiles' class="row justify-center no-padding">
                                <q-uploader-add-trigger/>
                                <q-avatar v-if="params.id_photo1 === ''" size="100px">
                                    <q-icon name="sym_o_add_photo_alternate" color="grey" size="100px"></q-icon>
                                </q-avatar>
                                <q-avatar v-else size="100px" rounded>
                                    <q-img no-spinner :src="imageSrc(params.id_photo1)"></q-img>
                                </q-avatar>
                            </div>
                        </template>
                    </q-uploader>
                    <div class="text-center text-caption">{{ $t('photoFront') }}</div>
                </div>
                <div class="col"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['photo_back']">
                    <q-uploader flat style='width: 100%;' auto-upload class="bg-transparent"
                                :url='baseURL + "/upload"' field-name='file'
                                accept='.jpg,.png,image/*'
                                @uploaded='(info) => {params.id_photo2 = JSON.parse(info.xhr.response).data}'
                                :headers="[{name: 'Authorization', value: $store.state.user.token}]">
                        <template v-slot:header></template>
                        <template v-slot:list='scope'>
                            <div @click='scope.pickFiles' class="row justify-center no-padding">
                                <q-uploader-add-trigger/>
                                <q-avatar v-if="params.id_photo2 === ''" size="100px">
                                    <q-icon name="sym_o_add_photo_alternate" color="grey" size="100px"></q-icon>
                                </q-avatar>
                                <q-avatar v-else size="100px" rounded>
                                    <q-img no-spinner :src="imageSrc(params.id_photo2)"></q-img>
                                </q-avatar>
                            </div>
                        </template>
                    </q-uploader>
                    <div class="text-center text-caption">{{ $t('photoBack') }}</div>
                </div>
                <div class="col"
                     v-if="prefetchTemplate.hasOwnProperty('template_verify') && prefetchTemplate['template_verify']['photo_hold']">
                    <q-uploader flat style='width: 100%;' auto-upload class="bg-transparent"
                                :url='baseURL + "/upload"' field-name='file'
                                accept='.jpg,.png,image/*'
                                @uploaded='(info) => {params.id_photo3 = JSON.parse(info.xhr.response).data}'
                                :headers="[{name: 'Authorization', value: $store.state.user.token}]">
                        <template v-slot:header></template>
                        <template v-slot:list='scope'>
                            <div @click='scope.pickFiles' class="row justify-center no-padding">
                                <q-uploader-add-trigger/>
                                <q-avatar v-if="params.id_photo3 === ''" size="100px">
                                    <q-icon name="sym_o_add_photo_alternate" color="grey" size="100px"></q-icon>
                                </q-avatar>
                                <q-avatar v-else size="100px" rounded>
                                    <q-img no-spinner :src="imageSrc(params.id_photo3)"></q-img>
                                </q-avatar>
                            </div>
                        </template>
                    </q-uploader>
                    <div class="text-center text-caption">{{ $t('holdPhoto') }}</div>
                </div>
            </div>

            <q-btn class='full-width text-white q-mt-md' size="lg" :class="!verifyInfo.hasOwnProperty('status') || verifyInfo.status === -1 ? 'bg-primary' : 'bg-grey'" :label="!verifyInfo.hasOwnProperty('status') || verifyInfo.status === -1 ? $t('submit') : $t('submitted')"
                   @click='submitFunc'></q-btn>
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
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, ref, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {imageSrc} from 'src/utils';
import store from 'src/store';
import {UserVerifyAPI, UserVerifyInfoAPI, UserInfoAPI} from 'src/api/user';
import {positiveNotify} from 'src/utils';
import {useI18n} from 'vue-i18n';
import Router from 'src/router';

export default {
    name: 'UserVerify',
    components: {backtrack},
    setup() {
        const $i18n = useI18n()
        const countrySelectRef = ref(null) as any
        const state = reactive({
            verifyInfo: {} as any,
            baseURL: process.env.baseURL,
            prefetchTemplate: JSON.parse(JSON.stringify(store.state.prefetch.template)) as any,
            countries: JSON.parse(JSON.stringify(store.state.prefetch.countries)) as any,
            currentCountry: store.state.prefetch.countries[0] as any,
            params: {
                real_name: '',
                id_number: '',
                country_id: 0,
                telephone: '',
                email: '',
                address: '',
                id_photo1: '',
                id_photo2: '',
                id_photo3: ''
            } as any
        })

        onMounted(() => {
            userVerifyInfoFunc()
        })

        // 提交
        const submitFunc = () => {
            if (!state.verifyInfo.hasOwnProperty('status') || state.verifyInfo.status === -1) {
                UserVerifyAPI(state.params).then(() => {
                    positiveNotify($i18n.t('submitSuccessfully'))
                    userVerifyInfoFunc()
                    // 更新用户信息
                    UserInfoAPI().then((res: any) => {
                        store.commit('user/updateInfo', res)
                    })

                    setTimeout(() => {
                        Router.back()
                    }, 1000)
                })
            }
        }

        // 获取验证信息方法
        const userVerifyInfoFunc = () => {
            UserVerifyInfoAPI().then((res: any) => {
                if (res !== null) {
                    state.verifyInfo = res
                    state.params = {
                        real_name: state.verifyInfo.real_name ?? '',
                        id_number: state.verifyInfo.id_number ?? '',
                        country_id: state.verifyInfo.country_id,
                        telephone: state.verifyInfo.telephone,
                        email: state.verifyInfo.email,
                        address: state.verifyInfo.address ?? '',
                        id_photo1: state.verifyInfo.id_photo1 ?? '',
                        id_photo2: state.verifyInfo.id_photo2 ?? '',
                        id_photo3: state.verifyInfo.id_photo3 ?? ''
                    }
                }
            })
        }

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

        return {
            imageSrc,
            countrySelectRef,
            switchCountryFunc,
            countryFilterFunc,
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
