<template>
    <q-card>
        <q-card-section class="q-pa-none">
          <div class="row">
                      <div class="col-sm-4 col-xs-6  q-pa-sm q-gutter-sm">   
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
                      <div class="col-sm-4 col-xs-6  q-pa-sm q-gutter-sm"> 
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
                      <div class="col-sm-4 col-xs-12  q-pa-sm q-gutter-sm">   
                        <q-btn outline icon="fact_check" color="primary" label="Mostrar" size="17px" @click="getFecha" no-caps></q-btn>  
                      </div>
          </div>
            <q-tabs
                v-model="tab"
                class="bg-primary text-white"
                align="justify"
                narrow-indicator
                >
                <q-tab name="balance" label="Balance" />
                <q-tab name="grafico" label="Grafico" />
                
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="">
            <q-tab-panel name="balance">
                <div class="row">
                    <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">  
                        <span class="text-h6 text-weight-bolder">Total Egresos</span> 
                        <span class="text-h6 text-weight-bolder float-right">{{numberFormat2.format(totalEgreso)}}</span> 
                        <br>
                        <span class="text-subtitle2 text-weight-bolder">
                          {{ calendario?arrmeses.find(mes => Number(mes.id)== Number(calendario.mes)).value.toUpperCase():'' }} DEL AÑO {{calendario?calendario.anio:''}} 
                        </span>                          
                        <div>
                          <q-table 
                              :rows="dataEgreso" 
                              :columns="columEgreso" 
                              row-key="categoria" 
                              binary-state-sort
                              :filter="filtros"
                              :pagination="pagination"
                              :separator="separator"
                          >
                              <template v-slot:body="props">
                                <q-tr :props="props">                      
                                  <q-td key="categoria" :props="props">
                                    <span class="text-subtitle2 text-weight-bolder text" >{{ props.row.categoria }}</span>
                                  </q-td>
                                  <q-td key="monto" :props="props">
                                      <span class="text-subtitle2 text-weight-bolder text" > {{numberFormat2.format(props.row.monto)}} </span> 
                                  </q-td>
                                </q-tr>
                              </template>
                          </q-table>
                        </div>     
                    </div>
                    <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">  
                        <span class="text-h6 text-weight-bolder">Total Ingresos</span>   
                        <span class="text-h6 text-weight-bolder float-right">{{numberFormat2.format(totalIngreso)}}</span> 
                        <br>
                        <span class="text-subtitle2 text-weight-bolder"> Total Esperado </span> 
                        <span class="text-subtitle2 text-weight-bolder float-right">{{numberFormat2.format(totalInEsperado)}}</span> 
                         
                        <div>
                          <q-table 
                              :rows="dataIngreso" 
                              :columns="columIngreso" 
                              row-key="categoria" 
                              binary-state-sort
                              :filter="filtros"
                              :pagination="pagination"
                              :separator="separator"
                          >
                              <template v-slot:body="props">
                                <q-tr :props="props">                      
                                  <q-td key="categoria" :props="props">
                                    <span class="text-subtitle2 text-weight-bolder text" >{{ props.row.categoria }}</span>
                                  </q-td>
                                  <q-td key="monto" :props="props">
                                      <span class="text-subtitle2 text-weight-bolder text" > {{numberFormat2.format(props.row.monto)}} </span> 
                                  </q-td>
                                </q-tr>
                              </template>
                          </q-table>   
                        </div> 
                    </div>
                </div>
            </q-tab-panel>

            <q-tab-panel name="grafico" class="">
                <div class="text-h6 text-weight-bolder">
                  GRAFICOS  
                  <span v-if="!anual">{{ calendario?arrmeses.find(mes => Number(mes.id)== Number(calendario.mes)).value.toUpperCase():'' }} DEL AÑO {{calendario?calendario.anio:''}}</span>
                  <span v-else>ANUAL {{buscar.Anio}}  </span>
                </div>
                <div class="row">
                  <div class="col-sm-6 col-xs-12">
                    <span class="text-subtitle2 text-weight-bolder float-center">Ingresos vs Egresos</span> 
                     <GChart
                      type="PieChart"
                      :data="arrGrafica"
                      :options="chartOptions"
                      :resizeDebounce="400"
                    />
                  </div>
                  <div class="col-sm-6 col-xs-12">
                    <span class="text-subtitle2 text-weight-bolder float-center">Egresos</span> 
                     <GChart
                      type="PieChart"
                      :data="arrGraficaEgr"
                      :options="chartOptionsEg"
                      :resizeDebounce="400"
                    />
                  </div>
                  <div class="col-sm-6 col-xs-12">
                    <span class="text-subtitle2 text-weight-bolder float-center">Ingresos</span> 
                     <GChart
                      type="PieChart"
                      :data="arrGraficaIng"
                      :options="chartOptionsIn"
                      :resizeDebounce="400"
                    />
                  </div>
                </div>
            </q-tab-panel> 

             
          </q-tab-panels>
          

         

        </q-card-section>
    </q-card>

    <q-dialog v-model="show_dialog" :maximized="true">
      <q-card>
        <q-card-section>
          <div>
            <span class="text-h6">Listado de Egresos </span>
            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
          </div>
        </q-card-section>
               
        <q-card-actions align="right">
          <q-btn icon="check_circle"  color="blue" v-close-popup > Aceptar</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>              

