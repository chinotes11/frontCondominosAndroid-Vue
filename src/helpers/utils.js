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

const meses = [
  {id:1,value:'Enero'},
  {id:2,value:'Febrero'},
  {id:3,value:'Marzo'},
  {id:4,value:'Abril'},
  {id:5,value:'Mayo'},
  {id:6,value:'Junio'},
  {id:7,value:'Julio'},
  {id:8,value:'Agosto'},
  {id:9,value:'Septiembre'},
  {id:10,value:'Octubre'},
  {id:11,value:'Noviembre'},
  {id:12,value:'Diciembre'}
];

const seccionesAdm = [ 
  {
    id: 1,
    name: 'Usuario / Domicilio',
    descripcion: 'Edita información acerca de los usuarios y domicilios, con la posibilidad de dejarlos incativo o activos.',
    icono: 'home_work',
  }, {
    id: 2,
    name: 'Calle/Edificio/Torre/Privada',
    descripcion: 'Agrega o modifica borra o inhabilita los nombres de la Calle/Edificio/Torre/Privada. ',
    icono: 'pin_drop'
  }, {
    id: 3,
    name: 'Tipos de Ingresos',
    descripcion: 'Edita, crea, borra o inhabilita los tipos de ingresos para el cobro de cutoas.',
    icono: 'payments'
  }, {
    id: 4,
    name: 'Tipos de Egresos',
    descripcion: 'Edita, crea, borra o inhabilita los tipos de egresos..',
    icono: 'monetization_on'
  } 
]


export { meses, seccionesAdm }