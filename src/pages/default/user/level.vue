<template>
    <div>
        <backtrack :title="$t('myVip')"></backtrack>

        <div class="q-ma-sm">
            <div class="row items-center text-center">
                <div class="col-4" v-for="(level, levelIndex) in levelList" :key="levelIndex">
                    <q-card flat bordered class="q-ma-sm"
                            @click="currentLevel = level; params.id = level.id"
                            :class="level.id === currentLevel.id ? 'bg-primary text-white' : 'bg-grey-3 text-red'">
                        <q-card-section class="q-pa-sm">
                            <q-img no-spinner :src="imageSrc(level.icon)" width="60px"></q-img>
                            <div class="text-body2">{{ level.name }}</div>
                            <div class="text-body1 text-bold">{{ level.money.toFixed(2) }}</div>
                        </q-card-section>
                        <q-badge :color="level.id === currentLevel.id ? 'red' : 'grey-5'" floating class="text-caption">
                            {{level.days > 0 ? level.days + $t('day') : $t('permanent')}}
                        </q-badge>
                    </q-card>
                </div>
            </div>

            <q-card flat class="q-mt-lg no-padding" bordered v-if="currentLevel.data !== ''">
                <q-card-section>
                    <div v-html="currentLevel.data"></div>
                </q-card-section>
            </q-card>
        </div>

        <div class="fixed-bottom">
            <q-card flat class="bg-primary text-white">
                <q-card-section>
                    <div class="row justify-between items-center">
                        <div class="row items-center">
                            <div>
                                <q-img no-spinner :src="imageSrc(currentLevel.icon)" width="50px"></q-img>
                            </div>
                            <div class="q-ml-sm">
                                <div class="text-body1">{{ currentLevel.name }}</div>
                                <div class="text-h6"
                                     v-if="userInfo.levelInfo.id === 0 && appConfig['buy_level_mode'] === 'premium'">
                                    {{
                                        (currentLevel.money - userInfo.levelInfo.money) > 0 ? (currentLevel.money - userInfo.levelInfo.money).toFixed(2) : 0.00
                                    }}
                                </div>
                                <div class="text-h6" v-else>{{ currentLevel.money.toFixed(2) }}</div>
                            </div>
                        </div>
                        <div>
                            <q-btn :label="userInfo.levelInfo.id === 0 ? $t('userBuyLevel') : $t('userUpgradeLevel')"
                                   @click="submitFunc" class="bg-white text-black"
                                   size="md"></q-btn>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {UserLevelListAPI, UserLevelAPI, UserInfoAPI} from 'src/api/user';
import {imageSrc} from 'src/utils';
import store from 'src/store'
import {positiveNotify} from 'src/utils';
import {useI18n} from 'vue-i18n';
import {useQuasar} from 'quasar';

export default {
    name: 'UserVip',
    components: {backtrack},
    setup() {
        const $q = useQuasar()
        const $i18n = useI18n()
        const state = reactive({
            appConfig: JSON.parse(JSON.stringify(store.state.prefetch.config)),
            currentLevel: {id: 0, name: '', icon: '', money: 0, data: ''} as any,
            userInfo: JSON.parse(JSON.stringify(store.state.user.info)),
            levelList: [] as any,
            params: {} as any
        })

        onMounted(() => {
            UserLevelListAPI().then((res: any) => {
                state.levelList = res
                if (state.levelList.length > 0) {
                    // 判断当前会员等级
                    if (state.userInfo.levelInfo.id === 0) {
                        state.currentLevel = state.levelList[0]
                        state.params.id = state.currentLevel.id
                    } else {
                        for (let i = 0; i < state.levelList.length; i++) {
                            if (state.levelList[i].id === state.userInfo.levelInfo.id) {
                                state.currentLevel = state.levelList[i]
                                state.params.id = state.currentLevel.id
                            }
                        }
                    }
                }
            })
        })

        // 提交
        const submitFunc = () => {
            let buyAmount = state.currentLevel.money.toFixed(2)
            if (state.userInfo.levelInfo.id > 0 && state.appConfig['buy_level_mode'] === 'premium') {
                let deductAmount = state.currentLevel.money - state.userInfo.levelInfo.money
                buyAmount = deductAmount > 0 ? deductAmount.toFixed(2) : 0.00
            }
            let buyName = state.userInfo.levelInfo.id === 0 ? $i18n.t('userBuyLevel') : $i18n.t('userUpgradeLevel')

            $q.dialog({
                html: true,
                message: '<div class="text-body1">' + $i18n.t('confirmCost') + ' <span class="text-red"> ' + buyAmount + '</span> ' + buyName + '【' + state.currentLevel.name + '】' + '</div>',
                cancel: $i18n.t('cancel'),
                ok: $i18n.t('submit')
            }).onOk(() => {
                UserLevelAPI(state.params).then(() => {
                    positiveNotify($i18n.t('successfulPurchase'))
                    // 更新用户信息
                    UserInfoAPI().then((res: any) => {
                        state.userInfo = res
                        store.commit('user/updateInfo', res)
                    })
                })
            });
        }

        return {
            submitFunc,
            imageSrc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
