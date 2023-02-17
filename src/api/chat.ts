import {api} from 'boot/axios';

export const ChatSessionTypeAdminToUser = 10        //  管理对用户
export const ChatSessionTypeAdminToTourist = 11     //  管理对临时用户
export const ChatSessionTypeUserToUser = 12         //  用户对用户

//  初始化会话信息
export const InitSessionAPI = (sessionType: number, params: any) => {
    switch (sessionType) {
        case ChatSessionTypeAdminToUser:
            return api.post('/chat/user')
        case ChatSessionTypeAdminToTourist:
            return api.post('/chat/tourist', params)
    }
}

// 清除未读消息
export const clearUnreadAPI = (sessionType: number, params: any) => {
    switch (sessionType) {
        case ChatSessionTypeAdminToUser:
            return api.post('/chat/user/unread', params, {showLoading: false} as any)
        case ChatSessionTypeAdminToTourist:
            return api.post('/chat/tourist/unread', params, {showLoading: false} as any)
    }
}

// 发送消息
export const sendMessageAPI = (sessionType: number, params: any) => {
    switch (sessionType) {
        case ChatSessionTypeAdminToUser:
            return api.post('/chat/user/send', params, {showLoading: false} as any)
        case ChatSessionTypeAdminToTourist:
            return api.post('/chat/tourist/send', params, {showLoading: false} as any)
    }
}

