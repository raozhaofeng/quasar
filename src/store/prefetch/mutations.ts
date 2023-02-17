import {MutationTree} from 'vuex';
import {PreFetchStateInterface} from './state';
import {
    PreFetchConfig,
    PreFetchTemplate,
    PreFetchLocales,
    PreFetchLangList,
    PreFetchCountries,
} from './state';

const mutation: MutationTree<PreFetchStateInterface> = {
    // 更新配置文件
    updateConfig(state: PreFetchStateInterface, config: any) {
        if (config.hasOwnProperty('admin_cache_expire')) {
            config.cache_expire_timestamp = parseInt((new Date().getTime() / 1000).toString()) + parseInt(config['admin_cache_expire'])
        }
        state.config = config
        localStorage.setItem(PreFetchConfig, JSON.stringify(config))
    },
    // 更新模版配置
    updateTemplate(state: PreFetchStateInterface, template: object) {
        state.template = template
        localStorage.setItem(PreFetchTemplate, JSON.stringify(template))
    },
    // 更新本地语言配置
    updateLocales(state: PreFetchStateInterface, locales: []) {
        state.locales = locales
        localStorage.setItem(PreFetchLocales, JSON.stringify(locales))
    },
    // 更新语言列表
    updateLangList(state: PreFetchStateInterface, langList: []) {
        state.langList = langList
        localStorage.setItem(PreFetchLangList, JSON.stringify(langList))
    },
    // 更新国家配置
    updateCountries(state: PreFetchStateInterface, countries: []) {
        state.countries = countries
        localStorage.setItem(PreFetchCountries, JSON.stringify(countries))
    }
};

export default mutation;