<script>

import { useStore } from 'vuex'
import { useQuasar  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'
import { meses } from '../../../../helpers/utils'
import { GChart } from 'vue-google-charts'
const moment = require('moment');

export default defineComponent({
  name: "Balance",
  components: {
    GChart,
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
    
    let dataEgreso = ref([])
    let columEgreso =ref()
    columEgreso.value = [
      {name: 'categoria', label: 'Concepto', field: 'categoria', align: 'left', sortable: true  },  
      {name: "monto", label: "Monto", field: "monto", sortable: true }
    ];
    let dataIngreso = ref([])
    let columIngreso =ref()
    columIngreso.value = [
      {name: 'categoria', label: 'Concepto', field: 'categoria', align: 'left', sortable: true  },  
      {name: "monto", label: "Monto", field: "monto", sortable: true }
    ];

    let show_dialog = ref(false)
    let calendario= ref(null)
    let totalEgreso = ref()
    let totalIngreso = ref()
    let totalInEsperado = ref()
    let anual = ref(false)
    let optionsAI = reactive({ ops: null })   
    let optionsMI = reactive({ ops: null })  
    let buscar = ref({
      Anio:null,
      Mes:null,
    })
    let arrGrafica = ref([['Concepto','Monto']])
    let arrGraficaEgr = ref([['Concepto','Monto']])
    let arrGraficaIng = ref([['Concepto','Monto']])

    let existe = ref(false)

    const sinRespuesta = async () =>{
      dataEgreso.value = []
      totalEgreso.value = 0
      arrGrafica.value = [['Concepto','Monto']] 
      arrGrafica.value.push(['Egresos',0])
      arrGrafica.value.push(['Ingresos',0])
      existe.value=false
      dataIngreso.value = []
      totalIngreso.value = 0    
      totalInEsperado.value = 0         

    }

    
    const getAnual = async () =>{
      //$q.loading.show({ message: 'Espere mientras termina el proceso...' })
      anual.value=true
    }

    const getFecha = async () =>{
      $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      anual.value=false
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        IN:`anio|${buscar.value.Anio}`,
        INA:`mes|${buscar.value.Mes}`
      }  
      try {   
          const jsonC = await api.post('api/selectsadmin/4', payload);
          calendario.value=jsonC.data.data[0]  
          existe.value=true
          actualizaEg()
          actualizaEs()
          $q.loading.hide()                      
      } catch (e) {
          console.log(e)
          sinRespuesta()
          $q.loading.hide() 
           $q.notify({
            position: 'top',
            type: 'negative',
            message: e.response.data.msg
          }) 
      }

    }
    //show_dialog.value = true 

    const actualizaEg = async () =>{
     $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        IN:`anio|${buscar.value.Anio}`,
        INA:`mes|${buscar.value.Mes}`
      }        
      try {    
         const jsonI = await api.post('api/selectsadmin/27', payload);     
         dataEgreso.value=jsonI.data.data
         totalEgreso.value=dataEgreso.value.map((d) => { return d.monto}).reduce((acc, d) => d + acc)
         console.log('Total - ',totalEgreso.value)
         arrGrafica.value = [['Concepto','Monto']] 
         arrGrafica.value.push(['Egresos',Number(totalEgreso.value)])

         arrGraficaEgr.value = [['Concepto','Monto']] 
         console.log(dataEgreso.value)
         dataEgreso.value.map((e) =>{ arrGraficaEgr.value.push([e.categoria, e.monto]) })
         actualizaIn()
                  
          // console.log(totalEgreso.value, ' - arrGrafica - ' , arrGrafica.value)         
          $q.loading.hide()                      
      } catch (e) {
          dataEgreso.value = []
          totalEgreso.value = 0
          arrGrafica.value = [['Concepto','Monto']] 
          arrGrafica.value.push(['Egresos',0])
          arrGraficaEgr.value = [['Concepto','Monto']] 
          actualizaIn()              
          console.log(e)
          $q.loading.hide()
      }
    }

    const actualizaIn = async () =>{
     $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        IN:`anio|${buscar.value.Anio}`,
        INA:`mes|${buscar.value.Mes}`
      }        
      try {    
         const jsonI = await api.post('api/selectsadmin/28', payload);     
         dataIngreso.value=jsonI.data.data
         totalIngreso.value=dataIngreso.value.map((d) => { return d.monto}).reduce((acc, d) => d + acc)
         arrGrafica.value.push(['Ingresos',Number(totalIngreso.value)])
         arrGraficaIng.value = [['Concepto','Monto']] 
         dataIngreso.value.map((e) =>{
            arrGraficaIng.value.push([e.categoria, e.monto])
          })
          // console.log(totalIngreso.value, ' - arrGrafica - ' , arrGrafica.value)         
          $q.loading.hide()                      
      } catch (e) {
          dataIngreso.value = []
          totalIngreso.value = 0
          arrGrafica.value.push(['Ingresos',0])    
          arrGraficaIng.value = [['Concepto','Monto']]   
          console.log(e)
          $q.loading.hide()
      }
    }

    const actualizaEs = async () =>{
     $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        IN:`anio|${buscar.value.Anio}`,
        INA:`mes|${buscar.value.Mes}`
      }        
      try {    
          const jsonI = await api.post('api/selectsadmin/30', payload);     
          let res=jsonI.data.data
          totalInEsperado.value=res[0].pagar        
          $q.loading.hide()                      
      } catch (e) {
          totalInEsperado.value = 0    
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
       
      try {    

          const jsonC = await api.post('api/selectsadmin/4', payloadA);
          calendario.value=jsonC.data.data[0]  
          buscar.value.Mes=calendario.value.mes
          buscar.value.Anio=calendario.value.anio
          existe.value=true

          const jsonA = await api.post('api/selectsadmin/25', payload);
          optionsAI.ops = jsonA.data.data

          const jsonM = await api.post('api/selectsadmin/24', payload);
          let mensual =jsonM.data.data
          mensual.map((m)=>{ m.nombre=arrmeses.find(item => item.idM === m.mes).value }) 
          optionsMI.ops =  mensual          
          actualizaEg()          
          actualizaEs()
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
        totalEgreso,
        totalIngreso,
        totalInEsperado,
        buscar,
        optionsMI,
        optionsAI,
        pagination: { rowsPerPage: 20 },
        filtros,
        dataEgreso,
        columEgreso,
        dataIngreso,
        columIngreso,
        calendario,
        tab: ref('balance'),
        getFecha,
        getAnual,
        anual,
        separator: ref('vertical'),
        arrGrafica,
        arrGraficaEgr,
        arrGraficaIng,


        existe,
        show_dialog,
           
        chartOptions: {
          chart: { title: 'Ingresos vs Egresos'},
          width: 500,
          height: 450,
        },
        chartOptionsEg: {
          chart: { title: 'Egresos'},
          width: 500,
          height: 450,
        },
        chartOptionsIn: {
          chart: { title: 'Ingresos'},
          width: 500,
          height: 450,
        }

    }
  }

})

</script>

<style scoped>


</style>

