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
          <q-card>
            <q-card-section>
                <q-form
                    class="q-gutter-md"
                    @submit.prevent="onSubmit"
                >
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-md ">
                      <q-card class="my-card" flat bordered>   
                            <q-card-section class="q-gutter-md" > 
                                <h6 class="text-h6 text-uppercase q-my-none text-weight-regular">Calendario de Pago</h6>     
                                <h6 class="text-body2 q-my-none text-weight-regular">En esta sección se va agenerar un nuevo mes de cobro para todos los domicilios, se hara el corte de pagos y cobros del mes que termina.</h6>                              

                                <q-select
                                    filled
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
                                    filled
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
                                    filled
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
                                <q-input filled v-model="fecha" :rules="['date']" fill-mask="##/####" >
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
                                    filled
                                    v-model="calendarioPago.monto"
                                    :modelValue="calendarioPago.monto" 
                                    label="Monto de pago mensual"
                                    @update:modelValue="val => calendarioPago.monto = Number(val)"
                                    :disable="disabled"
                                    lazy-rules   
                                    :rules="[ val => val && val > 0 || 'Este campo es obligatorio']"  
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
    <q-fab fab icon="arrow_back"  @click="$router.go(-1)" color="primary" />
  </q-page-sticky>
</template>

<script>

import { useStore } from 'vuex'
import { useQuasar, date } from 'quasar'
import { reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../boot/axios'
import { meses } from '../../helpers/utils'
const moment = require('moment');

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
          mes: mes+1,
          anio: anio,
          monto: '',
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
            console.log(calendarioPago.value)          
          } catch (error) {
              $q.notify({
                  position: 'top',
                  type: 'negative',
                  message: 'No se ha poddio guardar la información intentelo de nuevo.'
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
