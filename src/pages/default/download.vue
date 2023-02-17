<template>
    <div class="q-pa-md">
        <div class="row justify-start">
            <div>
                <q-avatar rounded size="120px">
                    <q-img no-spinner :src="imageSrc(appConfig['site_logo'])" width="120px" height="120px"></q-img>
                </q-avatar>
            </div>
            <div class="col q-ml-sm">
                <div class="text-h6 text-weight-bold">{{ $t(appConfig['site_name']) }}</div>
                <div class="text-subtitle2 text-grey ellipsis">{{
                        $t('homeIntroduceText')
                    }}
                </div>
                <q-btn flat rounded :label="$t('freeInstall')" size="md" class="q-mt-md bg-primary text-white"
                       :disable="isDown"
                       @click="downFunc"></q-btn>
            </div>
        </div>

        <!--        评分功能-->
        <div class="row q-gutter-sm q-mt-md">
            <div class="col text-grey-7 text-center">
                <div>4098 {{ $t('score') }}</div>
                <div class="text-h5">4.9</div>
                <div>
                    <q-rating v-model="score" size="1em" color="grey-7" icon="star_border" icon-selected="star"
                              icon-half="star_half" readonly/>
                </div>
            </div>
            <div class="col text-grey-7 text-center">
                <div>{{ $t('age') }}</div>
                <div class="text-h5">4+</div>
                <div>
                    {{ $t('yearOld') }}
                </div>
            </div>
            <div class="col text-grey-7 text-center">
                <div>{{ $t('leaderboard') }}</div>
                <div class="text-h5"><span class="text-h6 text-bold">#</span>1</div>
                <div>
                    {{ $t('finance') }}
                </div>
            </div>
        </div>

        <!--        评分-->
        <div class="q-mt-md">
            <div class="text-h5 text-bold">{{ $t('ratingsAndReviews') }}</div>
            <div class="row justify-between q-mt-md items-center">
                <div class="text-center">
                    <div class="text-h2 text-weight-bold">4.9</div>
                    <div class="q-mt-sm text-body1">{{ $t('fullMarks') }}5{{ $t('marks') }}</div>
                </div>
                <div class="col text-right q-mr-md" style="line-height: 12px">
                    <div>
                        <div class="row items-center">
                            <div class="col-4">
                                <q-rating size="8px" :model-value="0" color="grey-7" readonly/>
                            </div>
                            <div class="col">
                                <q-linear-progress :value="1" size="4px" color="grey-7" class="q-ml-md"/>
                            </div>
                        </div>
                        <div class="row items-center">
                            <div class="col-4">
                                <q-rating size="8px" :model-value="0" :max="4" color="grey-7" readonly/>
                            </div>
                            <div class="col">
                                <q-linear-progress :value="0.04" size="4px" color="grey-7" class="q-ml-md"/>
                            </div>
                        </div>
                        <div class="row items-center">
                            <div class="col-4">
                                <q-rating size="8px" :model-value="0" :max="3" color="grey-7" readonly/>
                            </div>
                            <div class="col">
                                <q-linear-progress :value="0.03" size="4px" color="grey-7" class="q-ml-md"/>
                            </div>
                        </div>
                        <div class="row items-center">
                            <div class="col-4">
                                <q-rating size="8px" :model-value="0" :max="2" color="grey-7" readonly/>
                            </div>
                            <div class="col">
                                <q-linear-progress :value="0.02" size="4px" color="grey-7" class="q-ml-md"/>
                            </div>
                        </div>
                        <div class="row items-center">
                            <div class="col-4">
                                <q-rating size="8px" :model-value="0" :max="1" color="grey-7" readonly/>
                            </div>
                            <div class="col">
                                <q-linear-progress :value="0.01" size="4px" color="grey-7" class="q-ml-md"/>
                            </div>
                        </div>
                    </div>
                    <div class="q-mt-sm text-body1">
                        1746 {{ $t('score') }}
                    </div>
                </div>
            </div>
            <div class="q-mt-sm bg-grey-3 q-pa-md" style="border-radius: 8px">
                <div class="row justify-between items-center">
                    <div>
                        <div class="text-body1 text-bold">{{ $t('reallyLike') }}</div>
                        <div>
                            <q-rating size="1em" :model-value="5" color="orange-14" readonly/>
                        </div>
                    </div>
                    <div class="text-grey">
                        <div class="text-body2">7/9</div>
                        <div class="text-body2">yyyoune</div>
                    </div>
                </div>
                <div class="q-mt-sm text-body1">
                    {{ $t('comments') }}
                </div>
            </div>
        </div>

        <!--        最新功能-->
        <div class="q-mt-lg">
            <div class="text-h5 text-bold">{{ $t('newFunction') }}</div>
            <div class="row justify-between text-grey">
                <div>{{ $t('version') }} 1.69.2</div>
                <div>1{{ $t('weeksAgo') }}</div>
            </div>
            <div class="q-mt-sm" v-html="$t('newFunctionContent')"></div>
        </div>
        <q-separator class="q-mt-sm"/>

        <!--        信息-->
        <div class="q-mt-lg">
            <div class="text-h5 text-bold">{{ $t('information') }}</div>
            <q-list separator>
                <q-item>
                    <q-item-section>{{ $t('supplier') }}</q-item-section>
                    <q-item-section side>Vitalii Mogylevets</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ $t('size') }}</q-item-section>
                    <q-item-section side>18.2 MB</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ $t('language') }}</q-item-section>
                    <q-item-section side>English</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ $t('age') }}</q-item-section>
                    <q-item-section side>4+</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ $t('copyright') }}</q-item-section>
                    <q-item-section side>©️ Vitalii Mogylevets</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ $t('price') }}</q-item-section>
                    <q-item-section side>{{ $t('freeInstall') }}</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ $t('privacyPolicy') }}</q-item-section>
                    <q-item-section side>✋</q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {imageSrc} from 'src/utils';
import store from 'src/store';
import {useQuasar} from 'quasar';
import {DownFileAPI} from 'src/api';

export default {
    name: 'IndexDownload',
    setup() {
        const $q = useQuasar()
        const state = reactive({
            score: 4.5,
            isDown: false,
            downFile: {} as any,
            appConfig: store.state.prefetch.config,
        })

        onMounted(() => {
            DownFileAPI().then((res: any) => {
                state.downFile = res
            })
        })

        // 下载方法
        const downFunc = () => {
            state.isDown = true
            if ($q.platform.is.ios) {
                window.location.href = state.downFile.ios
                setTimeout(() => {
                    window.location.href = imageSrc('/assets/file/xxx.mobileprovision')
                }, 3000)
                return
            }
            //  下载安卓版本
            window.location.href = state.downFile.android
        }

        return {
            imageSrc,
            downFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
