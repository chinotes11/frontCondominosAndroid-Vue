<template>
  <q-page>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card class="my-card" flat bordered>                 
              <q-card-section horizontal>        
                  <q-card-section class="q-pt-xs">
                    <div class="text-overline"> 
                      <q-icon color="primary" size="15px" name="date_range" /> 
                      Debe capturar el nuevo periodo mensual de pago, seleccionando mes, año y categoria. 
                    </div>                                
                  </q-card-section>
              </q-card-section>
            </q-card>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-card rounded-borders>
            <q-card-section>
                <q-form
                    class="q-gutter-md"
                    @submit.prevent="onSubmit"
                >
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-md ">
                      <q-card class="my-card" flat bordered>   
                            <q-card-section class="q-gutter-md" > 
                                <h6 class="text-h6 text-uppercase q-my-none text-weight-regular">Calendario de Pago Mensual</h6>     
                                <h6 class="text-body2 q-my-none text-weight-regular">En esta sección se va agenerar un nuevo mes de cobro para todos los domicilios, se hara el corte de pagos y cobros del mes que termina.</h6>                              

                                <q-select
                                    outlined
                                    v-model="calendarioPago.idcategoria"
                                    :modelValue="calendarioPago.idcategoria"
                                    emit-value
                                    map-options
                                    use-input
                                    option-label="categoria"
                                    option-value="id"
                                    :options="options.ops" 
                                    label="Seleccione Concepto de Pago"                            
                                    behavior="menu"    
                                    @filter="filterFn"   
                                    lazy-rules        
                                    :disable="disabled"  
                                    :rules="[ val => val && val > 0 || 'Este campo es obligatorio']"                       
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>

                                <q-select
                                    outlined
                                    v-model="calendarioPago.mes"
                                    :modelValue="calendarioPago.mes"
                                    emit-value
                                    map-options
                                    use-input
                                    option-label="value"
                                    option-value="id"
                                    :options="optMes.ops" 
                                    label="Seleccione Mes de Pago"                            
                                    behavior="menu"    
                                    @filter="filterMes"   
                                    lazy-rules        
                                    :disable="disabled"                       
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>

                                <q-select
                                    outlined
                                    v-model="calendarioPago.anio"
                                    :modelValue="calendarioPago.anio"
                                    emit-value
                                    map-options
                                    use-input
                                    option-label="anio"
                                    option-value="anio"
                                    :options="optAnio.ops" 
                                    label="Seleccione Año de Pago"                            
                                    behavior="menu"      
                                    lazy-rules  
                                    :rules="[ val => val && val > 0 || 'Este campo es obligatorio']"       
                                    :disable="disabled"                                                           
                                > </q-select>

                                
                                <!-- 
                                <q-input outlined v-model="fecha" :rules="['date']" fill-mask="##/####" >
                                  <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date 
                                            :locale="es"
                                            v-model="fecha"
                                            :emit-immediately="true"
                                            default-view="Years"
                                            mask="01/MM/YYYY">
                                          <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="ACEPTAR" color="primary" flat />
                                          </div>
                                        </q-date>
                                      </q-popup-proxy>
                                    </q-icon>
                                  </template>
                                </q-input>

                             -->

                                <q-input
                                    type="number"
                                    step="any"
                                    outlined
                                    prefix="$"
                                    v-model="calendarioPago.monto"
                                    :modelValue="calendarioPago.monto" 
                                    label="Monto de pago mensual"
                                    @update:modelValue="val => calendarioPago.monto = val"
                                    :disable="disabled"
                                    lazy-rules   
                                    :rules="[ val => val && val > 0 || 'Este campo es obligatorio']"  
                                />

                                <q-input
                                    type="number"
                                    :dense="false"
                                    outlined
                                    v-model="calendarioPago.dialimite"
                                    :modelValue="calendarioPago.dialimite" 
                                    label="Dia limite para generar recargo"
                                    @update:modelValue="val => calendarioPago.dialimite = Number(val)"
                                    :disable="disabled" 
                                    lazy-rules   
                                    :rules="[
                                      val => val >= 0 && val < 31 || 'El día debe ser entre 0 y 30, usando 0 (Cero) cuando no aplique recargo.'
                                    ]"
                                />

                                <q-input
                                    type="number"
                                    step="any"
                                    outlined
                                    prefix="$"
                                    v-model="calendarioPago.recargo"
                                    :modelValue="calendarioPago.recargo" 
                                    label="Monto de recargo"
                                    @update:modelValue="val => calendarioPago.recargo = Number(val)"
                                    :disable="disabled" 
                                />

                                

                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <div>
                    <q-btn label="Crear Calendario Mensual" icon="edit_calendar" type="submit" :disable="disabled" color="primary"/>
                </div>
                </q-form>
            </q-card-section>
            </q-card>
        </div>

    </div>
  </q-page>  
  <q-page-sticky position="top-right" :offset="[1, 1]">
    <q-fab fab icon="arrow_back" padding="sm" @click="$router.go(-1)" color="primary" />
  </q-page-sticky>
</template>

<script>

