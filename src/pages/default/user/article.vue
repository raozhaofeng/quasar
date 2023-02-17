<template>
    <div>
        <backtrack :title="$t(titleList[field])"></backtrack>
        <div class="q-ma-md" v-html="content"></div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {UserArticleAPI} from 'src/api';
import Router from 'src/router'

export default {
    name: 'UserArticle',
    components: {backtrack},
    setup() {
        const titleList = {
            home_privacy: 'privacyPolicy',
            home_protocol: 'serviceAgreement'
        }
        const state = reactive({
            field: Router.currentRoute.value.query.field ?? '' as any,
            content: ''
        })

        onMounted(() => {
            UserArticleAPI({field: state.field}).then((res: any) => {
                state.content = res
            })
        })

        return {
            titleList,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
