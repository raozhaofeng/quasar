<template>
    <div class="q-pa-md">
        <div class="row">
            <div class="col-6 q-mb-md" v-for="(product, productIndex) in productList" :key="productIndex">
                <q-card flat :class="productIndex%2 ? 'q-ml-sm' : 'q-mr-sm'"
                        @click="$router.push({name: 'ProductDetails', query: {id: product.id}})">
                    <q-img no-spinner :src="imageSrc(JSON.parse(product.images)[0].value)" height="200px">
                        <q-badge color="red" style="padding: 8px 8px 4px 8px" transparent floating v-if="product.nums > 0">{{$t('purchaseLimit')}}【{{product.nums}}】</q-badge>
                        <div class="absolute-bottom text-right" style="padding: 4px; background: rgba(0, 0, 0, 0.3)" v-if="product.used >= product.total">
                            <span class="q-mr-xs text-body2">{{$t('soldOut')}}</span>
                        </div>
                    </q-img>
                    <q-card-section>
                        <div class="text-body2 ellipsis">{{ product.name }}</div>
                        <div class="row justify-between items-center">
                            <div class="text-body2 text-green text-weight-bold">{{ product.money.toFixed(2) }}</div>
                            <div class="text-body2 text-grey">{{ product.data.expire }}{{ $t('day') }}</div>
                        </div>
                        <div class="text-body2 text-weight-bold text-right">{{ product.data.interval }}h<span
                            class="text-red text-weight-bold text-body1 q-ml-sm">+{{ product.data.returns.toFixed(2) }}%</span></div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {ProductIndexAPI} from 'src/api/product';
import Router from 'src/router'
import {imageSrc} from 'src/utils';

export default {
    name: 'IndexShop',
    setup() {
        const state = reactive({
            productList: [] as any,
            params: {
                category_id: Router.currentRoute.value.query.category_id ? parseInt(Router.currentRoute.value.query.category_id.toString()) : 0,
            }
        })

        onMounted(() => {
            ProductIndexAPI(state.params).then((res: any) => {
                state.productList = res
            })
        })

        return {
            imageSrc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
