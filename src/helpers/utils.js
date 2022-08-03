import { api } from '../boot/axios'
import { useStore } from 'vuex'

export const doWsSelect = async (idtabla, payload) => {
    return new Promise((resolve, reject) => {
      api.post('api/selects/1/'+idtabla, payload)
        .then((response) => { 
          resolve(response.data)
        })
        .catch((error) => {
          reject(error.response.data)
        })
    })
  }