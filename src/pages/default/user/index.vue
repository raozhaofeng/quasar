<template>
    <div>
        <div class="text-white q-px-md q-pb-md"
             :style="{background: 'linear-gradient('+primaryColorHex+', '+secondaryColorHex+')'}">
            <div style="height: 60px;line-height: 60px" class="text-right">
                <q-icon name="sym_o_settings" color="white" size="sm"
                        @click="$router.push({name: 'UserSetting'})"></q-icon>
            </div>
            <div class="row justify-between">
                <div class="row items-center">
                    <q-avatar size='60px' class="bg-white">
                        <img :src='imageSrc(userInfo.avatar)'/>
                    </q-avatar>
                    <div class="q-ml-md">
                        <div class="text-h5 text-bold">{{ userInfo.username }}</div>
                        <div class="text-body1 q-mb-xs">
                            {{ userInfo.nickname === '' ? $t('nickname') : userInfo.nickname }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row q-mt-sm q-gutter-md">
                <div class="text-center">
                    <div class="text-body1 text-bold">{{ userInfo.money.toFixed(2) }}</div>
                    <div class="text-body2">{{ $t('balance') }}</div>
                </div>
                <div class="text-center">
                    <div class="text-body1 text-bold">{{ userInfo.freeze_money.toFixed(2) }}</div>
                    <div class="text-body2">{{ $t('freezeAmount') }}</div>
                </div>
            </div>
        </div>

        <div class="q-ma-md">
            <div class="row items-center q-py-md bg-white"
                 style="border-radius: 8px;border: 1px solid rgba(0, 0, 0, 0.12)">
                <div class="col text-center" @click="$router.push({name: 'WalletDeposit'})">
                    <div>
                        <q-icon name="sym_o_payments" size="lg" color="secondary"></q-icon>
                    </div>
                    <div class="q-mt-sm text-body1">
                        {{ $t('depositLabel') }}
                    </div>
                </div>
                <div class="col text-center" @click="$router.push({name: 'WalletWithdraw'})">
                    <div>
                        <q-icon name="sym_o_account_balance" size="lg" color="secondary"></q-icon>
                    </div>
                    <div class="q-mt-sm text-body1">
                        {{ $t('withdrawLabel') }}
                    </div>
                </div>
                <div class="col text-center" @click="$router.push({name: 'Download'})">
                    <div>
                        <q-icon name="sym_o_cloud_download" size="lg" color="secondary"></q-icon>
                    </div>
                    <div class="q-mt-sm text-body1">{{ $t('downloadApp') }}</div>
                </div>
            </div>

            <q-list bordered separator class="bg-white q-mt-md" style="border-radius: 8px">
                <q-item clickable @click="routerToVerifyFunc" v-if="templateSetting['template_wallet']['withdraw_verify']">
                    <q-item-section avatar>
                        <q-icon name="sym_o_frame_person" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('certification') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn class="no-padding" flat :ripple="false">
                            <div class="text-red" v-if="userInfo.verify === 0">({{ $t('unverified') }})</div>
                            <div class="text-primary" v-else-if="userInfo.verify === 10">({{ $t('submitted') }})</div>
                            <div class="text-red" v-else-if="userInfo.verify === -1">({{
                                    $t('realNameVerify')
                                }})
                            </div>
                            <div class="text-green" v-else>({{ $t('verified') }})</div>
                            <q-icon name="sym_o_chevron_right"></q-icon>
                        </q-btn>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'UserBill'})">
                    <q-item-section avatar>
                        <q-icon name="sym_o_request_quote" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('fundingDetails') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'WalletAccount'})">
                    <q-item-section avatar>
                        <q-icon name="sym_o_account_balance_wallet" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('withdrawalAccount') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'WalletIndex'})">
                    <q-item-section avatar>
                        <q-icon name="sym_o_wallet" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('accountWallet') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
            </q-list>

            <q-list bordered separator class="bg-white q-mt-md" style="border-radius: 8px">
                <q-item clickable @click="$router.push({name: 'UserTeam'})">
                    <q-item-section avatar>
                        <q-icon name="sym_o_diversity_3" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('myTeam') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push({name: 'UserLevel'})" v-if="appConfig['show_vip']">
                    <q-item-section avatar>
                        <q-icon name="sym_o_diamond" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('myVip') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push({name: 'UserInvite'})">
                    <q-item-section avatar>
                        <q-icon name="sym_o_share" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('inviteFriends') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>

                <q-item clickable @click="LogoutAPI">
                    <q-item-section avatar>
                        <q-icon name="sym_o_logout" size="md" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{ $t('signOut') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import store from 'src/store'
import {imageSrc} from 'src/utils';
import {colors} from 'quasar'
import {LogoutAPI} from 'src/api';
import {UserInfoAPI} from 'src/api/user';
import Router from 'src/router';

export default {
    name: 'UserIndex',
    setup() {
        const {getPaletteColor} = colors
        const state = reactive({
            appConfig: JSON.parse(JSON.stringify(store.state.prefetch.config)),
            templateSetting: JSON.parse(JSON.stringify(store.state.prefetch.template)),
            primaryColorHex: getPaletteColor('primary'),
            secondaryColorHex: getPaletteColor('secondary'),
            userInfo: JSON.parse(JSON.stringify(store.state.user.info))
        })

        onMounted(() => {
            UserInfoAPI().then((res: any) => {
                store.commit('user/updateInfo', res)
            })
        })

        // 是否跳转到验证页面
        const routerToVerifyFunc = () => {
            Router.push({name: 'UserVerify'})
        }

        return {
            imageSrc,
            LogoutAPI,
            routerToVerifyFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
