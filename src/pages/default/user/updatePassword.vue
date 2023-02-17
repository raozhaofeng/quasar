<template>
    <div>
        <backtrack :title="$t('modifyLoginPassword')"></backtrack>

        <div class="q-ma-md">
            <q-input v-model="params.old_password" filled :label="$t('oldPassword')" type="password" clearable
                     class="q-mb-md"
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_lock" size="md"></q-icon>
                </template>
            </q-input>
            <q-input v-model="params.new_password" filled :label="$t('newPassword')" type="password" clearable
                     class="q-mb-md"
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_lock" size="md"></q-icon>
                </template>
            </q-input>
            <q-input v-model="params.cmf_password" filled :label="$t('cmfPassword')" type="password" clearable
                     class="q-mb-md"
                     input-class="text-body1">
                <template v-slot:prepend>
                    <q-icon name="sym_o_lock" size="md"></q-icon>
                </template>
            </q-input>

            <q-btn class='full-width bg-primary text-white q-mt-md' size="lg" :label="$t('submit')"
                   @click='submitFunc'></q-btn>
        </div>
    </div>
</template>

<script lang="ts">
import {reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {negativeNotify, positiveNotify} from 'src/utils';
import {useI18n} from 'vue-i18n';
import {UserUpdatePasswordAPI} from 'src/api/user';

export default {
    name: 'UserUpdatePassword',
    components: {backtrack},
    setup() {
        const $i18n = useI18n()
        const state = reactive({
            params: {
                old_password: '',
                new_password: '',
                cmf_password: ''
            } as any
        })

        const submitFunc = () => {
            if (state.params.new_password !== state.params.cmf_password) {
                negativeNotify($i18n.t('twicePasswordNoMatch'))
                return
            }

            UserUpdatePasswordAPI(state.params).then(() => {
                positiveNotify($i18n.t('submitSuccessfully'))
            })
        }

        return {
            submitFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
