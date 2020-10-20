let json: any

export const initLocale = (locale?: string): void => {
  let allow = require('./allow.json')
  locale = locale || navigator.language
  if(allow[locale]!==true)
    locale = 'en'
  json = require('./' + locale + '.json')
  let html = document.getElementById('html')
  if(html!==null)
    html.setAttribute('lang', locale)
}

export const getString = (key: string): string => {
  return json[key]
}
