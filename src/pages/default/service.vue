<template>
    <div>
        <q-img no-spinner :src="imageSrc(appConfig['service_image'])"></q-img>
        <div>
            <!--            联系方式列表-->
            <q-list class="q-ma-md q-pa-md bg-white" style="border-radius: 8px;"
                    v-if="contactList.length > 0">
                <div class="row" style="border-radius: 8px">
                    <div class="col-6" v-for="(contact, contactIndex) in contactList"
                         :key="contactIndex">
                        <div class="q-my-md">
                            <q-item class="no-padding" clickable @click="contactLinkFunc(contact)">
                                <q-item-section avatar>
                                    <q-avatar size="50px">
                                        <q-img no-spinner :src="imageSrc(contact.avatar)" width="50px"
                                               height="50px"></q-img>
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <div class="text-body1">{{ contact.name }}</div>
                                    <div class="text-caption text-grey">{{ contact.desc }}</div>
                                </q-item-section>
                            </q-item>
                        </div>
                    </div>
                </div>
            </q-list>

            <!--            帮助中心列表-->
            <q-list class="q-ma-md bg-white q-mt-lg" style="border-radius: 8px" v-if="helpersList.length > 0">
                <q-expansion-item v-for="(helper, helperIndex) in helpersList" :key="helperIndex"
                                  :label="helper.title">
                    <q-card flat>
                        <q-card-section>
                            <div v-html="helper.content"></div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs} from 'vue'
import {imageSrc} from 'src/utils';
import store from 'src/store'
import {UserHelpers} from 'src/api/user';

export default {
    name: 'IndexService',
    setup() {
        const state = reactive({
            appConfig: store.state.prefetch.config,
            contactList: [] as any,
            helpersList: [] as any
        })

        onMounted(() => {
            UserHelpers().then((res: any) => {
                state.helpersList = res.helpers
                state.contactList = res.contact
            })
        })

        // 跳转链接
        const contactLinkFunc = (contact: any) => {
            window.location.href = contact.link
        }

        return {
            imageSrc,
            contactLinkFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
