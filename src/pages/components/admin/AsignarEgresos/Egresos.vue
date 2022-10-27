<template>
    <q-card>
        <q-card-section class="q-pa-none">
          <div class="row">
              <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">   
                <span class="text-subtitle2 text-weight-bolder">
                  Periodo Seleccionado: 
                  <span v-if="existe" >{{ calendario?arrmeses.find(mes => Number(mes.id)== Number(calendario.mes)).value.toUpperCase():'' }} DEL AÑO {{calendario?calendario.anio:''}}  </span>
                </span>   
                <br>
                <span class="text-h6 text-weight-bolder">Total de Egreso: <span class="text-teal"> {{ numberFormat2.format(total) }}</span>  </span>                  
              </div>
               <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm"> 
                 <q-btn outline icon="add" color="primary" label="Agregar/Modificar Egreso" size="17px"  @click="show_dialog=!show_dialog" no-caps></q-btn> 
               </div>
              <div class="col-sm-4 col-xs-4  q-pa-sm q-gutter-sm">   
                <q-select
                      outlined
                      v-model="buscar.Anio"
                      :modelValue="buscar.Anio"
                      emit-value
                      map-options
                      option-label="anio"
                      option-value="anio"
                      :options="optionsAI.ops" 
                      label="Año a buscar"                            
                      behavior="menu"     
                      lazy-rules                  
                  >
                  </q-select>                      
              </div>
              <div class="col-sm-4 col-xs-4  q-pa-sm q-gutter-sm"> 
                  <q-select
                      outlined
                      v-model="buscar.Mes"
                      :modelValue="buscar.Mes"
                      emit-value
                      map-options
                      option-label="nombre"
                      option-value="mes"
                      :options="optionsMI.ops" 
                      label="Mes a buscar"                            
                      behavior="menu"     
                      lazy-rules                  
                  >
                  </q-select>                      
              </div>
              <div class="col-sm-4 col-xs-4  q-pa-sm q-gutter-sm"> 
                 <q-btn outline icon="fact_check" color="primary" label="Mostrar" size="17px" @click="getFecha" no-caps></q-btn>       
              </div>
            </div>

            <div v-if="existe" class="col-sm-12 col-xs-12">
              <div class="row">
                <div class="col-sm-6 col-xs-12  ">
                  <q-list bordered class="rounded-borders" >
                    <q-item  v-for="egreso in arrEgreso" :key="egreso.id">
                      <q-item-section top>
                        <q-item-label lines="1">
                          <span class="text-weight-bolder">
                            {{ egreso.categoria }} <span v-if="egreso.activo!=1" class="text-negative"> - Concepto Inactivo </span><br>
                            <span class="text-teal">Monto asignado:</span> 
                            <span>{{ egreso.montoOrigen?numberFormat2.format(egreso.montoOrigen):'$ 0'  }}</span>
                             
                          </span>
                        </q-item-label>
                        <q-item-label caption lines="1">
                          <q-input
                                class="text-weight-bold"
                                type="number"
                                step="any"
                                outlined
                                prefix="$"
                                v-model="egreso.monto"
                                :modelValue="egreso.monto" 
                                label="Monto de Pago"
                                @update:modelValue="val => egreso.monto = Number(val)"
                                :readonly ="egreso.activo!=1"
                            />
                        </q-item-label>
                        <q-item-label lines="1" class="text-weight-bolder">
                          
                        </q-item-label>

                      </q-item-section>

                      <q-item-section  side>
                        <div class="text-grey-8 q-gutter-xs">
                          <br>
                          <br>
                          <q-btn color="primary"  size="18px" outline icon="save" @click="guardarMonto(egreso)" :disabled ="egreso.activo!=1" />
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>     
                </div>
                <div class="col-sm-6 col-xs-12" >
                  <GChart
                      type="PieChart"
                      :data="arrGrafica"
                      :options="chartOptions"
                      :resizeDebounce="400"
                    />
                </div>
              </div>
            </div>

            <div v-else class="row col-sm-12 col-xs-12 q-pa-sm q-gutter-sm">
               <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">
                <span class="text-subtitle2 text-weight-bolder"> 
                  EL PERIODO SELECCIONADO NO ES VALIDO O NO EXISTE EN EL CALENDARIO.
                </span>
              </div>
            </div>
        </q-card-section>
    </q-card>

    <q-dialog v-model="show_dialog" :maximized="true">
      <q-card>
        <q-card-section>
          <div>
            <span class="text-h6">Listado de Egresos </span>
            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup @click="addEgreso" ></q-btn></span>
          </div>
        </q-card-section>
          <TablaEgresos style="width:100%"></TablaEgresos>        
        <q-card-actions align="right">
          <q-btn icon="check_circle"  color="blue" v-close-popup @click="addEgreso" > Aceptar</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>              

