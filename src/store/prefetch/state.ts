export interface PreFetchStateInterface {
    config: any
    template: any
    locales: any
    langList: any
    countries: any
}

export const PreFetchConfig = '_config'
export const PreFetchTemplate = '_template'
export const PreFetchLocales = '_locales'
export const PreFetchLangList = '_langList'
export const PreFetchCountries = '_countries'

function state(): PreFetchStateInterface {
    return {
        config: localStorage.getItem(PreFetchConfig) ? JSON.parse(<string>localStorage.getItem(PreFetchConfig)) : {},
        template: localStorage.getItem(PreFetchTemplate) ? JSON.parse(<string>localStorage.getItem(PreFetchTemplate)) : {},
        locales: localStorage.getItem(PreFetchLocales) ? JSON.parse(<string>localStorage.getItem(PreFetchLocales)) : [],
        langList: localStorage.getItem(PreFetchLangList) ? JSON.parse(<string>localStorage.getItem(PreFetchLangList)) : [],
        countries: localStorage.getItem(PreFetchCountries) ? JSON.parse(<string>localStorage.getItem(PreFetchCountries)) : []
    };
}

export default state;
