<template>
    <div>
        <backtrack :title="$t('withdrawalAccount')"></backtrack>

        <div class="q-ma-md">
            <q-card flat bordered class="text-white q-mt-md" :class="'bg-' + colorIndex(accountIndex)"
                    style="border-radius: 8px"
                    v-for="(account, accountIndex) in accountList" :key="accountIndex">
                <q-card-section>
                    <div class="row justify-between">
                        <div class="row justify-start items-center">
                            <div>
                                <q-avatar size="60px" color="white">
                                    <img :src="imageSrc(account.payment_icon)"/>
                                </q-avatar>
                            </div>
                            <div class="q-ml-sm">
                                <div class="text-body1">{{ account.name }}</div>
                                <div class="text-body2 q-mt-xs">{{ account.real_name }}</div>
                            </div>
                        </div>
                        <div class="row q-gutter-xs">
                            <div class="text-body2"
                                 v-if="templateSetting.hasOwnProperty('template_wallet') && templateSetting['template_wallet']['update']">
                                <div @click="showAccountDialogFunc('update', account)">{{$t('edit')}}</div>
                            </div>
                            <div class="text-body2 q-ml-sm"
                                 v-if="templateSetting.hasOwnProperty('template_wallet') && templateSetting['template_wallet']['delete']">
                                <div @click="deleteAccountFunc(account)">{{$t('delete')}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="text-right text-body1">**** **** ****
                        {{ account.card_number.substring(account.card_number.length - 4) }}
                    </div>
                </q-card-section>
            </q-card>
        </div>


        <div class="fixed-bottom-right q-ma-md">
            <q-fab v-model="fabShow" vertical-actions-align="right" color="primary" glossy icon="keyboard_arrow_up"
                   direction="up" :label="$t('create')" label-class="text-body1" label-position="left">
                <q-fab-action label-position="left" :icon="'img:' + imageSrc(payment.icon)" :label="payment.name"
                              :color="colorIndex(paymentIndex)" @click="showAccountDialogFunc('create', payment)"
                              v-for="(payment, paymentIndex) in paymentList" :key="paymentIndex"/>
            </q-fab>
        </div>

        <q-dialog full-width v-model="securityKeyDialogShow" persistent>
            <q-card>
                <q-card-section>
                    <div class="text-h6">
                        <div>{{$t('securityPassword')}}</div>
                    </div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input type="password" autofocus v-model="params.security_key"></q-input>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat :label="$t('cancel')" v-close-popup/>
                    <q-btn flat :label="$t('submit')" @click="submitSecurityKeyFunc"/>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog full-width v-model="accountDialogShow" persistent>
            <q-card>
                <q-card-section>
                    <div class="text-h6">
                        <div>{{$t('withdrawalAccount')}}</div>
                    </div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="q-gutter-md">
                        <q-input input-class="text-body1 q-mr-md"
                                 :label="accountType === 1 ? $t('bankName') : $t('chainName')"
                                 v-model="params.name"></q-input>

                        <q-input input-class="text-body1 q-mr-md"
                                 :label="accountType === 1 ? $t('realName') : $t('tokenName')"
                                 v-model="params.real_name"></q-input>

                        <q-input input-class="text-body1 q-mr-md"
                                 :label="accountType === 1 ? $t('bankCardNumber') : $t('tokenAddress')"
                                 v-model="params.card_number"></q-input>

                        <q-input input-class="text-body1 q-mr-md" :label="$t('bankAddress')"
                                 v-if="accountType === 1"
                                 v-model="params.address"></q-input>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat :label="$t('cancel')" v-close-popup/>
                    <q-btn flat :label="$t('submit')" v-if="accountDialogOptStr === 'update'" @click="updateAccountFunc"/>
                    <q-btn flat :label="$t('submit')" v-else @click="submitFunc"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {imageSrc} from 'src/utils';
import {colorIndex} from 'src/utils/colors';
import store from 'src/store'
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';
import {
    WalletWithdrawInfoAPI,
    WalletAccountIndexAPI,
    WalletAccountAPI,
    WalletAccountUpdateAPI,
    WalletAccountDeleteAPI
} from 'src/api/wallet';

export default {
    name: 'WalletAccount',
    components: {backtrack},
    setup() {
        const $q = useQuasar()
        const $i18n = useI18n()
        const state = reactive({
            templateSetting: JSON.parse(JSON.stringify(store.state.prefetch.template)),
            paymentList: [] as any,
            accountList: [] as any,
            fabShow: false,
            accountDialogShow: false,
            securityKeyDialogShow: false,
            accountDialogOptStr: '',
            accountType: 0,
            params: {} as any
        })

        onMounted(() => {
            accountIndexFunc()
            WalletWithdrawInfoAPI().then((res: any) => {
                state.paymentList = res
            })
        })

        // 请求账户列表
        const accountIndexFunc = () => {
            WalletAccountIndexAPI().then((res: any) => {
                state.accountList = res
            })
        }

        // 弹出新增｜更新 表单
        const showAccountDialogFunc = (opt: string, params: any) => {
            state.accountDialogOptStr = opt
            switch (opt) {
                case 'create':
                    state.accountType = params.type
                    state.params = {id: params.id, name: params.name, real_name: params.account_name}
                    break
                case 'update':
                    state.params = {id: params.id, name: params.name, real_name: params.real_name}
                    state.accountType = params.payment_type
                    if (params.payment_type === 1) {
                        state.params.address = params.address
                    }
                    break
            }
            state.accountDialogShow = true
        }

        // 删除钱包账户
        const deleteAccountFunc = (account: any) => {
            state.params = {id: account.id}
            state.accountDialogOptStr = 'delete'

            if (state.templateSetting['template_wallet']['security_key']) {
                state.securityKeyDialogShow = true
            } else {
                $q.dialog({
                    message: $i18n.t('whetherToDeleteOperation'),
                    cancel: $i18n.t('cancel'),
                    ok: $i18n.t('submit')
                }).onOk(() => {
                    submitFunc()
                });
            }
        }

        // 更新钱包账户
        const updateAccountFunc = () => {
            state.accountDialogShow = false
            if (state.templateSetting['template_wallet']['security_key']) {
                state.securityKeyDialogShow = true
            } else {
                submitFunc()
            }
        }

        // 提交安全密钥
        const submitSecurityKeyFunc = () => {
            submitFunc()
        }

        // 提交 新增｜更新表单
        const submitFunc = () => {
            state.securityKeyDialogShow = false
            switch (state.accountDialogOptStr) {
                case 'create':
                    WalletAccountAPI(state.params).then(() => {
                        accountIndexFunc()
                        state.accountDialogShow = false
                    })
                    break
                case 'update':
                    WalletAccountUpdateAPI(state.params).then(() => {
                        accountIndexFunc()
                        state.accountDialogShow = false
                    })
                    break
                case 'delete':
                    WalletAccountDeleteAPI(state.params).then(() => {
                        accountIndexFunc()
                    })
            }
        }

        return {
            imageSrc,
            colorIndex,
            deleteAccountFunc,
            updateAccountFunc,
            showAccountDialogFunc,
            submitSecurityKeyFunc,
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
