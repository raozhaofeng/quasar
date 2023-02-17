<template>
    <div>
        <backtrack :title="$t('userInfo')"></backtrack>

        <div class="q-ma-md">

            <q-uploader flat style='width: 100%;' auto-upload class="q-mb-xl bg-transparent"
                        :url='baseURL + "/upload"' field-name='file'
                        accept='.jpg,.png,image/*'
                        v-if="prefetchTemplate.hasOwnProperty('template_basic') && prefetchTemplate['template_basic']['update_avatar']"
                        @uploaded='(info) => {params.avatar = JSON.parse(info.xhr.response).data}'
                        :headers="[{name: 'Token', value: $store.state.user.token}, {name: 'Token-Key', value: $store.state.user.tokenKey}]">
                <template v-slot:header></template>
                <template v-slot:list='scope'>
                    <div @click='scope.pickFiles' class="row justify-center no-padding">
                        <q-uploader-add-trigger/>
                        <q-avatar v-if="params.avatar === ''" size="80px">
                            <q-icon name="sym_o_add_photo_alternate" color="grey" size="80px"></q-icon>
                        </q-avatar>
                        <q-avatar v-else size="80px">
                            <q-img no-spinner :src="imageSrc(params.avatar)"></q-img>
                        </q-avatar>
                    </div>
                </template>
            </q-uploader>

            <q-input v-model="params.nickname" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_basic') && prefetchTemplate['template_basic']['update_nickname']"
                     filled :label="$t('nickname')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_badge" size="md"></q-icon>
                </template>
            </q-input>

            <q-input v-model="params.telephone" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_basic') && prefetchTemplate['template_basic']['update_telephone']"
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
                     v-if="prefetchTemplate.hasOwnProperty('template_basic') && prefetchTemplate['template_basic']['update_email']"
                     filled :label="$t('email')" clearable input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_mail" size="md"></q-icon>
                </template>
            </q-input>

            <q-select filled v-model='params.sex' :label='$t("sex")' class="q-mb-md"
                      v-if="prefetchTemplate.hasOwnProperty('template_basic') && prefetchTemplate['template_basic']['update_sex']"
                      :options='[{label: $t("unknown"), value: -1}, {label:$t("male"), value: 1}, {label: $t("women"), value: 2}]'
                      map-options emit-value>
                <template v-slot:prepend>
                    <q-icon name="sym_o_safety_divider" size="md"></q-icon>
                </template>
            </q-select>

            <q-input :label='$t("birthday")' v-model='params.birthday' filled input-class="text-body1" class="q-mb-md"
                     v-if="prefetchTemplate.hasOwnProperty('template_basic') && prefetchTemplate['template_basic']['update_birthday']"
                     :model-value='typeof params.birthday === "number" ? date.formatDate(params.birthday*1000, "YYYY/MM/DD") : params.birthday'>
                <template v-slot:prepend>
                    <q-icon name='event' class='cursor-pointer' size="md">
                        <q-popup-proxy ref='qDateProxy' cover transition-show='scale'
                                       transition-hide='scale'>
                            <q-date v-model='params.birthday'>
                                <div class='row items-center justify-end'>
                                    <q-btn v-close-popup :label='$t("cancel")' color='primary' flat/>
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>

            <q-btn class='full-width bg-primary text-white q-mt-md' size="lg" :label="$t('submit')"
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
import {reactive, ref, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {UserInfoAPI, UserUpdateAPI} from 'src/api/user';
import store from 'src/store'
import {imageSrc} from 'src/utils';
import {date} from 'quasar';
import {positiveNotify} from 'src/utils';
import {useI18n} from 'vue-i18n';

export default {
    name: 'UserUpdate',
    components: {backtrack},
    setup() {
        const $i18n = useI18n()
        const countrySelectRef = ref(null) as any
        const state = reactive({
            baseURL: process.env.baseURL,
            prefetchTemplate: JSON.parse(JSON.stringify(store.state.prefetch.template)) as any,
            countries: JSON.parse(JSON.stringify(store.state.prefetch.countries)) as any,
            currentCountry: store.state.prefetch.countries[0] as any,
            userInfo: JSON.parse(JSON.stringify(store.state.user.info)),
            params: {
                country_id: 0,
                nickname: '',
                avatar: '',
                telephone: '',
                email: '',
                sex: 0,
                birthday: ''
            } as any
        })

        //  赋值数据
        if (state.prefetchTemplate.hasOwnProperty('template_basic') && state.prefetchTemplate['template_basic']['update_avatar']) {
            state.params.avatar = state.userInfo.avatar
        }

        if (state.prefetchTemplate.hasOwnProperty('template_basic') && state.prefetchTemplate['template_basic']['update_nickname']) {
            state.params.nickname = state.userInfo.nickname
        }

        if (state.prefetchTemplate.hasOwnProperty('template_basic') && state.prefetchTemplate['template_basic']['update_telephone']) {
            state.params.telephone = state.userInfo.telephone
            for (const countryKey in state.countries) {
                if (state.userInfo.country_id === state.countries[countryKey].id) {
                    state.currentCountry = state.countries[countryKey]
                }
            }
        }

        if (state.prefetchTemplate.hasOwnProperty('template_basic') && state.prefetchTemplate['template_basic']['update_email']) {
            state.params.email = state.userInfo.email
        }

        if (state.prefetchTemplate.hasOwnProperty('template_basic') && state.prefetchTemplate['template_basic']['update_sex']) {
            state.params.sex = parseInt(state.userInfo.sex)
        }

        if (state.prefetchTemplate.hasOwnProperty('template_basic') && state.prefetchTemplate['template_basic']['update_birthday']) {
            state.params.birthday = date.formatDate(state.userInfo.birthday * 1000, 'YYYY/MM/DD')
        }

        // 更新用户信息
        const userInfoFunc = () => {
            UserInfoAPI().then((res: any) => {
                state.userInfo = res
                store.commit('user/updateInfo', res)
            })
        }

        const submitFunc = () => {
            UserUpdateAPI(state.params).then(() => {
                positiveNotify($i18n.t('submitSuccessfully'))
                userInfoFunc()
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
            date,
            imageSrc,
            submitFunc,
            countrySelectRef,
            switchCountryFunc,
            countryFilterFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
