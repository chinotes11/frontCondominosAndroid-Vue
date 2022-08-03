export function getMe (state) {  
  console.log('Estado',state)
  return state.me
}

export function getUser (state) {  
  console.log(state.user)
  return state.user
}

export function getToken (state) {
  return state.token
}

export function isAuthenticated (state) {
  return state.isAuthenticated
}
