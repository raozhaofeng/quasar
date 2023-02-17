import {boot} from 'quasar/wrappers';
import store from 'src/store'

export const WebsocketMessageTypeText = 1           //  文本消息
export const WebsocketMessageTypeImage = 2          //  图片消息


let websocketConn = null as any                     //  websocket对象

// 随机数生成
const randomTouristId = (): number => {
    let touristId = parseInt(<string>localStorage.getItem('_touristId'))
    if (touristId) {
        return touristId
    }
    const maxNum = 999999999
    const minNum = 100000000
    touristId = parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10)
    localStorage.setItem('_touristId', String(touristId))
    return touristId
}

export const connectWebsocket = () => {
    return new Promise((resolve: any) => {
        //  关闭当前连接, 重新连接websocket
        if (websocketConn != null) {
            websocketConn.close()
            websocketConn = null
        }

        //  预设信息
        const protocol = document.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const touristId = randomTouristId()
        const urlParams = store.getters['user/isLogin'] ? 'token=' + store.state.user.token + '&key=' + store.state.user.tokenKey : 'id=' + touristId
        websocketConn = new WebSocket(protocol + process.env.baseURL + '/ws?' + urlParams)


        // 打开websocket消息
        websocketConn.onopen = () => {
            console.log('连接websocket成功...')
        }

        // 消息通知
        websocketConn.messageEvent = null as any

        // 发送websocket消息
        websocketConn.onmessage = (event: any) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
                default:
                    //  聊天消息
                    if (websocketConn.messageEvent != null) {
                        websocketConn.messageEvent(message)
                    }
            }
        }

        // 关闭websocket消息
        websocketConn.onclose = () => {
            websocketConn = null
            console.log('websocket已关闭')
        }
        resolve(touristId)
    })
}

export {websocketConn}
export default boot(() => {
    //  启动文件
})
