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
  {id:1,value:'Enero',idM:1},
  {id:2,value:'Febrero',idM:2},
  {id:3,value:'Marzo',idM:3},
  {id:4,value:'Abril',idM:4},
  {id:5,value:'Mayo',idM:5},
  {id:6,value:'Junio',idM:6},
  {id:7,value:'Julio',idM:7},
  {id:8,value:'Agosto',idM:8},
  {id:9,value:'Septiembre',idM:9},
  {id:10,value:'Octubre',idM:10},
  {id:11,value:'Noviembre',idM:11},
  {id:12,value:'Diciembre',idM:12}
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

const seccionesUsr = [ 
  {
    id: 1,
    name: 'Avisos Mensuales',
    descripcion: '',
    icono: 'notifications',
  }, {
    id: 2,
    name: 'Documentos',
    descripcion: '',
    icono: 'description'
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

const menuUsr = [ 
  {
    id: 1,
    name: 'Historial',
    descripcion: '',
    icono: 'history',
    url:''
  }, {
    id: 2,
    name: 'Vigilancia',
    descripcion: '',
    icono: 'local_police',
    url:''
  }, {
    id: 3,
    name: 'Emergencias',
    descripcion: '',
    icono: 'speaker_phone',
    url:'emergencias'
  },  {
    id: 4,
    name: 'Avisos',
    descripcion: '',
    icono: 'notifications',
    url:'avisosu'
  }, {
    id: 5,
    name: 'Documentos',
    descripcion: '',
    icono: 'description',
    url:'documentosu'
  }
]

const menuAdm = [ 
  {
    id: 1,
    name: 'Balance General ',
    descripcion: 'Sección para crear el calendario de cuotas ordinarias mensual.',
    icono: 'query_stats',
    url:'',
    ir:'Ir a Balance General '
  },{
    id: 2,
    name: 'Conciliar Pagos o Ingresos',
    descripcion: 'Sección para conciliación de pagos o ingresos del condominio.',
    icono: 'payments',
    url:'ingresosconciliar',
    ir:'Ir a Conciliar Pagos'
  },{
    id: 3,
    name: 'Gastos o Egresos',
    descripcion: 'Sección para gestionar los gastos o egresos del condominio.',
    icono: 'monetization_on',
    url:'egresosgastos',
    ir:'Ir a Gastos'
  },{
    id: 4,
    name: 'Calendario de Pago ',
    descripcion: 'Sección para crear el calendario de cuotas ordinarias mensual.',
    icono: 'date_range',
    url:'calendariopagos',
    ir:'Ir a Calendario de Pago'
  },{
    id: 5,
    name: 'Administrador de Catalogos ',
    descripcion: 'Sección para crear o modificar, usuarios, domicilios, categorias ingresos egresos etc.',
    icono: 'folder_open',
    url:'admincatalogos',
    ir:'Ir a Administrador de Catalogos'
  },{
    id: 6,
    name: 'Documentos ',
    descripcion: 'Sección para subir documentos como reglamento o acta constitutiva.',
    icono: 'description',
    url:'documentos',
    ir:'Ir a Documentos'
  },{
    id: 7,
    name: 'Avisos',
    descripcion: 'Sección para crear los avisos del mes y volver a activarlos.',
    icono: 'notifications',
    url:'avisos',
    ir:'Ir a Avisos'
  },{
    id: 8,
    name: 'Gestor de Amenidades ',
    descripcion: 'Sección para crear el calendario de amenidades o actividades.',
    icono: 'sports_kabaddi',
    url:'',
    ir:'Ir a Gestor de Amenidades'
  },{
    id: 9,
    name: 'Reportes',
    descripcion: 'Sección para generar reoprtes de la administracion del condominio.',
    icono: 'print',
    url:'',
    ir:'Ir a Reportes'
  },{
    id: 10,
    name: 'Incidentes',
    descripcion: 'Sección para dar seguimiento al reporte de incidentes.',
    icono: 'report',
    url:'',
    ir:'Ir a Reportes'
  },

]
const estatus = [
  {id:0,nombre:'CON ADEUDO'},
  {id:1,nombre:'PENDIENTE'},
  {id:2,nombre:'ADEUDO PARCIAL'},
  {id:3,nombre:'PAGADO'},
];

export { meses, seccionesAdm, seccionesUsr, menuUsr, menuAdm, estatus }