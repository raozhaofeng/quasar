<template>
    <div>
        <backtrack :title="$t('langSetting')"></backtrack>
        <q-list separator bordered>
            <q-item v-for="(item, itemIndex) in langList" :key="itemIndex" style="height: 60px" clickable
                    @click="switchLanguageFunc(item)">
                <q-item-section avatar>
                    <img :src="imageSrc(item.icon)" alt="local" width="50">
                </q-item-section>
                <q-item-section>
                    <div class="text-body1">{{ item.name }}</div>
                </q-item-section>
                <q-item-section side>
                    <div v-if="item.alias === lang">
                        <q-icon name="sym_o_check" color="green" size="sm"></q-icon>
                    </div>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>

<script lang="ts">
import {reactive, toRefs} from 'vue'
import store from 'src/store'
import {imageSrc} from 'src/utils';
import backtrack from 'components/backtrack.vue';
import Router from 'src/router'
import {LocalesAPI} from 'src/api';
import {setLocales} from 'boot/i18n';

export default {
    name: 'IndexLang',
    components: {backtrack},
    setup() {
        const state = reactive({
            langList: store.state.prefetch.langList,
            lang: store.state.user.lang,
        })

        // 切换语言
        const switchLanguageFunc = (currentLang: any) => {
            store.commit('user/updateLang', currentLang.alias)
            LocalesAPI().then((res: any) => {
                store.commit('prefetch/updateLocales', res)
                setLocales(res, currentLang.alias)
                void Router.back()
            })
        }

        return {
            imageSrc,
            switchLanguageFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
