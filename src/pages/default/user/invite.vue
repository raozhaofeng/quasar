<template>
    <div :style="{backgroundImage: 'url('+imageSrc(appConfig['invite_image'])+')',
            zIndex: 0, height: '100%', position: 'absolute', top: 0, left: 0, right: 0,
            backgroundSize: 'cover'}">
        <div>
            <div class="text-white">
                <div class="row q-pa-md items-center">
                    <div>
                        <q-avatar rounded>
                            <q-img no-spinner :src="imageSrc(appConfig['site_logo'])"></q-img>
                        </q-avatar>
                    </div>
                    <div class="text-h6 text-bold q-ml-sm">{{ $t(appConfig['site_name']) }}</div>
                </div>

                <div class="row justify-center" style="margin-top: 30%">
                    <q-card flat>
                        <q-card-section class="no-padding">
                            <div class="q-ma-sm">
                                <qrcode-vue :value="inviteUrl" :size="120" level="H"/>
                            </div>
                        </q-card-section>
                    </q-card>
                    <div class="text-body2 q-mt-md">{{ inviteUrl }}</div>
                </div>

                <div class="full-width" style="position: absolute;bottom: 0">
                    <div class="row justify-center q-gutter-xl" style="margin-bottom: 150px">
                        <q-btn flat class="bg-primary text-white"
                               @click="copyToClipboardFunc(userInfo.inviteCode)">
                            <div class="row items-center no-wrap">
                                <q-icon left name="sym_o_pin" size="lg"/>
                                <div class="text-center">
                                    <div class="text-body2">{{ userInfo.inviteCode }}</div>
                                    <div class="text-caption">{{ $t('copyInviteCode') }}</div>
                                </div>
                            </div>
                        </q-btn>

                        <q-btn flat class="bg-primary text-white"
                               @click="copyToClipboardFunc(inviteUrl)">
                            <div class="row items-center no-wrap">
                                <q-icon left name="sym_o_share" size="lg"/>
                                <div class="text-center">
                                    <div class="text-body2"> -</div>
                                    <div class="text-caption">{{ $t('copyInviteLink') }}</div>
                                </div>
                            </div>
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue'
import {reactive, toRefs} from 'vue'
import {imageSrc, negativeNotify, positiveNotify} from 'src/utils';
import store from 'src/store';
import {copyToClipboard} from 'quasar';
import {useI18n} from 'vue-i18n';
import Router from 'src/router'

export default {
    name: 'UserInvite',
    components: {QrcodeVue},
    setup() {
        const $i18n = useI18n()
        const state = reactive({
            appConfig: JSON.parse(JSON.stringify(store.state.prefetch.config)) as any,
            inviteUrl: document.location.protocol + '//' + document.domain + '/register?code=' + store.state.user.info.inviteCode,
            userInfo: JSON.parse(JSON.stringify(store.state.user.info))
        })

        // 复制方法
        const copyToClipboardFunc = (str: string) => {
            copyToClipboard(str).then(() => {
                positiveNotify($i18n.t('copySuccess'))
            }).catch(() => {
                negativeNotify($i18n.t('copyFailed'))
            })
        }

        return {
            copyToClipboardFunc,
            imageSrc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
