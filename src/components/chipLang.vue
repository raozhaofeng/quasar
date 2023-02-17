<template>
    <div v-if="langList.length > 1">
        <div v-if="showIcon">
            <div v-for="(item, itemIndex) in langList" :key="itemIndex">
                <q-avatar @click="$router.push({name: 'Lang'})" v-if="item.alias === lang">
                    <q-img :src="imageSrc(item.icon)" no-spinner></q-img>
                </q-avatar>
            </div>
        </div>
        <div v-else>
            <div v-for="(item, itemIndex) in langList" :key="itemIndex">
                <q-chip square clickable @click="$router.push({name: 'Lang'})" v-if="item.alias === lang">
                    <q-avatar>
                        <q-img :src="imageSrc(item.icon)" no-spinner></q-img>
                    </q-avatar>
                    {{ item.name }}
                </q-chip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {reactive, toRefs, watch} from 'vue'
import store from 'src/store';
import {imageSrc} from 'src/utils';

export default {
    name: 'chipLang',
    props: {
        showIcon: {
            default: false
        }
    },
    setup() {
        const state = reactive({
            langList: store.state.prefetch.langList,
            lang: store.state.user.lang,
        })

        // 监听状态
        watch(() => store.state.user.lang, (val: any) => {
            state.lang = val
        })

        watch(() => store.state.prefetch.langList, (val: any) => {
            state.langList = val
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