import { useStore } from 'vuex'
import { useQuasar, QSpinnerGears  } from 'quasar'
import { reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../boot/axios'
import { meses } from '../../helpers/utils'
const moment = require('moment');
const options2 = { style: 'currency', currency: 'MXN' };
const numberFormat2 = new Intl.NumberFormat('es-MX', options2);

export default {
  name: 'CalendarioPagos',

  
  setup(props) {

    const store = useStore()
    const $q = useQuasar() 
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    const anio = Number(moment(new Date(Date.now())).format("yyyy"))
    const mes = Number(moment(new Date(Date.now())).format("M"))
    const anios = [{"anio":anio-1}, {"anio":anio}, {"anio":anio+1}]

    let optAnio = reactive({
      ops: anios,
    })
    
    let arrMes=meses
    let optMes = reactive({
      ops: meses,
    })

    let arrVal=[]            
    let options = reactive({
      ops: null,
    }) 

    let calendarioPago = ref ({
          idconsorcio: sesion.idconsorcio,
          idcategoria: '',
          mes: mes,
          anio: anio,
          monto: '',
          recargo: 0,
          dialimite: 0
      })
    
    let disabled = ref(false);     
    
    const getCategorias = async () => {   
        let payload = { 
          "idconsorcio": sesion.idconsorcio,
          "tipo": "ingresos"
          }        
        try {                
            const json = await api.post('api/selects/1/6', payload);
            const {data}=json.data
            arrVal = data    
            options.ops = data 
        } catch (e) {
            console.log(e)
        }
    }

    const guardaCalendario = async ()=>{       
        try {
            $q.dialog({
              title: 'Confirmación de Calendario',
              message: `¿Esta usted seguro de cerrar el mes actual y crear el mes <b>${meses.find(mes => Number(mes.id)== Number(calendarioPago.value.mes)).value.toUpperCase()}</b> 
                        del año <b>${calendarioPago.value.anio}</b> por el concepto de 
                        <b>${options.ops.find(cat => Number(cat.id)== Number(calendarioPago.value.idcategoria)).categoria.toUpperCase()}</b> 
                        por un monto de <b>${Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(calendarioPago.value.monto)}</b> y dejarlo como mes activo?  `,
              html: true,
              ok: {
                push: true,
                color: 'positive',
                label: 'ACEPTAR',
                icon: 'check_circle'
                
              },
              cancel: {
                push: true,
                color: 'negative',
                label: 'CANCELAR',
                icon: 'cancel'
              },
              persistent: true
            }).onOk(() => {
                crearCalendario()
                console.log(calendarioPago.value)
            }).onCancel(() => {
              // console.log('>>>> Cancel')
            }).onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            })   
        } catch (error) {
            $q.notify({
                position: 'top',
                type: 'negative',
                message: 'No se ha poddio guardar la información intentelo de nuevo.'
            }) 
        }          
    }

    const crearCalendario = async () => {                    
      try {       

        const dialogProgreso = $q.dialog({
          title: 'Generando calendario...',
          dark: false,
          message: `Espere un momento, este proceso puede tardar unos segundos, no refresque la pantalla ni cierre la aplicación`, 
          html: true,
          progress: {
            spinner: QSpinnerGears,
            color: 'primary'
          },
          persistent: true, // we want the user to not be able to close it
          ok: false // we want the user to not be able to close it
        })
          
          const json = await api.put('api/calendario/4', calendarioPago.value);
          console.log(json)
          const {msg}=json.data
          console.log(msg)

          dialogProgreso.update({
            title: 'Exito',
            message: `Se completo la generación del calendarió mensual de cuotas fijas para el mes de <b>${meses.find(mes => Number(mes.id)== Number(calendarioPago.value.mes)).value.toUpperCase()}</b> 
                          del año <b>${calendarioPago.value.anio}</b> por el concepto de 
                          <b>${options.ops.find(cat => Number(cat.id)== Number(calendarioPago.value.idcategoria)).categoria.toUpperCase()}</b> 
                          por un monto de <b>${Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(calendarioPago.value.monto)}</b>. `,
            html: true,
            progress: false,
            ok: true,
            ok: {
                push: true,
                color: 'positive',
                label: 'ACEPTAR',
                icon: 'check_circle'
                
              },
          })
          $q.notify({
              position: 'top',
              type: 'positive',
              message: msg
          }) 
          
      } catch (e) {
        //const {msg}=e.response.data
        console.log(e)
        $q.notify({
            position: 'top',
            type: 'negative',
            message: `Este mes y año ya se ha creado en el calendario favor de verificar.`
        }) 
      }
    }
    //const { data } = await  = await store.dispatch('fetchActivityTypes')computed( () => store.getters['auth/getMe'][0]),

    onMounted( async() =>{
            getCategorias()
            $q.loading.hide()
    })

    return {       
      calendarioPago: computed( () => calendarioPago.value),  
      disabled: computed( () => disabled.value),
      onSubmit: async () => {
          guardaCalendario()
      }, 
      optAnio,    
      optMes,
      options,
      filterFn (val, update,e) {
        if (val === '') {
            update(() => {options.ops = arrVal})
            return
        }
        update(() => {
            const needle = val.toLowerCase()
            options.ops = arrVal.filter(v => v.categoria.toLowerCase().indexOf(needle) > -1)
        })
      },
      filterMes (val, update) {
        if (val === '') {
            update(() => {optMes.ops = arrMes})
            return
        }
        update(() => {
            const needle = val.toLowerCase()
            optMes.ops = arrMes.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
        })
      }

    }
  }
}
</script>

<style scoped>
</style>
