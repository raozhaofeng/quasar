<template>
    <div>
        <q-carousel animated v-model="carousel" infinite :autoplay="true" arrows style="height: 200px" v-if="bannerList.length > 0">
            <q-carousel-slide :name="bannerIndex" :img-src="imageSrc(banner.value)"
                              v-for="(banner, bannerIndex) in bannerList"
                              :key="bannerIndex"/>
        </q-carousel>

        <div class="q-ma-md" v-if="introduce !== ''">
            <q-card flat>
                <q-card-section>
                    <div v-html="introduce"></div>
                </q-card-section>
            </q-card>
        </div>

        <!--        滚屏效果-->
        <div class="q-ma-md" style="border-radius: 8px;" v-if="winningNewsList.length > 0">
            <q-carousel v-model="winningCarousel" height="200px" vertical swipeable infinite :autoplay="true" animated
                        transition-prev="slide-down" transition-next="slide-up">
                <q-carousel-slide :name="newsIndex" v-for="(news, newsIndex) in winningNewsList" :key="newsIndex">
                    <q-item v-for="(winning, winningIndex) in news" :key="winningIndex" class="no-padding q-my-sm">
                        <q-item-section avatar>
                            <q-avatar size="38px">
                                <q-img no-spinner :src="imageSrc(winning.avatar)" width="38px" height="38px"></q-img>
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <div class="text-body1">{{ winning.username }}</div>
                            <div class="text-body2 text-grey">{{ $t(winning.message) }}</div>
                        </q-item-section>
                        <q-item-section side>
                            <div class="text-body1 text-red text-weight-medium">{{ winning.money.toFixed(2) }}</div>
                        </q-item-section>
                    </q-item>
                </q-carousel-slide>
            </q-carousel>
        </div>

        <!--        推荐分类-->
        <div v-if="categoryList.length > 0" class="q-ma-md q-pt-md">
            <div class="row justify-start items-center q-mb-sm">
                <div class="q-mr-xs">
                    <q-icon name="sym_o_local_fire_department" color="red" size="sm"></q-icon>
                </div>
                <div class="text-body1 text-weight-bold">{{ $t('recommendCategory') }}</div>
            </div>
            <div class="row">
                <div class="col-6 q-mb-md" v-for="(category, categoryIndex) in categoryList" :key="categoryIndex">
                    <q-card flat :class="categoryIndex%2 ? 'q-ml-sm' : 'q-mr-sm'"
                            @click="$router.push({name: 'Product', query: {category_id: category.id}})">
                        <q-img no-spinner :src="imageSrc(category.image)" height="200px"></q-img>
                        <div class="q-pa-sm text-body1 ellipsis">{{ category.name }}</div>
                    </q-card>
                </div>
            </div>
        </div>

        <!--        推荐产品-->
        <div v-if="productList.length > 0" class="q-ma-md">
            <div class="row justify-start items-center q-mb-sm">
                <div class="q-mr-xs">
                    <q-icon name="sym_o_local_fire_department" color="red" size="sm"></q-icon>
                </div>
                <div class="text-body1 text-weight-bold">{{ $t('recommendProduct') }}</div>
            </div>
            <div class="row">
                <div class="col-6 q-mb-md" v-for="(product, productIndex) in productList" :key="productIndex">
                    <q-card flat :class="productIndex%2 ? 'q-ml-sm' : 'q-mr-sm'"
                            @click="$router.push({name: 'ProductDetails', query: {id: product.id}})">
                        <q-img no-spinner :src="imageSrc(JSON.parse(product.images)[0].value)" height="200px">
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

        <!--        公告弹窗-->
        <q-dialog v-model="announcementModel" full-width transition-show="rotate" transition-hide="rotate">
            <q-card>
                <q-card-section>
                    <div class="text-h6">{{ $t('systemNotification') }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div v-html="announcement"></div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('sure')" color="primary" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {imageSrc} from 'src/utils';
import {IndexAPI} from 'src/api';

export default {
    name: 'IndexHome',
    setup() {
        const state = reactive({
            bannerList: [] as any,
            introduce: '',
            announcement: '',
            winningsAmount: '' as any,
            carousel: 0,
            announcementModel: false,
            winningNewsList: [] as any,
            winningCarousel: 0,
            categoryList: [] as any,
            productList: [] as any,
        })

        onMounted(() => {
            IndexAPI().then((res: any) => {
                state.bannerList = JSON.parse(res.banner)
                state.introduce = res.introduce
                state.announcement = res.announcement
                state.winningsAmount = res.winnings_amount
                state.categoryList = res.category_list
                state.productList = res.product_list

                // 判断是否弹窗
                if (state.announcement !== '') {
                    state.announcementModel = true
                }

                // 生成中奖信息
                const nowTime = Date.parse(new Date().toDateString()) / 1000
                let winningNews = [] as any
                if (state.winningsAmount.min > 0 && state.winningsAmount.max > 0) {
                    for (let i = 1; i <= 30; i++) {
                        winningNews.push({
                            avatar: '/assets/images/avatar/' + Math.floor(Math.random() * 21) + '.jpeg',
                            username: '****' + (Math.floor(Math.random() * (9999 - 1000)) + 1000),
                            message: 'winningMessage' + Math.floor(Math.random() * 5),
                            money: Math.floor(Math.random() * (state.winningsAmount.max - state.winningsAmount.min)) + state.winningsAmount.min,
                            created_at: nowTime - (i * (Math.floor(Math.random() * (1000 - 800)) + 800))
                        })
                        if (i % 3 == 0) {
                            state.winningNewsList.push(winningNews)
                            winningNews = [] as any
                        }
                    }
                }
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
