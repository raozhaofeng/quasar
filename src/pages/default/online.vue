<template>
    <div style="overflow: hidden">
        <div class="fixed-top" style="z-index: 1000">
            <backtrack :title="adminInfo.nickname !== ''? adminInfo.nickname : adminInfo.username"></backtrack>
        </div>
        <div class="q-ml-sm">
            <div style="height: 70px"></div>
            <q-scroll-area ref="chatMessageRef" :style="{height: (domHeight - 130) + 'px'}"
                           :thumb-style="{right: '2px', borderRadius: '5px', width: '5px'}"
                           content-active-style="padding-right: 10px" content-style="padding-right: 10px">
                <div v-for="(message, messageIndex) in chatMessageList" :key="messageIndex">
                    <q-chat-message :avatar="imageSrc(adminInfo.avatar)"
                                    v-if="message.sender_id === userInfo.id"
                                    :text-html="message.type === WebsocketMessageTypeImage"
                                    :text='[message.type === WebsocketMessageTypeImage ? "<img src=\"" + imageSrc(message.data) + "\" width=\"100%\" />" : message.data]'
                                    :stamp="agoFormatDate(message.created_at)" sent
                                    bg-color="primary" text-color="white"/>
                    <q-chat-message :avatar="imageSrc(userInfo.avatar)" v-else
                                    :text-html="message.type === WebsocketMessageTypeImage"
                                    :text='[message.type === WebsocketMessageTypeImage ? "<img src=\"" + imageSrc(message.data) + "\" width=\"100%\" />" : message.data]'
                                    :stamp="agoFormatDate(message.created_at)"
                                    bg-color="white"/>
                </div>
            </q-scroll-area>
        </div>

        <div class="fixed-bottom bg-grey-2" style="border-top: 1px solid #cdcdcd">
            <q-item style="padding: 4px">
                <q-item-section avatar style="padding: 0; min-width: 0;">
                    <q-uploader flat auto-upload style="height: 46px; width: 46px;"
                                class="chat-tool-uploader"
                                :url='baseURL + "/upload"' field-name='file'
                                @uploaded='sendImageFunc'
                                v-if="sessionType !== ChatSessionTypeAdminToTourist"
                                :headers="[{name: 'Token', value: $store.state.user.token}, {name: 'Token-Key', value: $store.state.user.tokenKey}]">
                        <template v-slot:header></template>
                        <template v-slot:list='scope'>
                            <div @click='scope.pickFiles' class="bg-grey-2 no-padding full-height"
                                 style="overflow: hidden">
                                <q-uploader-add-trigger/>
                                <q-btn dense flat square color="primary" icon="sym_o_image" size="24px"
                                       style="min-width: 0;min-height: 0;padding: 0"/>
                            </div>
                        </template>
                    </q-uploader>
                </q-item-section>
                <q-item-section>
                    <q-input dense outlined rounded v-model="msgText" :placeholder="$t('pleaseEnterContent')">
                        <template v-slot:after>
                            <q-avatar size="40px" class="bg-primary">
                                <q-btn dense round flat icon="arrow_upward" size="17px" color="white" @click="sendTextFunc"/>
                            </q-avatar>
                        </template>
                    </q-input>
                </q-item-section>
            </q-item>
        </div>
    </div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs, ref, watch, onUnmounted} from 'vue'
import {imageSrc} from 'src/utils';
import {formatDate, agoFormatDate} from 'src/utils/formatDate';
import store from 'src/store';
import {InitSessionAPI, clearUnreadAPI, sendMessageAPI, ChatSessionTypeAdminToTourist, ChatSessionTypeAdminToUser, ChatSessionTypeUserToUser} from 'src/api/chat';
import backtrack from 'components/backtrack.vue';
import {
    websocketConn, WebsocketMessageTypeText,
    WebsocketMessageTypeImage, connectWebsocket
} from 'boot/websocket';
import Router from 'src/router';

export default {
    name: 'IndexOnline',
    components: {backtrack},
    setup() {
        const chatMessageRef = ref(null) as any
        const state = reactive({
            domHeight: window.innerHeight,
            baseURL: process.env.baseURL,
            sessionType: 0,
            adminInfo: {
                nickname: ''
            } as any,
            userInfo: {
                id: Router.currentRoute.value.query.id ?? 0,
                avatar: ''
            } as any,
            msgText: '',
            chatMessageList: [] as any
        })

        onMounted(() => {
            //  连接websocket， 获取当前游客ID
            connectWebsocket().then((touristId: any) => {
                //  初始化会话类型
                state.sessionType = ChatSessionTypeAdminToTourist
                if (!store.getters['user/isLogin']) {
                    state.userInfo.id = touristId
                } else {
                    state.userInfo = store.state.user.info
                    state.sessionType = ChatSessionTypeAdminToUser
                }
                //  初始化会话
                InitSessionAPI(state.sessionType, {id: state.userInfo.id})?.then((res: any) => {
                    state.adminInfo = res.info
                    state.chatMessageList = res.messages
                })

                //  消息通知
                websocketConn.messageEvent = (msg: any) => {
                    switch (msg.type) {
                        // 聊天消息
                        case WebsocketMessageTypeText:
                        case WebsocketMessageTypeImage:
                            //  发出消息声音
                            const audio = new Audio(imageSrc('/assets/mp3/msg.mp3'))
                            audio.play().then()

                            //  清除未读消息, 添加消息记录
                            clearUnreadAPI(state.sessionType, {session_key: state.adminInfo.session_key})?.then()
                            state.chatMessageList.push(msg)
                            break
                    }
                }
            })
        })

        // 删除消息流
        onUnmounted(() => {
            websocketConn.messageEvent = null
        })

        // 发送文本消息
        const sendTextFunc = () => {
            if (state.msgText !== '' && state.msgText !== '\n') {
                sendMessageFunc(WebsocketMessageTypeText, state.msgText)
            }
            state.msgText = ''
        }

        // 发送图片消息
        const sendImageFunc = (info: any) => {
            const fileURL = JSON.parse(info.xhr.response).data;
            sendMessageFunc(WebsocketMessageTypeImage, fileURL)
        }

        // 发送消息
        const sendMessageFunc = (msgType: number, msgContent: string) => {
            // 加载消息列表
            state.chatMessageList.push({
                session_id: 0,
                role_id: state.sessionType,
                sender_id: state.userInfo.id,
                receiver_id: state.adminInfo.id,
                type: msgType,
                data: msgContent,
                extra: '',
                created_at: Date.parse(new Date().toString()) / 1000
            })
            //  发送消息
            sendMessageAPI(state.sessionType, {session_key: state.adminInfo.session_key,type: msgType, data: msgContent})?.then()
        }

        // 监听数据, 滚动到底部
        watch(() => state.chatMessageList, () => {
            setTimeout(() => {
                chatMessageRef.value.setScrollPosition('vertical', chatMessageRef.value.getScroll().verticalSize)
            }, 200)
        }, {deep: true})

        return {
            chatMessageRef,
            imageSrc,
            formatDate,
            agoFormatDate,
            WebsocketMessageTypeText,
            WebsocketMessageTypeImage,
            ChatSessionTypeAdminToTourist,
            ChatSessionTypeAdminToUser,
            ChatSessionTypeUserToUser,
            sendImageFunc,
            sendTextFunc,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped>

</style>
