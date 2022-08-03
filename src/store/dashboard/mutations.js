export const setToken = (state, token) => {
  state.token = token
  state.isAuthenticated = true
  window.localStorage.setItem('token', JSON.stringify(token))
}

export const removeToken = (state, token) => {
  window.localStorage.setItem('token', '')
  state.token = ''
  state.isAuthenticated = false
}

export const setMe = (state, me) => {
  state.me = me
}

export const setUser = (state, user) => {
  state.user = user
}
