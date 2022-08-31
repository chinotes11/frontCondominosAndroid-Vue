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

//   await api.post('/api/auth/login/', payload).then(response => {
//     const tokenRes = response.data
//     commit('setToken', tokenRes)    
//     const {token} = tokenRes
//     api.defaults.headers.common['x-token'] = token    
//     dispatch('getMe', token)
//     return 'exito'
//   }).catch(error => {
//     //console.log(error.response.data)
//     return error.response.data
//  })
}

export const signOut = ({ commit  }) => {
  api.defaults.headers.common.Authorization = ''  
  commit('removeToken')
}



export const getMe = async ({ commit, state, dispatch }, token) => {
  await api.post('api/selects/1/15', { id: state.token.id }).then(response => {    
    const {data}=response.data
    dispatch('getAsociado', data[0])
    commit('setMe',data[0] )         
  })

  await api.post('api/selects/1/12', { iduser: state.token.id, idconsorcio:state.me.idconsorcio }).then(response => {    
    const {data}=response.data
    commit('setDomicilio',data[0] )    
  }).catch((error) => {
    console.log('ERROR',error)
    const data=[]
    commit('setDomicilio',data ) 
  })

  await api.post('api/selects/1/16', { iduser: state.token.id }).then(response => {    
    const {data}=response.data
    commit('setUser',data[0] )
  })

  

}

export const getAsociado = async ({ commit }, dato) => {
  await api.post('api/selects/1/10', { id: dato.idconsorcio }).then(response => {    
    const {data}=response.data
    commit('setAsociado',data[0] )    
  }) 
}


export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')):'' 
  if (token) {
    console.log(token)
    await commit('setToken', token)
    api.defaults.headers.common['x-token'] = token.token 
    dispatch('getMe', token.id)
  } else {
    commit('removeToken')
  }
}


export const getAlgo = async ({ commit }, token) => {
  console.log('ENTRA');
  await api.get('api/catalogos/formaspago').then(response => {
    console.log(response.data)
    
  })
}

export const doInicio = async ({ dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    api.post('/api/usuarios/inicio', payload)
      .then((response) => {
        console.log(response.data)        
        resolve({msg:response.data})
      })
      .catch((error) => {
        reject(error.response.data)
      })
  })
}

export const doRegistro = async ({ dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    api.post('/api/usuarios', payload)
      .then((response) => {
        console.log(response.data)        
        resolve({msg:response.data})
      })
      .catch((error) => {
        reject(error.response.data)
      })
  })
}

export const doActivar = async ({ dispatch }, id) => {
  return new Promise((resolve, reject) => {
    api.put('/api/usuarios/activar/'+id)
      .then((response) => {
        console.log(response.data)        
        resolve(response.data)
      })
      .catch((error) => {
        reject(error.response.data)
      })
  })
}

export const getDomicilio = async ({ state }) => {

  await api.post('api/selects/1/12', { iduser: state.token.id, idconsorcio:state.me.idconsorcio }).then(response => {    
    const {data}=response.data
    return data    
  }).catch((error) => {
    const data=[]
    return data
  })
}

export const getUsuario = async ({ state }) => {
  await api.post('api/selects/1/16', { iduser: state.token.id }).then(response => {    
    const {data}=response.data
    return data 
  })
}


export const doWs = async ({ state },idtabla, payload) => {
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