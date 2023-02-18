<template>
    <div>
        <backtrack :title="$t('userWithdraw')"></backtrack>

        <div class="q-ma-md" v-if="isLoading">
            <div
                v-if="accountList.length === 0 || (templateSetting['template_wallet']['withdraw_verify'] && userInfo.verify !== 20)">
                <q-banner dense class="bg-red-5 q-mb-md" v-if="accountList.length === 0">
                    <template v-slot:avatar>
                        <q-icon name="sym_o_warning" color="white" size="md"/>
                    </template>
                    <div class="text-body1 text-weight-bold text-white">{{ $t('noWalletAccount') }}</div>
                    <template v-slot:action>
                        <q-btn flat color="white" @click="$router.push({name: 'WalletAccount'})" :label="$t('goto')"/>
                    </template>
                </q-banner>
                <q-banner dense class="bg-red-5"
                          v-if="templateSetting['template_wallet']['withdraw_verify'] && userInfo.verify !== 20">
                    <template v-slot:avatar>
                        <q-icon name="sym_o_warning" color="white" size="md"/>
                    </template>
                    <div class="text-body1 text-weight-bold text-white">{{ $t('noVerify') }}</div>
                    <template v-slot:action>
                        <q-btn flat color="white" @click="$router.push({name: 'UserVerify'})" :label="$t('goto')"/>
                    </template>
                </q-banner>
            </div>
            <div v-else>
                <q-list bordered style="border-radius: 8px;" class="bg-white q-mt-lg">
                    <q-item>
                        <q-item-section avatar>
                            <div class="text-body1 text-bold">{{ $t('withdrawPayment') }}</div>
                        </q-item-section>
                        <q-item-section>
                            <q-scroll-area style="width: 100%;height: 90px">
                                <div class="row justify-end q-gutter-sm q-py-md" style="height: 90px">
                                    <div v-for="(account, accountIndex) in accountList" :key="accountIndex"
                                         @click="currentAccount = account; params.id = account.id"
                                         class="text-center" :style="{opacity: account.id === account.id ? 1 : 0.3}">
                                        <q-img no-spinner :src="imageSrc(account.payment_icon)" width="50px"
                                               height="50px">
                                        </q-img>
                                        <div class="text-caption ellipsis">{{ account.name }}</div>
                                    </div>
                                </div>
                            </q-scroll-area>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <div class="text-body1 text-bold">{{ $t('balance') }}</div>
                        </q-item-section>
                        <q-item-section>
                            <div class="text-right text-body1">{{ userInfo.money.toFixed(2) }}</div>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <div class="text-body1 text-bold">{{ $t('withdrawAmount') }}</div>
                        </q-item-section>
                        <q-item-section>
                            <q-input borderless input-class="text-right text-body1 q-mr-md" type="number"
                                     :placeholder="$t('pleaseEnterWithdrawAmount')"
                                     v-model.number="params.amount"></q-input>
                        </q-item-section>
                    </q-item>
                </q-list>

                <div class="q-mt-md" v-if="tips !== ''"
                     v-html="tips"></div>
                <q-btn class="full-width bg-primary text-white q-mt-lg" size="lg" :label="$t('submit')"
                       @click="submitIsSecurityKeyFunc"></q-btn>
            </div>
        </div>

        <q-dialog full-width v-model="securityKeyDialogShow" persistent>
            <q-card>
                <q-card-section>
                    <div class="text-h6">
                        <div>{{ $t('securityPassword') }}</div>
                    </div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input type="password" autofocus v-model="params.security_key"></q-input>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat :label="$t('cancel')" v-close-popup/>
                    <q-btn flat :label="$t('submit')" @click="submitFunc"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {imageSrc} from 'src/utils';
import store from 'src/store'
import {WalletAccountIndexAPI, WalletWithdrawAPI} from 'src/api/wallet';
import Router from 'src/router';

export default {
    name: 'WalletWithdraw',
    components: {backtrack},
    setup() {
        const state = reactive({
            isLoading: false,
            tips: '',
            templateSetting: JSON.parse(JSON.stringify(store.state.prefetch.template)),
            securityKeyDialogShow: false,
            userInfo: JSON.parse(JSON.stringify(store.state.user.info)),
            currentAccount: {} as any,
            accountList: [] as any,
            params: {} as any
        })

        onMounted(() => {
            WalletAccountIndexAPI().then((res: any) => {
                state.isLoading = true
                state.accountList = res.items
                if (state.accountList.length > 0) {
                    state.tips = res.tips
                    state.currentAccount = state.accountList[0]
                    state.params.account_id = state.accountList[0].id
                }
            })
        })

        // 判断是否需要密钥
        const submitIsSecurityKeyFunc = () => {
            if (state.templateSetting['template_wallet']['withdraw_security_key']) {
                state.securityKeyDialogShow = true
            } else {
                submitFunc()
            }
        }

        // 提交提现
        const submitFunc = () => {
            state.securityKeyDialogShow = false
            WalletWithdrawAPI(state.params).then(() => {
                state.userInfo.money -= state.params.amount
                store.commit('user/updateInfo', state.userInfo)
                Router.back()
            })
        }

        return {
            imageSrc,
            submitFunc,
            submitIsSecurityKeyFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
