import { api } from 'boot/axios'

export const doLogina = async ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    api.post('/api/auth/login/', payload)
      .then((response) => {
        const tokenRes = response.data
        commit('setToken', tokenRes)    
        const {token} = tokenRes
        api.defaults.headers.common['x-token'] = token    
        dispatch('getMe', token)
        resolve({msg:'ok'})
      })
      .catch((error) => {
        reject(error.response.data)
      })
  })
}

export const getDomicilio = async ({ commit, state }, datos) => {
  await api.post('api/selects/1/15', { iduser: state.token.id }).then(response => {    
    const {data}=response.data
    commit('setDomicilio',data[0] )    
  })
}

export const getUsuario = async ({ commit, state }, datos) => {
  await api.post('api/selects/1/16', { iduser: state.token.id }).then(response => {    
    const {data}=response.data
    commit('setUser',data[0] )    
  })
}