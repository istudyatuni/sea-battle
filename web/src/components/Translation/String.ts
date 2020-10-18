let json: any

export const initLocale = (locale?: string): void => {
  locale = locale || navigator.language || 'en'
  json = require('./' + locale + '.json')
  let html = document.getElementById('html')
  if(html!==null)
    html.setAttribute('lang', locale)
}

export const getString = (key: string): string => {
  return json[key]
}
