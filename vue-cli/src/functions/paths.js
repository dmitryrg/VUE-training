import config from '@/config.js'

export function makeUrlImage(val) {
  return val ? `${config.serverStatic}${val}` : `${config.serverStatic}${config.defaultImage}`
}

export function makePathUser(user) {
  return '/users/' + user.id
}