<script>

import { useStore } from 'vuex'
import { useQuasar, QSpinnerGears  } from 'quasar'
import { defineComponent, defineAsyncComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'
import { meses, estatus } from '../../../../helpers/utils'
import { GChart } from 'vue-google-charts'
const moment = require('moment');

export default defineComponent({
  name: "Egresos",
  components: {
    GChart,
    TablaEgresos: defineAsyncComponent(() => import('../../../components/admin/EdicionCatalogos/Egresos.vue')),
  },
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    let filtros= ref('')
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const options2 = { style: 'currency', currency: 'MXN' };
    const numberFormat2 = new Intl.NumberFormat('es-MX', options2);
    const sesion = store.getters['auth/getMe'] 
    const arrmeses=meses

    let show_dialog = ref(false)
    let calendario= ref(null)
    let arrEgresoIni = []
    let arrEgreso = ref([])
    let arrEgrConsorcio = ref([])
    let optionsAI = reactive({ ops: null })   
    let optionsMI = reactive({ ops: null })  
    let total= ref(0)
    let buscar = ref({
      Anio:null,
      Mes:null,
    })
    let arrGrafica = ref([['Concepto','Monto']])

    let existe = ref(false)

    const getFecha = async () =>{
      $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        anio:buscar.value.Anio,
        mes:buscar.value.Mes
      }  

      try {   
          const jsonC = await api.post('api/selectsadmin/4', payload);
          calendario.value=jsonC.data.data[0]  
          existe.value=true
          actualiza()
          $q.loading.hide()                      
      } catch (e) {
          console.log(e)
          existe.value=false
          $q.loading.hide() 
           $q.notify({
            position: 'top',
            type: 'negative',
            message: e.response.data.msg
          }) 
      }

    }
    //show_dialog.value = true 
    const addEgreso = ()=>{
      getInicial()
    }

    const actualiza = async () =>{
     $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        anio:buscar.value.Anio,
        mes:buscar.value.Mes
      }  
      
      try {    
          const jsonI = await api.post('api/selectsadmin/13', payload);
          arrEgrConsorcio.value=jsonI.data.data
          if(arrEgreso.value.length == 0){
            arrEgreso.value=arrEgresoIni
          } 
          arrGrafica.value = [['Concepto','Monto']]
          arrEgreso.value.map((e) =>{
            e.monto=0
            e.montoOrigen=0
            arrEgrConsorcio.value.forEach((c)=>{
              if(c.idconceptoegreso===e.id) e.monto=c.monto
              if(c.idconceptoegreso===e.id) e.montoOrigen=c.monto
              if(c.idconceptoegreso===e.id) e.idegreso=c.id              
            })
            arrGrafica.value.push([e.categoria, e.montoOrigen])
          })
          total.value=arrEgreso.value.map((d) => { return d.montoOrigen}).reduce((acc, d) => d + acc)
          console.log(arrEgreso.value, ' - arrGrafica - ' , arrGrafica.value)         
          $q.loading.hide()                      
      } catch (e) {
        
          arrGrafica.value = [['Concepto','Monto']]
          arrEgrConsorcio.value=[]
          arrEgreso.value.map((e) =>{
            e.monto?e.monto=0:''
            e.montoOrigen?e.montoOrigen=0:''
            e.idegreso?e.idegreso=0:''
            arrGrafica.value.push([e.categoria,e.montoOrigen])
          }) 
          console.log(e)
          $q.loading.hide()
      }

    }

    const guardarMonto = async (egr) =>{
      $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        anio:calendario.value.anio,
        mes:calendario.value.mes,
        mespago:Number(moment(new Date(Date.now())).format("M")),
        aniopago:Number(moment(new Date(Date.now())).format("YYYY")),
        monto:egr.monto,
        idconceptoegreso:egr.id
      }  
      
      try {  
        let egresa
        let texto = 'insertado'
        
        if(egr.idegreso){
          texto = 'actualizado'
          egresa = await api.put(`api/updates/${egr.idegreso}/13`, payload);   
        } else {
          texto = 'insertado'
          egresa = await api.put(`api/inserts/13`, payload);            
        }

        await Promise.all([egresa]).then(function (res) {  

          const egrs = res[0].data.data
          let montoAct = arrEgreso.value.find(o => o.id===egrs[0].idconceptoegreso); 

          const index = arrEgreso.value.indexOf(montoAct);
          arrEgreso.value[index].montoOrigen=egrs[0].monto
          arrEgreso.value[index].idegreso=egrs[0].id

          total.value=arrEgreso.value.map((d) => { return d.montoOrigen}).reduce((acc, d) => d + acc)

          arrGrafica.value = [['Concepto','Monto']]
          arrEgreso.value.map((e) =>{  
            arrGrafica.value.push([e.categoria,e.montoOrigen])  
          })
          $q.loading.hide()

          $q.notify({
              position: 'top',
              type: 'positive',
              message: `Se ha ${texto} un nuevo registro correctamente` 
          })     

        });                      
      } catch (e) {
           console.log(e)
           $q.loading.hide()
      }

    }

   const getInicial = async () => {  
      let payloadA = { 
          idconsorcio:sesion.idconsorcio,
          activo:1          
        }
      let payload = { 
          idconsorcio:sesion.idconsorcio          
        }            
      let payloadI = { 
        idconsorcio: sesion.idconsorcio,
        tipo: "egresos"
      }   
      try {    

          const jsonC = await api.post('api/selectsadmin/4', payloadA);
          calendario.value=jsonC.data.data[0]  
          buscar.value.Mes=calendario.value.mes
          buscar.value.Anio=calendario.value.anio
          existe.value=true

          const jsonI = await api.post('api/selectsadmin/6', payloadI);
          arrEgreso.value=jsonI.data.data
          arrEgresoIni=jsonI.data.data

          const jsonA = await api.post('api/selectsadmin/25', payload);
          optionsAI.ops = jsonA.data.data

          const jsonM = await api.post('api/selectsadmin/24', payload);
          let mensual =jsonM.data.data
          mensual.map((m)=>{ m.nombre=arrmeses.find(item => item.idM === m.mes).value }) 
          optionsMI.ops =  mensual
          actualiza()

          $q.loading.hide()                      
      } catch (e) {
          console.log(e)
          $q.loading.hide() 
           $q.notify({
            position: 'top',
            type: 'negative',
            message: e.response.data.msg
          }) 
      }
    }
    
    onMounted( async() =>{
        getInicial()        
    }) 

    return {
        arrmeses,
        numberFormat2,
        calendario,
        arrEgreso,
        buscar,
        optionsMI,
        optionsAI,
        existe,
        total,
        show_dialog,
        arrGrafica,

        getFecha,
        guardarMonto,
        addEgreso,        
        chartOptions: {
          chart: {
            title: 'Egresos Mensuales',          
          },
          width: 550,
          height: 450,
        }

    }
  }

})

</script>

<style scoped>


</style>

