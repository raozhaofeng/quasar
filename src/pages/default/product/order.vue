<template>
    <div class="q-pa-md" v-if="isShow">
        <q-banner dense class="bg-red-5" v-if="orderList.length === 0">
            <template v-slot:avatar>
                <q-icon name="sym_o_warning" color="white" size="md"/>
            </template>
            <div class="text-body1 text-weight-bold text-white">{{ $t('noProduct') }}</div>
            <template v-slot:action>
                <q-btn flat color="white" @click="$router.push({name: 'Product'})" :label="$t('goto')"/>
            </template>
        </q-banner>

        <q-card flat class="q-mb-md" v-for="(order, orderIndex) in orderList" :key="orderIndex">
            <q-card-section>
                <q-card-section class="no-padding">
                    <div class="row justify-between items-center q-my-sm text-body1">
                        <div class="text-grey">{{$t('orderSn')}} {{ order.order_sn }}</div>
                        <div class="text-accent">{{$t('surplus')}}
                            {{ parseInt(((order.expired_at - order.now_time) / 86400).toString()) + 1 }}{{ $t('day') }}
                        </div>
                    </div>
                </q-card-section>
                <div class="row">
                    <div class="col-5">
                        <q-img no-spinner :src="imageSrc(order.product.images[0].value)" height="120px"
                               width="120px"></q-img>
                    </div>
                    <div class="col-7">
                        <div class="ellipsis-2-lines text-body1 text-bold">{{
                                order.product.name
                            }}
                        </div>
                        <div class="text-right">
                            <div class="q-mt-sm text-secondary text-body1 text-bold">
                                {{(order.money*order.nums).toFixed(2)}}
                                <span class="text-grey text-body2 q-ml-sm">{{$t('price')}}</span>
                            </div>
                            <div class="text-red text-h6">
                                <span class="text-body2 text-grey">{{ order.data.interval }}h</span>
                                {{ order.data.returns.toFixed(2) }}%
                                <span class="text-grey text-body2 q-ml-sm">{{$t('interestRate')}}</span>
                            </div>
                            <div class="text-body2 text-grey">
                                {{ date.formatDate(order.created_at * 1000, 'MM/DD HH:mm:ss') }}
                                <span class="text-grey text-body2 q-ml-sm">{{$t('date')}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <div v-if="(order.updated_at - order.now_time) > 0">
                    <div class="q-mb-sm text-body2 text-grey">
                        {{$t('commissionProgress')}}
                        ({{ ((1-((order.updated_at - order.now_time) / (order.data.interval * 3600)))*100).toFixed(2) }}%)
                    </div>
                    <q-linear-progress dark rounded indeterminate color="secondary" class="q-mt-sm"/>
                    <q-linear-progress dark query color="primary" class="q-mt-sm"/>
                </div>
                <div v-else>
                    <div class="text-right">
                        <q-btn :label="$t('receiveCommission')" flat class="bg-red text-white" @click="earningsFunc(order)"></q-btn>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {imageSrc, positiveNotify} from 'src/utils'
import {ProductOrderAPI, ProductEarningsAPI} from 'src/api/product'
import {date} from 'quasar';
import {useI18n} from 'vue-i18n';

export default {
    name: 'IndexOrder',
    setup() {
        const $i18n = useI18n()
        const state = reactive({
            isShow: false,
            orderList: [] as any,
        })

        onMounted(() => {
            productOrderFunc()
        })

        // 请求订单数据
        const productOrderFunc = () => {
            ProductOrderAPI().then((res: any) => {
                state.orderList = res
                state.isShow = true
            })
        }

        // 领取收益方法
        const earningsFunc = (order: any) => {
            ProductEarningsAPI({id: order.id}).then(() => {
                productOrderFunc()
                positiveNotify($i18n.t('receivedSuccessfully'))
            })
        }

        return {
            date,
            imageSrc,
            earningsFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
