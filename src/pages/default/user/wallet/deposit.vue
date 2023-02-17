<template>
    <div>
        <backtrack :title="$t('userDeposit')"></backtrack>

        <div class="q-ma-md" v-if="paymentList.length > 0">
            <!--            银行卡|加密货币    -->
            <q-list bordered style="border-radius: 8px;" class="bg-white"
                    v-if="currentPayment.hasOwnProperty('type') && (currentPayment.type === 1 || currentPayment.type === 10)">
                <q-item>
                    <q-item-section avatar>
                        <div class="text-body1 text-bold" v-if="currentPayment.type === 1">{{ $t('bankName') }}</div>
                        <div class="text-body1 text-bold" v-else>{{ $t('chainName') }}</div>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1 text-right">{{ currentPayment.name }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn flat :label="$t('copy')" class="text-body1"
                               @click="copyToClipboardFunc(currentPayment.name)"></q-btn>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar>
                        <div class="text-body1 text-bold" v-if="currentPayment.type === 1">{{ $t('realName') }}</div>
                        <div class="text-body1 text-bold" v-else>{{ $t('tokenName') }}</div>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1 text-right">{{ currentPayment.account_name }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <div>
                            <q-btn flat :label="$t('copy')" class="text-body1"
                                   @click="copyToClipboardFunc(currentPayment.account_name)"></q-btn>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar>
                        <div class="text-body1 text-bold" v-if="currentPayment.type === 1">{{
                                $t('bankCardNumber')
                            }}
                        </div>
                        <div class="text-body1 text-bold" v-else>{{ $t('tokenAddress') }}</div>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">
                            <div class="text-red text-right">{{ $t('clickCopyText') }}</div>
                        </div>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn flat :label="$t('copy')" class="text-body1"
                               @click="copyToClipboardFunc(currentPayment.account_code)"></q-btn>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <div class="text-red text-center text-body2">{{ currentPayment.account_code }}</div>
                    </q-item-section>
                </q-item>
            </q-list>

            <div v-else-if="currentPayment.hasOwnProperty('type')" class="text-center q-mb-xl">
                <q-img no-spinner :src="imageSrc(currentPayment.icon)" width="120px" height="120px"></q-img>
                <div class="text-h5">{{ currentPayment.name }}</div>
            </div>

            <q-list bordered style="border-radius: 8px;" class="bg-white q-mt-lg">
                <q-item>
                    <q-item-section avatar>
                        <div class="text-body1 text-bold">{{ $t('depositPayment') }}</div>
                    </q-item-section>
                    <q-item-section>
                        <q-scroll-area style="width: 100%;height: 90px">
                            <div class="row justify-end q-gutter-sm q-py-md" style="height: 90px">
                                <div v-for="(payment, paymentIndex) in paymentList" :key="paymentIndex"
                                     @click="currentPayment = payment; params.id = payment.id"
                                     class="text-center" :style="{opacity: payment.id === currentPayment.id ? 1 : 0.3}">
                                    <q-img no-spinner :src="imageSrc(payment.icon)" width="50px" height="50px">
                                    </q-img>
                                    <div class="text-caption ellipsis">{{ payment.name }}</div>
                                </div>
                            </div>
                        </q-scroll-area>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar>
                        <div class="text-body1 text-bold">{{ $t('depositAmount') }}</div>
                    </q-item-section>
                    <q-item-section>
                        <q-input borderless input-class="text-right text-body1 q-mr-md" type="number"
                                 :placeholder="$t('pleaseEnterDepositAmount')"
                                 v-model.number="params.amount"></q-input>
                    </q-item-section>
                </q-item>

                <q-item v-if="currentPayment.type !== 20">
                    <q-item-section avatar>
                        <div class="text-body1 text-bold">{{ $t('depositProof') }}</div>
                    </q-item-section>
                    <q-item-section>
                        <q-uploader flat style='width: 100%;' auto-upload
                                    :url='baseURL + "/upload"' field-name='file'
                                    accept='.jpg,.png,image/*'
                                    @uploaded='(info) => {params.proof = JSON.parse(info.xhr.response).data}'
                                    :headers="[{name: 'Token', value: $store.state.user.token}, {name: 'Token-Key', value: $store.state.user.tokenKey}]">
                            <template v-slot:header></template>
                            <template v-slot:list='scope'>
                                <div @click='scope.pickFiles' class="row justify-end no-padding">
                                    <q-uploader-add-trigger/>
                                    <q-icon name="sym_o_add_photo_alternate" color="grey" size="60px"
                                            v-if="params.proof === ''"></q-icon>
                                    <q-img no-spinner :src="imageSrc(params.proof)" v-else></q-img>
                                </div>
                            </template>
                        </q-uploader>
                    </q-item-section>
                </q-item>
            </q-list>

            <div class="q-mt-md" v-if="appConfig.hasOwnProperty('finance_deposit_tip')"
                 v-html="$t(appConfig['finance_deposit_tip'])"></div>
            <q-btn class="full-width bg-primary text-white q-mt-lg" size="lg" :label="$t('submit')"
                   @click="submitFunc"></q-btn>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {WalletDepositInfoAPI, WalletDepositAPI} from 'src/api/wallet';
import {copyToClipboard} from 'quasar'
import {negativeNotify, positiveNotify} from 'src/utils'
import {useI18n} from 'vue-i18n';
import {imageSrc} from 'src/utils';
import Router from 'src/router'
import store from 'src/store'

export default {
    name: 'WalletDeposit',
    components: {backtrack},
    setup() {
        const $i18n = useI18n()
        const state = reactive({
            appConfig: store.state.prefetch.config,
            baseURL: process.env.baseURL,
            paymentList: [] as any,
            currentPayment: {} as any,
            params: {
                id: 0,
                amount: '',
                proof: ''
            }
        })

        // 初始化数据
        onMounted(() => {
            WalletDepositInfoAPI().then((res: any) => {
                state.paymentList = res
                state.currentPayment = res[0]
                state.params.id = state.currentPayment.id
            })
        })

        // 提交充值
        const submitFunc = () => {
            WalletDepositAPI(state.params).then((res: any) => {
                if (res.url !== '') {
                    window.location.href = res.url
                } else {
                    Router.push({name: 'WalletIndex'})
                }
            })
        }

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
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
