<template>
    <div>
        <backtrack :title="$t('userSetting')"></backtrack>

        <div>
            <q-list separator>
                <q-item clickable @click="$router.push({name: 'UserUpdate'})">
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('userInfo')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'UserUpdatePassword'})" v-if="templateSetting.hasOwnProperty('template_basic') && templateSetting['template_basic']['update_password']">
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('modifyLoginPassword')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'UserUpdateSecurity'})" v-if="templateSetting.hasOwnProperty('template_basic') && templateSetting['template_basic']['update_security']">
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('modifySecurityKey')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'Lang'})">
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('langSetting')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn class="no-padding" flat :ripple="false">
                            <div class="q-mr-xs">
                                <chip-lang></chip-lang>
                            </div>
                            <q-icon name="sym_o_chevron_right"></q-icon>
                        </q-btn>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'UserArticle', query: {field: 'home_protocol'}})">
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('serviceAgreement')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item clickable @click="$router.push({name: 'UserArticle', query: {field: 'home_privacy'}})">
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('privacyPolicy')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-icon name="sym_o_chevron_right"></q-icon>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section class="q-my-sm">
                        <div class="text-body1">{{$t('VersionInfo')}}</div>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn class="no-padding" flat :ripple="false">
                            <div class="q-mr-xs">v2.43.6</div>
                            <q-icon name="sym_o_chevron_right"></q-icon>
                        </q-btn>
                    </q-item-section>
                </q-item>
            </q-list>

        </div>
    </div>
</template>

<script lang="ts">
import {reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import chipLang from 'components/chipLang.vue';
import store from 'src/store';

export default {
    name: 'UserSetting',
    components: {backtrack, chipLang},
    setup() {
        const state = reactive({
            templateSetting: JSON.parse(JSON.stringify(store.state.prefetch.template)),
        })

        return {
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
