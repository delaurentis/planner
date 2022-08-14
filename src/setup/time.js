import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

export const setupTimeFormatting = () => {
  TimeAgo.addDefaultLocale(en)
  TimeAgo.addLocale(ru)
}