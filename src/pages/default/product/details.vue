<template>
    <div>
        <backtrack :title="info.name"></backtrack>

        <div v-if="info.hasOwnProperty('id')">
            <q-card flat style="border-radius: 0">
                <q-carousel animated v-model='carousel' navigation-position='right' thumbnails infinite
                            style='height: 500px'>
                    <q-carousel-slide :name='parseInt(bannerIndex)'
                                      :img-src='imageSrc(banner.value)'
                                      v-for='(banner, bannerIndex) in info.images' :key='bannerIndex'>
                    </q-carousel-slide>
                </q-carousel>
                <q-card-section>
                    <div>
                        <div class="text-body1 ellipsis-2-lines">{{ info.name }}</div>
                        <div class="row justify-between q-mt-sm">
                            <div>
                                <div class="text-body2 text-grey">{{ $t('cycle') }}:{{ info.data.expire }}{{
                                        $t('day')
                                    }}
                                </div>
                                <div class="text-body1 text-green text-weight-bold">
                                    {{ $t('price') }}:{{ info.money.toFixed(2) }}
                                </div>
                            </div>
                            <div class="text-body1">{{ info.data.interval }}h<span
                                class="text-red q-ml-md text-h6">+{{ info.data.returns.toFixed(2) }}%</span></div>
                        </div>
                    </div>
                </q-card-section>
                <q-card-section>
                    <div v-html="info.describes"></div>
                    <div style="height: 60px"></div>
                </q-card-section>
            </q-card>
            <div class="fixed-bottom bg-primary">
                <div class="q-ma-md row justify-between items-center">
                    <div class="text-white">
                        <div class="text-body2">{{ $t('cycle') }}:{{ info.data.expire }}{{ $t('day') }}</div>
                        <div class="text-body1 text-weight-bold">{{ $t('price') }}:{{ info.money.toFixed(2) }}</div>
                    </div>
                    <div>
                        <q-btn flat :label="$t('userBuyProduct')" size="md" class="bg-white text-black"
                               @click="submitFunc"></q-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {imageSrc, positiveNotify} from 'src/utils';
import {ProductDetailsAPI, ProductCreateAPI} from 'src/api/product';
import backtrack from 'components/backtrack.vue';
import Router from 'src/router'
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';

export default {
    name: 'ProductDetails',
    components: {backtrack},
    setup() {
        const $q = useQuasar()
        const $i18n = useI18n()
        const state = reactive({
            carousel: 0,
            info: {} as any,
            params: {
                id: Router.currentRoute.value.query.id ? parseInt(Router.currentRoute.value.query.id.toString()) : 0
            }
        })

        onMounted(() => {
            ProductDetailsAPI(state.params).then((res: any) => {
                state.info = res
            }).catch(() => {
                Router.back()
            })
        })

        // 提交购买
        const submitFunc = () => {
            $q.dialog({
                html: true,
                message: '<div class="text-body1">' + $i18n.t('confirmCost') + '<span class="text-red">' + state.info.money + '</span>' + $i18n.t('userBuyProduct') + '【' + state.info.name + '】</div>',
                cancel: $i18n.t('cancel'),
                ok: $i18n.t('userBuyProduct')
            }).onOk(() => {
                ProductCreateAPI(state.params).then(() => {
                    positiveNotify($i18n.t('successfulPurchase'))
                    setTimeout(() => {
                        Router.push({name: 'ProductOrder'})
                    }, 1500)
                })
            });
        }

        return {
            imageSrc,
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
