<template>
    <div>
        <backtrack :title="$t('fundingDetails')"></backtrack>

        <div class="q-ma-md">
            <q-card flat bordered class="bg-white" v-if="billList.length > 0">
                <q-item v-for="(bill, billIndex) in billList" :key="billIndex">
                    <q-item-section avatar class="q-py-sm">
                        <q-icon name="sym_o_assignment" size="38px" color="secondary"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-body1">{{bill.source_username !== '' ? '【' +bill.source_username + '】' : ''}} {{ bill.name }}</div>
                        <div class="text-caption">{{ date.formatDate(bill.created_at * 1000, 'MM/DD HH:mm') }}</div>
                    </q-item-section>
                    <q-item-section side>
                        <div class="text-h6 text-red" v-if="bill.type === 2 || bill.type === 4 || bill.type === 10 || bill.type === 11 || bill.type === 20">
                            -{{ bill.money.toFixed(2) }}
                        </div>
                        <div class="text-h6 text-green" v-else>+{{ bill.money.toFixed(2) }}</div>
                    </q-item-section>
                </q-item>
            </q-card>
            <q-card v-else flat bordered>
                <q-card-section>
                    <div class="text-center b-py-xl">{{ $t('noData') }}</div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {UserBillAPI} from 'src/api/user';
import {date} from 'quasar';

export default {
    name: 'UserBill',
    components: {backtrack},
    setup() {
        const state = reactive({
            billList: [] as any
        })

        onMounted(() => {
            UserBillAPI().then((res: any) => {
                state.billList = res
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
