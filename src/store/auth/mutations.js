export const setToken = (state, token) => {
  state.token = token
  state.isAuthenticated = true
  window.localStorage.setItem('token', JSON.stringify(token))
}

export const removeToken = (state, token) => {
  window.localStorage.setItem('token', '')
  state.me = {}
  state.token = ''
  state.isAuthenticated = false
  state.domicilio = {}
  state.user = {}
  state.asociado = {}
}

export const setMe = (state, me) => {
  state.me = me
}

export const setUser = (state, user) => {
  state.user = user
}

export const setDomicilio = (state, domicilio) => {
  state.domicilio = domicilio
}

export const setAsociado = (state, asociado) => {
  state.asociado = asociado
}
