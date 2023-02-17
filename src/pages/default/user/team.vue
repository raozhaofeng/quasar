<template>
    <div>
        <backtrack :title="$t('myTeam')"></backtrack>

        <div class="q-ma-md">

            <q-card flat bordered>
                <q-tabs v-model="tab"
                        active-color="primary" indicator-color="primary" align="justify">
                    <q-tab :name="team.id" :label="team.name"
                           v-for="(team, teamIndex) in teamList" :key="teamIndex"/>
                </q-tabs>

                <q-separator/>

                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel :name="team.name" v-for="(team, teamIndex) in teamList" :key="teamIndex">
                        <q-list class="q-mb-sm">
                            <q-item class="no-padding">
                                <q-item-section></q-item-section>
                                <q-item-section side>
                                    <div class="text-body1 text-red text-weight-bold"><span class="text-grey q-mr-sm text-body2">{{$t('total')}}:</span>{{team.sum_money.toFixed(2)}}</div>
                                </q-item-section>
                            </q-item>
                            <q-item v-for="(item, itemIndex) in team.items" :key="itemIndex" class="no-padding">
                                <q-item-section avatar>
                                    <q-avatar size="50px">
                                        <q-img no-spinner width="50px" height="50px"
                                               :src="imageSrc(item.avatar)"></q-img>
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <div>
                                        <div class="text-body1">{{ item.username }}</div>
                                        <div class="text-grey text-caption">{{ date.formatDate(item.created_at * 1000, 'YYYY/MM/DD HH:mm') }}</div>
                                    </div>
                                </q-item-section>
                                <q-item-section side>
                                    <div class="text-body1 text-red text-weight-bold">{{item.money.toFixed(2)}}</div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-tab-panel>
                </q-tab-panels>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import backtrack from 'components/backtrack.vue';
import {UserTeamAPI} from 'src/api/user';
import {imageSrc} from 'src/utils';
import {date} from 'quasar';

export default {
    name: 'UserTeam',
    components: {backtrack},
    setup() {
        const state = reactive({
            tab: 1,
            teamList: [] as any
        })

        onMounted(() => {
            UserTeamAPI().then((res: any) => {
                state.teamList = res
            })
        })

        return {
            imageSrc,
            date,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
