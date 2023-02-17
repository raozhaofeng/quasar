import store from 'src/store'

// 解析配置语言
export const parseLocales = (langList: any, locales: any, lang: string): any => {
    const messages = {} as any
    for (let i = 0; i < langList.length; i++) {
        messages[langList[i].alias] = {} as any

        if (langList[i].alias === lang) {
            for (let j = 0; j < locales.length; j++) {
                messages[langList[i].alias][locales[j].label] = locales[j].value
            }
        }
    }
    return messages
}

const schema = store.state.user.lang
export const localSchema = schema
export default parseLocales(store.state.prefetch.langList, store.state.prefetch.locales, store.state.user.lang)
