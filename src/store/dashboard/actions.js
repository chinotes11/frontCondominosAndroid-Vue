import { api } from 'boot/axios'

export const doLogin = async ({ commit, dispatch }, payload) => {
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

