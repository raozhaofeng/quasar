<template>
    <div>
        <backtrack :title="$t('accountWallet')"></backtrack>

        <div class="q-ma-md">
            <div class="q-pa-md text-white"
                 :style="{background: 'linear-gradient('+primaryColorHex+', '+secondaryColorHex+')', borderRadius: '8px'}">
                <div class="row justify-end q-gutter-sm">
                    <div class="text-body2" @click="$router.push({name: 'UserBill'})">{{ $t('bill') }}</div>
                </div>
                <div class="q-mt-sm">
                    <div class="text-body2 text-weight-medium">{{ $t('balance') }}</div>
                    <div class="text-h4 q-mt-sm">{{ userInfo.money.toFixed(2) }} <span
                        class="text-body1 q-ml-xs">{{ userInfo.freeze_money.toFixed(2) }}</span></div>
                </div>
                <div class="row justify-end q-gutter-sm q-mt-sm">
                    <q-btn rounded outline :label="$t('depositLabel')" size="sm"
                           @click="$router.push({name: 'WalletDeposit'})"></q-btn>
                    <q-btn rounded outline :label="$t('withdrawLabel')" size="sm"
                           @click="$router.push({name: 'WalletWithdraw'})"></q-btn>
                </div>
            </div>

            <q-card flat class="q-mt-lg no-padding" bordered>
                <q-card-section>
                    <div :style="{borderLeft: secondaryColorHex + ' 3px solid'}" class="q-pa-xs">
                        <span class="q-ml-sm text-body1 text-weight-bolder">{{ $t('latestNews') }}</span>
                    </div>
                </q-card-section>
                <q-card-section class="no-padding">
                    <q-list separator>
                        <q-item v-if="recordList.length === 0">
                            <q-item-section class="q-my-lg">
                                <div class="text-center text-body1">{{ $t('noData') }}</div>
                            </q-item-section>
                        </q-item>
                        <q-item v-for="(record, recordIndex) in recordList" :key="recordIndex">
                            <q-item-section avatar class="q-py-sm">
                                <q-icon name="sym_o_currency_exchange" size="38px" color="secondary"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                <div class="text-body1 text-weight-medium">{{ record.name }}</div>
                                <div class="text-caption q-mt-xs full-width">
                                    <div v-if="record.status === 20" class="text-green">{{ $t('orderCompleted') }}</div>
                                    <div v-else-if="record.status === -1" class="text-red ellipsis">{{ record.data }}</div>
                                    <div v-else class="text-primary">{{ $t('orderPending') }}</div>
                                </div>
                            </q-item-section>
                            <q-item-section side>
                                <div class="text-body1 text-bold text-secondary">{{ record.money.toFixed(2) }}</div>
                                <div class="q-mt-xs">{{
                                        date.formatDate(record.created_at * 1000, 'MM/DD HH:mm')
                                    }}
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {colors} from 'quasar'
import store from 'src/store'
import backtrack from 'components/backtrack.vue';
import {date} from 'quasar';
import {WalletIndexAPI} from 'src/api/wallet';

export default {
    name: 'WalletIndex',
    components: {backtrack},
    setup() {
        const {getPaletteColor} = colors

        const state = reactive({
            userInfo: store.state.user.info,
            primaryColorHex: getPaletteColor('primary'),
            secondaryColorHex: getPaletteColor('secondary'),
            recordList: [] as any
        })

        onMounted(() => {
            WalletIndexAPI().then((res: any) => {
                state.recordList = res
            })
        })

        return {
            date,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
