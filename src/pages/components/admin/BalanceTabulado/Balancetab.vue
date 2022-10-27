<template>
    <q-card>
        <q-card-section class="q-pa-none">
          <div class="row">
            <div class="col-sm-3 col-xs-6  q-pa-sm q-gutter-sm"> 
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
            <div class="col-sm-3 col-xs-6  q-pa-sm q-gutter-sm">   
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
            <div class="col-sm-3 col-xs-6  q-pa-sm q-gutter-sm">   
              <q-btn outline icon="event" color="primary" label="Mensual" size="17px" @click="getFecha" no-caps></q-btn>  
            </div>
            <div class="col-sm-3 col-xs-6  q-pa-sm q-gutter-sm">   
              <q-btn outline  color="primary" icon="date_range" label="Anual" size="17px" @click="getAnual" no-caps></q-btn>  
            </div>
          </div>
          <q-tabs
              v-model="tab"
              class="bg-primary text-white"
              align="justify"
              narrow-indicator
              >
              <q-tab name="balance" label="Balance" />
              <q-tab name="grafico" label="Graficos" />
              <q-tab name="tabulado" label="Reportes" />
              
          </q-tabs>
          <q-tab-panels v-model="tab" animated class="">
            <q-tab-panel name="balance">
                <div class="row">
                    <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">  
                        <span class="text-h6 text-weight-bolder">Total Egresos</span> 
                        <span class="text-h6 text-weight-bolder float-right">{{numberFormat2.format(totalEgreso)}}</span> 
                        <br>
                        <span v-if="!anual" class="text-subtitle2 text-weight-bolder">
                          {{ calendario?arrmeses.find(mes => Number(mes.id)== Number(calendario.mes)).value.toUpperCase():'' }} DEL AÑO {{calendario?calendario.anio:''}} 
                        </span>   
                        <span v-else class="text-subtitle2 text-weight-bolder">ANUAL {{buscar.Anio}}  </span>                       
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

            <q-tab-panel name="tabulado" class="">
                <div class="text-h6 text-weight-bolder">
                  REPORTES  
                  <span v-if="!anual"> {{ calendario?arrmeses.find(mes => Number(mes.id)== Number(calendario.mes)).value.toUpperCase():'' }} DEL AÑO {{calendario?calendario.anio:''}}</span>
                  <span v-else> ANUAL {{buscar.Anio}}  </span>
                </div>

                <div class="row">
                    <div class="col-sm-6 col-xs-6  q-pa-sm q-gutter-sm">    
                      <q-select
                            outlined
                            v-model="buscarRep.id"
                            :modelValue="buscarRep.id"
                            emit-value
                            map-options
                            option-label="nombre"
                            option-value="id"
                            :options="arrReportes" 
                            label="Seleccione Reporte"                            
                            behavior="menu"     
                            lazy-rules                 
                        >
                            <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                Sin  resultados
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-select>                  
                    </div>
                  <div class="col-sm-6 col-xs-6  q-pa-sm q-gutter-sm">   
                    <q-btn color="primary" icon="search" label="Mostrar" size="17px" @click="getTabulado" no-caps></q-btn>  
                  </div>   
                  

                  <div class="col-sm-12 col-xs-12">
                    <q-table  
                        
                        :rows="datos" 
                        :columns="columnas" 
                        row-key="id" 
                        binary-state-sort                
                        :pagination="pagination"
                        :filter="filtroT"
                        :fullscreen="inFullscreen"   
                      >

                      <template v-slot:top-right>
                        <div>                          
                            <q-btn  color="primary"  icon="download" label="Exportar" size="14px" @click="exportar(datos,columnas,'qq')"  no-caps></q-btn>  
                            <q-btn  color="primary" :icon="inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="full()" label="Pantalla" size="14px" no-caps></q-btn>   
                        </div>
                      </template>

                      <template v-slot:body="props">
                          <q-tr :props="props">                      
                            <q-td key="calle" class="text-left" :props="props">                                
                              <span v-if="props.row.calle" class="text-subtitle2"> {{props.row.calle}} </span> 
                              <span class="text-subtitle2" v-if="props.row.edificio"> Ed. {{props.row.edificio}},  </span>
                              <span class="text-subtitle2" v-if="props.row.piso"><br> Piso {{props.row.piso}} </span>   
                            </q-td>
                            <q-td key="numeroext" class="text-left" :props="props">                                
                              <span class="text-subtitle2"> {{props.row.numeroext}} </span>   
                            </q-td>
                            <q-td key="numeroint" class="text-left" :props="props">                                
                              <span class="text-subtitle2"> {{props.row.numeroint}} </span>   
                            </q-td>
                            <q-td key="concepto" class="text-left" :props="props">                                
                              <span class="text-subtitle2"> {{props.row.concepto}} </span>   
                            </q-td>
                            <q-td key="anio" class="text-left" :props="props">                                
                              <span class="text-subtitle2"> {{props.row.anio}} </span>   
                            </q-td>
                            <q-td key="mes" :props="props">                       
                              <span class="text-subtitle2" > 
                                {{ arrmeses.find(mes => Number(mes.id)== Number(props.row.mes)).value.toUpperCase() }} 
                              </span>                        
                            </q-td>                            
                            <q-td key="montoapagar" :props="props"> 
                                <span class="text-subtitle2 text-weight-bolder"> {{numberFormat2.format(props.row.montoapagar)}} </span> 
                            </q-td>
                            <q-td key="aprobado" :props="props" class="text-subtitle2">
                                <span class="text-subtitle2" v-if="props.row.aprobado==0"> <q-badge color="negative">CON ADEUDO</q-badge> </span>
                                <span class="text-subtitle2" v-if="props.row.aprobado==1 "> <q-badge color="orange-7">PENDIENTE</q-badge> </span>  
                                <span class="text-subtitle2" v-if="props.row.aprobado==2"> <q-badge color="purple">ADEUDO PARCIAL</q-badge> </span>    
                                <span class="text-subtitle2" v-if="props.row.aprobado==3"> <q-badge color="indigo">RECHAZADO</q-badge> </span>   
                                <span class="text-subtitle2" v-if="props.row.aprobado==4"> <q-badge color="positive">PAGADO</q-badge> </span>
                            </q-td> 
                            <q-td key="aniopago" class="text-left" :props="props">                                
                              <span class="text-subtitle2"> {{props.row.aniopago}} </span>   
                            </q-td>
                            <q-td key="mespago" :props="props">                       
                              <span class="text-subtitle2" > 
                                {{ arrmeses.find(mes => Number(mes.id)== Number(props.row.mespago)).value.toUpperCase() }} 
                              </span>                        
                            </q-td>
                            <q-td key="montopagado" :props="props">
                                <span class="text-subtitle2 text-weight-bolder"> {{numberFormat2.format(props.row.montopagado)}} </span>      
                            </q-td>
                                        
                          </q-tr>
                      </template>

                    </q-table>

                           
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
import { useQuasar, exportFile  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'
import { meses, reportes, exportTable } from '../../../../helpers/utils'
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
    let filtroT= ref('')
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const options2 = { style: 'currency', currency: 'MXN' };
    const numberFormat2 = new Intl.NumberFormat('es-MX', options2);
    const sesion = store.getters['auth/getMe'] 
    const arrmeses = meses
    const arrReportes = reportes
    
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

    let datos = ref([])
    let columnas =ref()
    columnas.value = [
      {name: 'calle', label: 'Domicilio', field: 'calle', align: 'left', format: val => `${val}`, sortable: true}, 
      {name: 'numeroext', label: 'NumExt', field: 'numeroext', align: 'center', format: val => `${val}`, sortable: true}, 
      {name: "numeroint", label: "Numint", field: "numeroint", align: 'center', format: val => `${val}`, sortable: true},  
      {name: 'concepto', label: 'Concepto', field: 'concepto', align: 'left', format: val => `${val}`, sortable: true}, 
      {name: "anio", label: "Año de Adeudo", field: "anio", align: 'left', format: val => `${val}`, sortable: true},  
      {name: "mes", label: "Mes de Adeudo", field: "mes", align: 'left', format: val => `${val}`, sortable: true},         
      {name: "montoapagar", label: "Monto a Pagar", field: "montoapagar", align: 'right', format: val => `${val}`, sortable: true}, 
      {name: 'aprobado', label: 'Estatus', field: 'aprobado', align: 'left', format: val => `${val}`, sortable: true},        
      {name: 'aniopago', label: 'Año de Pago', field: 'aniopago', align: 'left', format: val => `${val}`, sortable: true}, 
      {name: 'mespago', label: 'Mes de Pago', field: 'mespago', align: 'left', format: val => `${val}`, sortable: true}, 
      {name: "montopagado", label: "Monto Pagado", field: "montopagado", align: 'right', format: val => `${val}`, sortable: true},  
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
    let buscarRep = ref({ id:null,nom:''})
    let arrGrafica = ref([['Concepto','Monto']])
    let arrGraficaEgr = ref([['Concepto','Monto']])
    let arrGraficaIng = ref([['Concepto','Monto']])

    let existe = ref(false)
    let inFullscreen = ref(false)

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
      datos.value=[]    
      buscarRep.value.nom = ''   
    }

    const exportar = (dat, col, nom) =>{
      console.log('ENTRA - ',dat)
      exportTable(dat, col, nom+'.csv')
    }

    const getAnual = async () =>{
      anual.value=true
      actualizaEg()          
      actualizaEs()
    }

    const getFecha = async () =>{
      $q.loading.show({ message: 'Espere mientras termina el proceso...' })
      anual.value=false
      let payload = { 
        idconsorcio:sesion.idconsorcio,
        IN:`anio|${buscar.value.Anio}`
        //INA:`mes|${buscar.value.Mes}`
      }  
      if(!anual.value){payload.INA=`mes|${buscar.value.Mes}`} 

      
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
        IN:`anio|${buscar.value.Anio}`
        //INA:`mes|${buscar.value.Mes}`
      }  
      if(!anual.value){payload.INA=`mes|${buscar.value.Mes}`}         
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
        IN:`anio|${buscar.value.Anio}`
        //INA:`mes|${buscar.value.Mes}`
      }  
      if(!anual.value){payload.INA=`mes|${buscar.value.Mes}`}       
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
        IN:`anio|${buscar.value.Anio}`
        //INA:`mes|${buscar.value.Mes}`
      }  
      if(!anual.value){payload.INA=`mes|${buscar.value.Mes}`}        
      try {    
          const jsonI = await api.post('api/selectsadmin/30', payload);     
          let res=jsonI.data.data
          console.log(res,' - ',res.length)
          if(res.length === 1){
            totalInEsperado.value=res[0].pagar   
          } else {
            totalInEsperado.value=res.map((d) => { return d.pagar}).reduce((acc, d) => d + acc)
          }                
          $q.loading.hide()                      
      } catch (e) {
          totalInEsperado.value = 0    
          console.log(e)
          $q.loading.hide()
      }
    }

    const getTabulado = async () => {  
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        datos.value=[]  
        let payload = { 
          idconsorcio:sesion.idconsorcio,
          IN:`aniopago|${buscar.value.Anio}`
        }  
        buscarRep.value.nom = buscarRep.value.id?arrReportes.find(r => Number(r.id)== Number(buscarRep.value.id)).nombre:''
        
        if(!anual.value){payload.INA=`mespago|${buscar.value.Mes}`}        
        console.log('payload - ',payload)
        try {                
            const json = await api.post('api/selectsadmin/31', payload);
            const {data}=json.data
            datos.value=data            
            //limpiar()
            $q.loading.hide() 
            
        } catch (e) {
          datos.value=[]   
          buscarRep.value.nom = ''
          $q.loading.hide() 
          $q.notify({
            position: 'top',
            type: 'negative',
            message: e.response.data.msg
          }) 

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
        pagination: { rowsPerPage: 25 },
        filtros,
        datos,
        columnas,
        dataEgreso,
        columEgreso,
        dataIngreso,
        columIngreso,
        calendario,
        tab: ref('balance'),
        getTabulado,
        getFecha,
        getAnual,
        anual,
        separator: ref('vertical'),
        arrGrafica,
        arrGraficaEgr,
        arrGraficaIng,
        arrReportes,
        buscarRep,

        filtroT,
        inFullscreen,
        full () {
            inFullscreen.value=!inFullscreen.value
        },
        exportar,

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
        },
        filterFn (val, update) {
            if (val === '') {
                update(() => { arrReportes = reportes })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                arrReportes = reportes.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
            })
        },

    }
  }

})

</script>

<style scoped>


</style>

