import moment from 'moment'

export function formatDate(value) {
  if (value) {
    return moment(String(value)).format('DD.MM.YY')
  }
}

export function toUpperCase(value) {
  if (!value && value !== 0) return ''
  value = value.toString()
  return value.toUpperCase()
}
