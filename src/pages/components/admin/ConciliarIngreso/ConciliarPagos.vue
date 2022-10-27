<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
              <span class="text-subtitle2">
                Periodo activo: {{ calendario?arrmeses.find(mes => Number(mes.id)== Number(calendario.mes)).value.toUpperCase():'' }} DEL AÑO {{calendario?calendario.anio:''}}  
              </span>
             
              <q-table  
                title="Conciliación" 
                :rows="datos" 
                :columns="columnas" 
                row-key="id" 
                binary-state-sort                
                :pagination="pagination"
                :filter="filtros"
                :fullscreen="inFullscreen"   
              >
                <!-- <template v-slot:top-right>
                </template> -->

                <template v-slot:top>
                  <q-expansion-item
                    expand-separator
                    icon="manage_search"
                    label="Filtros de busqueda"
                    class="col-sm-12 col-xs-12 text-weight-bolder text-subtitle2"
                  >
                    <div class="row">
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

                        <!-- <q-input outlined label="Fecha inicial" v-model="buscar.fchIni" mask="date" :rules="['date']">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="buscar.fchIni">
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>                                            -->
                      </div>
                      <div class="col-sm-3 col-xs-6  q-pa-sm q-gutter-sm float-right" align="right"> 
                        <!-- <q-input outlined label="Fecha final" v-model="buscar.fchFin" mask="date" :rules="['date']">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="buscar.fchFin">
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input> -->
                          <q-btn
                              color="primary"
                              :icon="inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                              @click="full()"
                              class="q-ml-md"
                          > Pantalla Completa</q-btn>   
                      </div>
                      <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">    
                        <q-select
                              outlined
                              v-model="buscar.bsqDom"
                              :modelValue="buscar.bsqDom"
                              emit-value
                              map-options
                              use-input
                              option-label="nombre"
                              option-value="nombre"
                              :options="options.ops" 
                              label="Buscar Calle/Edificio/Torre/Privada"                            
                              behavior="menu"    
                              @filter="filterFn"   
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
                      <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">    
                        <q-select
                              outlined
                              v-model="buscar.bsqEst"
                              :modelValue="buscar.bsqEst"
                              emit-value
                              map-options
                              use-input
                              option-label="nombre"
                              option-value="id"
                              :options="optionsE.ops" 
                              label="Buscar por Estatus"                            
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
                      <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">    
                        <q-select
                              outlined
                              v-model="buscar.bsqIn"
                              :modelValue="buscar.bsqIn"
                              emit-value
                              map-options
                              use-input
                              option-label="categoria"
                              option-value="idconceptoingreso"
                              :options="optionsI.ops" 
                              label="Buscar por Concepto de Ingreso"                            
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
                      <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">   
                        <q-input
                            outlined
                            v-model="buscar.bsqNom"
                            :modelValue="buscar.bsqNom" 
                            @update:modelValue="val => buscar.bsqNom = val.toUpperCase()"
                            label="Buscar por Nombre"
                        >
                        </q-input> 
                      </div>
                      <div class="col-sm-4 col-xs-6  q-pa-sm q-gutter-sm">   
                        <q-btn outline  color="primary" icon="search" label="Buscar por filtros" @click="getCategorias" no-caps></q-btn>  
                      </div>
                      <div class="col-sm-4 col-xs-6  q-pa-sm q-gutter-sm">   
                        <q-btn outline  color="primary" icon="clear_all" label="Limpiar los filtros" @click="limpiar" no-caps></q-btn>  
                      </div>
                      <div class="col-sm-4 col-xs-6  q-pa-sm q-gutter-sm">   
                        <q-btn  outline color="primary" icon="list" label="Listado del mes" @click="mesActual" no-caps></q-btn>  
                      </div>

                      <div class="q-pa-sm q-gutter-sm">
                        <q-dialog v-model="show_dialog" :maximized="true">
                          <q-card>
                            <q-card-section>
                              <div>
                                <span class="text-h6"> {{tituloDialg}}</span>
                                <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
                              </div>
                            </q-card-section>

                            <q-card-section>
                              <div class="row">
                                <div class="col-sm-12 col-xs-12  q-pa-sm q-gutter-sm">    
                                  <q-list bordered>
                                    <q-item>
                                      <q-item-section > 
                                          <span class="text-weight-bold text-h6 flex-right ">
                                            ESTATUS:  <span v-if="domicilio.aprobado==0" class="text-negative">CON ADEUDO</span>
                                                      <span v-if="domicilio.aprobado==1" class="text-orange-7">PENDIENTE</span> 
                                                      <span v-if="domicilio.aprobado==2" class="text-purple">ADEUDO PARCIAL</span>
                                                      <span v-if="domicilio.aprobado==3" class="text-negative">RECHAZADO</span>
                                                      <span v-if="domicilio.aprobado==4" class="text-positive">PAGADO</span>
                                          </span>
                                              
                                          <div class="row">
                                            <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm"> 
                                              <q-input
                                                class="text-weight-bold"
                                                type="number"
                                                step="any"
                                                outlined
                                                prefix="$"
                                                v-model="domicilio.zpago"
                                                :modelValue="domicilio.zpago" 
                                                label="Monto de Pago"
                                                @update:modelValue="val => domicilio.zpago = Number(val)"
                                              />
                                            </div>
                                            <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm"> 
                                              <q-select
                                                    outlined
                                                    v-model="domicilio.formapago"
                                                    :modelValue="domicilio.formapago"
                                                    emit-value
                                                    map-options
                                                    option-label="descripcion"
                                                    option-value="id"
                                                    :options="optionsF.ops" 
                                                    label="Seleccionar Forma de Pago"                            
                                                    behavior="menu"     
                                                    lazy-rules                  
                                                >
                                                </q-select> 
                                            </div>
                                          </div>
                                          <span v-if="domicilio.zpago==0" class="text-weight-bold text-negative"> * El monto es igual a cero (0), si es correcto continue.</span> 
                                          <span v-if="domicilio.formapago==null" class="text-weight-bold text-negative"> * DEBE SELECCIONAR UNA FORMA DE PAGO PARA CONTINUAR.</span> 
                                          <span v-if="domicilio.zpago > domicilio.pagar && domicilio.aprobado!= 1 && domicilio.aprobado!= 4" class="text-weight-bold text-negative"> * El monto de pago es Mayor al del Adeudo, si es correcto continue.</span> 
                                          <span class="text-weight-bold text-blue-grey-8"> Recuerde que el MONTO DE PAGO debe coincidir con el valor de sus COMPROBANTES de pago.</span>                                           
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                  <q-separator color="primary" /> 
                                  <q-list bordered>
                                      <q-item  class="q-my-sm">  
                                          <q-item-section>  
                                              <span v-if="!domicilio.ruta1" class="text-weight-bold text-negative"> 
                                                * Este concepto no tiene comprobante de pago, si es un pago en efectivo puede omitir este mensaje y continuar o puede tomar una evidencia de pago.
                                                <q-file clearable color="white" bg-color="primary" class="vertical-bottom text-white text-weight-bold"
                                                        standout bottom-slots v-model="domicilio.ruta1" label="Agregar Comprobante de Pago" size="35px"
                                                        counter @change="SubirArch(domicilio.ruta1,index,domicilio)" accept=".jpg, .pdf, image/*" >

                                                    <template class="text-weight-bold" v-slot:prepend bg-color="primary" >
                                                    <q-icon name="photo_camera" />
                                                    </template>
                                                    <template class="text-weight-bold" v-slot:append bg-color="primary" >                           
                                                    </template>
                                                </q-file>   
                                              </span>  
                                              <span v-else> 
                                                <q-btn v-if="domicilio.ruta1" @click="verDoc(domicilio)" icon="image" color="teal" label="Revisar Comprobante " />
                                              </span>                                             
                                          </q-item-section>                                    
                                      </q-item>
                                  </q-list>
                                  

                                  <q-list v-if="lstPagos.length > 0" bordered>
                                      <q-item  >  
                                          <q-item-section>  
                                              <q-separator color="primary" />
                                               <q-table
                                                  title="Pagos de este concepto"
                                                  :rows="lstPagos"
                                                  :columns="colpag"
                                                  row-key="name"
                                                >
                                                  <template v-slot:body="props">
                                                    <q-tr :props="props"> 
                                                      <q-td key="edita" :props="props"> 
                                                         <q-icon name="edit" size="25px" color="teal"  v-if="props.row.hide" outline  @click="props.row.hide=!props.row.hide"  />
                                                         <q-icon name="cancel" size="25px" color="red"   v-else  @click="props.row.hide=!props.row.hide"  />
                                                       
                                                      </q-td>
                                                      <q-td key="mes" :props="props">
                                                        <span class="text-subtitle2 text-weight-bolder text" >  {{ arrmeses.find(m => Number(m.id)== Number(props.row.mes)).value.toUpperCase() }}</span>                
                                                      </q-td>                     
                                                      <q-td key="anio" :props="props">  
                                                       <span class="text-subtitle2 text-weight-bolder text" > {{props.row.anio}}  </span> 
                                                      </q-td>
                                                      <q-td key="monto" :props="props"> 
                                                        <q-input
                                                          style="max-width: 160px; min-width: 160px;"
                                                          type="number"
                                                          step="any"
                                                          outlined
                                                          prefix="$"
                                                          v-model="props.row.monto"
                                                          :modelValue="props.row.monto" 
                                                          label="MXN"
                                                          @update:modelValue="val => props.row.monto = Number(val)"
                                                          :disable="props.row.hide"
                                                        >
                                                          <template v-slot:after>
                                                            <q-btn round dense flat v-if="!props.row.hide" outline icon="save" color="blue"  size="20px" @click="editaDet(props.row)"  />
                                                          </template>
                                                        </q-input>

                                                        <!-- <span class="text-subtitle2 text-weight-bolder text" > {{numberFormat2.format(props.row.monto)}} </span>  -->
                                                         
                                                      </q-td>
                                                      
                                                    </q-tr>
                                                  </template>
                                               </q-table>
                                           </q-item-section>                                    
                                      </q-item>
                                  </q-list> 
                                 <q-separator color="primary" /> 
                                  
                                  <q-list bordered>
                                      <q-item  class="q-my-sm">  
                                          <q-item-section>  
                                              <q-item-label class="text-h6 text-weight-bold text-teal"> {{ domicilio.categoria }} </q-item-label>
                                              <q-item-label class="text-h6 text-teal">{{ arrmeses.find(mes => Number(mes.id)== Number(domicilio.mes)).value.toUpperCase() }} {{ domicilio.anio }}</q-item-label>
                                              <q-item-label class="text-h6 " > Monto de adeudo:
                                                <span v-if="domicilio.aprobado===1" > {{ numberFormat2.format(domicilio.montodepago)  }}</span>  
                                                <span v-else> {{ numberFormat2.format(domicilio.pagar)  }}</span> 
                                              </q-item-label>
                                              <q-item-label class="text-h6 " > Monto de pago: <span class="text-weight-bold"> {{ numberFormat2.format(domicilio.zpago)  }}</span> </q-item-label>                                              
                                          </q-item-section>                                    
                                      </q-item>
                                  </q-list> 
                                </div>
                                 <q-separator color="primary" /> 
                                 <div class="col-sm-12 col-xs-12  q-pa-sm q-gutter-sm">
                                  <span class="text-weight-bolder text-blue-grey-8"> SELECCIONE EL ESTATUS DE PAGO DESPUES DE VERIFICAR EL MONTO DEL COMPROBANTE O EL EFECTIVO.</span><br> 
                                  <!-- <span class="text-weight-medium text-positive"> Pagado - Cuando se cubre la totalidad de la cuota asignada al concepto.</span> <br>
                                  <span class="text-weight-medium text-purple"> Parcial - Cuando se cubre  una parte de la cuota asignada al concepto.</span> <br>
                                  <span class="text-weight-medium text-negative"> Rechazo - Cuando no se cuenta con un comprobante valido.</span>  -->
                                 </div>
                                <div class="col-sm-4 col-xs-4  q-pa-sm q-gutter-sm">
                                    <q-btn v-if="domicilio.formapago" outline icon="check_circle" color="positive" label="Pagado" v-close-popup @click="confirmaePago('Pagado',4)" >  </q-btn>   
                                </div>
                                <div class="col-sm-4 col-xs-4  q-pa-sm q-gutter-sm"> 
                                    <q-btn v-if="domicilio.formapago" outline icon="check_circle" color="purple" label="Parcial" v-close-popup @click="confirmaePago('Pagado Parcial',2)" >  </q-btn>                                      
                                </div>
                                <div class="col-sm-4 col-xs-4  q-pa-sm q-gutter-sm">                                   
                                    <q-btn v-if="domicilio.formapago" outline icon="check_circle" color="negative" label="Rechazo" v-close-popup @click="confirmaePago('Rechazado',3)" >  </q-btn>                                   
                                </div>
                              </div>
                            </q-card-section>
                            
                            <q-card-actions align="right">
                              <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                            </q-card-actions>
                          </q-card>
                        </q-dialog>
                      </div>   

                    </div>
                  </q-expansion-item>
                </template>

                
                <template v-slot:body="props">
                    <q-tr :props="props"> 
                      <q-td key="pago" :props="props">
                         <q-btn outline rounded color="teal"  @click="editDom(props.row)" size="md" no-caps>Pago</q-btn>                 
                      </q-td>                     
                      <q-td key="calle" class="text-left" :props="props">   
                        
                        <span v-if="props.row.calle" class="text-subtitle2"> <q-icon name="apartment" size="25px" color="primary" /> {{props.row.calle}} #{{props.row.numeroext}} {{props.row.numeroint}} </span> 
                        <span class="text-subtitle2" v-if="props.row.nombre">, Piso {{props.row.piso}} </span><br>      
                        <span class="text-subtitle2" v-if="props.row.nombre"><q-icon name="person" size="25px" color="primary" /> {{props.row.nombre}} {{props.row.paterno}} {{props.row.materno}}</span>
                      </q-td>
                      <q-td key="aprobado" :props="props" class="text-subtitle2">
                          <span class="text-subtitle2" v-if="props.row.aprobado==0"> <q-badge color="negative">CON ADEUDO</q-badge> </span>
                          <span class="text-subtitle2" v-if="props.row.aprobado==1 "> <q-badge color="orange-7">PENDIENTE</q-badge> </span>  
                          <span class="text-subtitle2" v-if="props.row.aprobado==2"> <q-badge color="purple">ADEUDO PARCIAL</q-badge> </span>    
                          <span class="text-subtitle2" v-if="props.row.aprobado==3"> <q-badge color="indigo">RECHAZADO</q-badge> </span>   
                          <span class="text-subtitle2" v-if="props.row.aprobado==4"> <q-badge color="positive">PAGADO</q-badge> </span>
                      </q-td> 
                      <q-td key="montoapagar" :props="props">
                          <span class="text-subtitle2"> 
                            {{numberFormat2.format(props.row.montoapagar)}}<br> 
                            {{props.row.categoria}}                          
                          </span>     
                      </q-td>
                      <q-td key="periodo" :props="props">                       
                        <span class="text-subtitle2" > 
                          {{ props.row.periodo }} - {{ arrmeses.find(mes => Number(mes.id)== Number(props.row.mes)).value.toUpperCase() }} 
                        </span>                        
                      </q-td> 
                      <q-td key="montodepago" :props="props"> 
                          <span class="text-subtitle2 text-weight-bolder text-PAGADO" v-if="props.row.aprobado==4"> {{numberFormat2.format(props.row.montodepago)}} </span>
                          <span class="text-subtitle2 text-weight-bolder text" v-else> {{numberFormat2.format(props.row.montodepago)}} </span> 

                      </q-td>
                      <q-td key="pagar" :props="props">
                        <span class="text-subtitle2 text-weight-bolder text-negative" v-if="props.row.aprobado==0"> {{numberFormat2.format(props.row.pagar)}}</span>
                          <span class="text-subtitle2 text-weight-bolder text-orange-8" v-if="props.row.aprobado==1 "> {{numberFormat2.format(props.row.pagar)}}</span>  
                          <span class="text-subtitle2 text-weight-bolder text-purple" v-if="props.row.aprobado==2"> {{numberFormat2.format(props.row.pagar)}}</span>    
                          <span class="text-subtitle2 text-weight-bolder text-negative" v-if="props.row.aprobado==3"> {{numberFormat2.format(props.row.pagar)}} </span>   
                          <span class="text-subtitle2 text-weight-bolder text-PAGADO" v-if="props.row.aprobado==4"> {{numberFormat2.format(props.row.pagar)}} </span>    
                      </q-td> 
                      <q-td key="ruta1" :props="props">
                         <q-btn v-if="props.row.ruta1" icon="description" outline rounded color="teal"  @click="verDoc(props.row)" size="md" no-caps></q-btn>                 
                      </q-td>                    
                    </q-tr>
                </template>
              </q-table>

              <q-dialog v-model="show_doc" :maximized="true">
                  <q-card>
                    <q-card-section>
                      <div>
                        <span class="text-h6">Comprobante de Pago</span>
                        <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
                      </div>      
                    </q-card-section>
                    <q-card-section>

                      <div v-if="tipoDoc==='Doc'" class="q-pa-md q-gutter-sm"  style="height: 700px;">
                        <q-pdfviewer
                          type="html5"
                          :src="pdfSrc"
                        />
                      </div>

                      <div v-if="tipoDoc==='Img'">
                        <q-img style="max-height: 700px; max-width: 600px" :src="imgDoc" spinner-color="primary" ></q-img>
                      </div>

                    </q-card-section>
                    <q-card-actions align="right">
                          <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                        </q-card-actions>
                  </q-card>
              </q-dialog>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>

import { useStore } from 'vuex'
import { useQuasar, QSpinnerGears  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'
import { meses, estatus } from '../../../../helpers/utils'
const moment = require('moment');

export default defineComponent({
  name: "ingresos",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    let filtros= ref('')
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const options2 = { style: 'currency', currency: 'MXN' };
    const numberFormat2 = new Intl.NumberFormat('es-MX', options2);
    const sesion = store.getters['auth/getMe'] 
    const arrmeses=meses

    let calendario= ref(null)
    let buscar = ref({
      bsqDom:null,
      bsqEst:null,
      bsqIn:null,
      bsqNom:null,
      Anio:null,
      Mes:null,
      fchIni:null,//moment(new Date(Date.now())).format("yyyy/MM/D"),
      fchFin:null//moment(new Date(Date.now())).format("yyyy/MM/D")
    })
    let show_dialog = ref(false)
    let show_doc = ref(false)
    let pdfSrc = ref()
    let tipoDoc = ref(null)
    let imgDoc=ref('')
    let extensionesImg = ['png','jpg','jpeg','gif']
    let extensionesDoc = ['pdf']
    let datos = ref([])
    let lstPagos  = ref([])
    let colpag =ref()
    colpag.value = [
      {name: "edita", label: "", field: "edita", align: 'left'}, 
      {name: "mes", label: "Mes Pago", field: "mes", align: 'left', format: val => `${val}`, sortable: true},
      {name: 'anio', label: 'Año Pago', field: 'anio', align: 'left', format: val => `${val}`, sortable: true}, 
      {name: "monto", label: "Monto", field: "monto", align: 'left', format: val => `${val}`, sortable: true},       
    ];

    let columnas =ref()
    columnas.value = [
      {name: "pago", label: "", field: "pago", align: 'center'},
      {name: 'calle', label: 'Domicilio', field: 'calle', align: 'left', format: val => `${val}`, sortable: true}, 
      {name: "aprobado", label: "Estatus", field: "aprobado", align: 'left', format: val => `${val}`, sortable: true},   
      {name: "montoapagar", label: "Monto Concepto", field: "montoapagar", align: 'left', format: val => `${val}`, sortable: true},  
      {name: 'periodo', label: 'Periodo', field: 'periodo', align: 'left', format: val => `${val}`, sortable: true},   
      {name: "montodepago", label: "Monto Pagado", field: "montodepago", align: 'left', format: val => `${val}`, sortable: true},  
      {name: "pagar", label: "Adeudo", field: "pagar", align: 'left', format: val => `${val}`, sortable: true},  
      {name: "ruta1", label: "Comprobante", field: "ruta1", align: 'center', sortable: true},  
    ];

    let rows = ref([])
    let columns = ref([])

    let tituloDialg= ref(' CONCILIAR PAGO ')
    let inFullscreen = ref(false)
    let domicilioIndex = ref(-1)
    let domicilio = ref({            
        idconsorcio: sesion.idconsorcio,
        categoria:null,
        formapago:null,
        pagar:null,
        montodepago:0,
        zpago:0,
        ruta1:null,
        mes:null,
        anio:null
      })
    let defaultDomicilio = ref({            
        idconsorcio: sesion.idconsorcio,
        categoria:null,
        formapago:null,
        pagar:null,
        montodepago:0,
        zpago:0,
        ruta1:null,
        mes:null,
        anio:null
      })

    let arrVal=[] , arrValI=[]
    let options = reactive({ ops: null}) 
    let optionsI = reactive({ ops: null }) 
    let optionsE = reactive({
        ops: [
              {id:0,nombre:'CON ADEUDO'},
              {id:1,nombre:'PENDIENTE'},
              {id:2,nombre:'ADEUDO PARCIAL'},
              {id:3,nombre:'PAGADO'},
            ],
    })  
    let optionsAI = reactive({ ops: null })   
    let optionsMI = reactive({ ops: null })  
    let optionsF = reactive({ ops: null })

    const editaDet = async (item) => {  
        console.log(item)
        const indiceDet= lstPagos.value.indexOf(item) 
        let total = lstPagos.value.map((d) => { return d.monto}).reduce((acc, d) => d + acc)
        let payload = { 
          montodepago: total,
          ultimopago: total
        }  
        let payloadI = { 
          monto: item.monto
        }
        console.log(domicilio.value, ' -  ',total, '  -  ' ,lstPagos.value)
        $q.dialog({
              title: 'Confirmación de modificación de monto.',
              message: `¿Esta usted seguro de modificar el monto del mes de <b>${arrmeses.find(mes => Number(mes.id)== Number(item.mes)).value.toUpperCase()}</b> 
                        del año <b>${item.anio} </b> por un monto de <b>${ Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(item.monto)}</b>, 
                        RECUERDE QUE ESTA MODIFICACIÖN SE REFLEJARA EN EL BALANCE. `,
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
                label: 'REGRESAR',
                icon: 'cancel'
              },
              persistent: true
            }).onOk( async() => {
                const pago = await api.put(`api/updates/${item.idingreso}/14`, payload);  
                const pagoIn = await api.put(`api/updates/${item.id}/26`, payloadI);
                await Promise.all([pago,pagoIn]).then(async (res) => {
                  
                  const ing = res[0].data.data
                  console.log(ing[0])
                  lstPagos.value[indiceDet].hide=true
                  datos.value[domicilioIndex.value].pagar = ing[0].montoapagar - ing[0].montodepago                 
                  datos.value[domicilioIndex.value].zpago = ing[0].montoapagar - ing[0].montodepago
                  datos.value[domicilioIndex.value].montodepago = ing[0].montodepago 

                  $q.notify({
                      position: 'top',
                      type: 'positive',
                      message: 'Se ha actualizado el registro correctamente.'
                  })  
                }); 
            }).onCancel(() => {
            }).onDismiss(() => {                
            }) 
    }
    

    const editDom = async (item) => {  
      try {    
          console.log(item , '   -    ' , datos.value.indexOf(item) )
          domicilioIndex.value = datos.value.indexOf(item)          
          domicilio.value=item
          domicilio.value.zpago=item.aprobado==1? item.montopendiente:item.montoapagar - item.montodepago
          //
          console.log(domicilioIndex.value)
          let payload = { 
            "idingreso": item.IdIngreso
          } 
          const json = await api.post('api/selectsadmin/26', payload);
          const {data}=json.data
          data.map((d)=>{d.hide=true;})

          lstPagos.value=data
          console.log(data)
          show_dialog.value = true

      } catch (e) {
        show_dialog.value = true
        lstPagos.value=[]
      }        
    }

    const confirmaePago = async (estatus, aprobado)=>{
      $q.dialog({
              title: 'Confirmación de conciliación de Pago',
              message: `¿Esta usted seguro de marcar como <b>${estatus}</b> el mes de <b>${arrmeses.find(mes => Number(mes.id)== Number(domicilio.value.mes)).value.toUpperCase()}</b> 
                        del año <b>${domicilio.value.anio}</b> por el concepto de 
                        <b>${domicilio.value.categoria}</b> por un monto de <b>${ aprobado==3?'$ 0':Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(domicilio.value.zpago)}</b>,
                        para el domicilio <b>${domicilio.value.calle} #${domicilio.value.numeroext?domicilio.value.numeroext:''} ${domicilio.value.numeroint?domicilio.value.numeroint:''} 
                        ${!domicilio.value.numeroalf?'':domicilio.value.numeroalf} ${domicilio.value.piso?'Piso '+domicilio.value.piso:''}</b>. `,
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
                label: 'REGRESAR',
                icon: 'cancel'
              },
              persistent: true
            }).onOk(() => {
                console.log('GOLES')
                addDom(aprobado)
            }).onCancel(() => {
              show_dialog.value = true
            }).onDismiss(() => {  })  
    }

    const addDom = async (aprobado)=>{
      let ultimo =  0
      console.log(domicilio.value.aniopago,'==',Number(moment(new Date(Date.now())).format("YYYY")) ,' -  ',domicilio.value.mespago,'==',Number(moment(new Date(Date.now())).format("M")) )
      if(domicilio.value.aniopago==Number(moment(new Date(Date.now())).format("YYYY")) && domicilio.value.mespago==Number(moment(new Date(Date.now())).format("M")) ){        
        ultimo = domicilio.value.zpago + domicilio.value.montodepago
      } else{
        ultimo = domicilio.value.zpago
      }
      console.log(ultimo)

      try {
        if (domicilio.value.IdIngreso) {     
          let payload = { 
            montodepago:aprobado==3?0:domicilio.value.montodepago>0?domicilio.value.zpago + domicilio.value.montodepago:domicilio.value.zpago,
            aprobado:aprobado,
            formapago:domicilio.value.formapago,
            idaprobador:sesion.id,
            montopendiente:0,
            aniopago:domicilio.value.aniopago?domicilio.value.aniopago:Number(moment(new Date(Date.now())).format("YYYY")),
            mespago:domicilio.value.mespago?domicilio.value.mespago:Number(moment(new Date(Date.now())).format("M")),
            ultimopago:aprobado==3?0:ultimo,
          }  
         console.log(payload, '   -   ', domicilioIndex.value) 
          const pago = await api.put(`api/updates/${domicilio.value.IdIngreso}/14`, payload);        
          await Promise.all([pago]).then(async (res) => {
              const egr = res[0].data.data
              let payloadI = { 
                monto:aprobado==3?0:domicilio.value.zpago,
                anio:Number(moment(new Date(Date.now())).format("YYYY")),
                mes:Number(moment(new Date(Date.now())).format("M")),
                idingreso:egr[0].id,
              } 

              const transaccion = await api.put(`api/inserts/26`, payloadI); 
              await Promise.all([transaccion]).then(function async (trans) {

                datos.value[domicilioIndex.value].pagar=egr[0].montoapagar - egr[0].montodepago
                datos.value[domicilioIndex.value].montodepago=egr[0].montodepago
                datos.value[domicilioIndex.value].aprobado=egr[0].aprobado
                datos.value[domicilioIndex.value].formapago=egr[0].formapago
                datos.value[domicilioIndex.value].idaprobador=egr[0].idaprobador
                datos.value[domicilioIndex.value].mespago=egr[0].mespago
                datos.value[domicilioIndex.value].aniopago=egr[0].aniopago
                datos.value[domicilioIndex.value].zpago=egr[0].montoapagar - egr[0].montodepago
                
                console.log(datos.value[domicilioIndex.value])
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha actualizado el registro correctamente.'
                })      
                close()  
              }); 
              
          });          
        }  
      } catch (error) {
          close() 
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          }) 
          
      }        
    }

    const verDoc= async (arr) => { 
      try {  
          show_doc.value=true
          const comprobante = arr
          console.log(comprobante)
          const nombreCortado = comprobante.ruta1.split('.');
          const extension = nombreCortado[ nombreCortado.length - 1 ];
          const json = await api.get(`api/uploads/14/${comprobante.IdIngreso}/pagos/ruta1`,{responseType: 'blob' });
          const {data}=json
          const urlCreator = window.URL || window.webkitURL

          if ( !extensionesImg.includes( extension ) ) {
            tipoDoc.value="Doc" 
            console.log(data)
            pdfSrc.value=urlCreator.createObjectURL(new Blob([data], { type: `application/${extension}` }))   
          } else{
            tipoDoc.value="Img" 
            imgDoc.value=urlCreator.createObjectURL(new Blob([data], { type: `image/${extension}` }))
          }     
      } catch (e) {        
          $q.notify({
            position: 'top',
            type: 'negative',
            message: e// e.response.data.msg
          }) 
      }      
    }
  
    const close = ()=>{
      show_dialog.value = false
      setTimeout(() => {
        domicilio.value = Object.assign({}, defaultDomicilio.value)
        domicilioIndex.value = -1        
      }, 300)
    }

    const limpiar = ()=>{
      buscar.value.bsqDom=null
      buscar.value.bsqEst=null
      buscar.value.bsqNom=null
      buscar.value.bsqIn=null
      buscar.value.Mes=null
      buscar.value.Anio=null
      buscar.value.fchIni=null
      buscar.value.fchFin=null
    }

    const mesActual = ()=>{
      buscar.value.Anio=calendario.value.anio   
      buscar.value.Mes=calendario.value.mes
      getCategorias()
    }
   
    const getCategorias = async () => {  
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        datos.value=[]  
        let payload = { 
          "idconsorcio": sesion.idconsorcio
        }  

        if(buscar.value.bsqDom){payload.calle=buscar.value.bsqDom }
        if(buscar.value.bsqNom){payload.nombre=buscar.value.bsqNom } 
        if(buscar.value.Anio){payload.anio=Number(buscar.value.Anio) } 
        if(buscar.value.Mes){payload.mes=Number(buscar.value.Mes) } 
        if(buscar.value.bsqIn){payload.idconceptoingreso=Number(buscar.value.bsqIn) } 
        if(buscar.value.bsqEst){payload.aprobado=Number(buscar.value.bsqEst) } 
        //if(buscar.value.fchIni && buscar.value.fchFin){payload.createdAt=buscar.value.fchIni } 
       
        try {                
            const json = await api.post('api/selectsadmin/23', payload);
            const {data}=json.data
            datos.value=data            
            //limpiar()
            $q.loading.hide() 
        } catch (e) {
          limpiar()
          $q.loading.hide() 
          $q.notify({
            position: 'top',
            type: 'negative',
            message: e.response.data.msg
          }) 

        }
    }

    const createStoreDoc = async (img,index,arr) => { 
        try { 
            let formData = new FormData();
            formData.append('archivo', img);
            const comprobante = arr
            const imgs = await api.post(`api/uploads/14/${comprobante.IdIngreso}/pagos/ruta1`, formData)  
            Promise.all([imgs]).then((responses) => {
                const {data} = responses[0]
                console.log(domicilioIndex.value, '   -   ' ,data[0]);  
                arr.ruta1 =  data[0].ruta1
                console.log('ARR  -  ',comprobante)  
                domicilio.value.ruta1=data[0].ruta1  
                datos.value[domicilioIndex.value].ruta1=data[0].ruta1
                formData.value=[]     
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha guardo el comprobante de pago con exito.'
                })   
                console.log(domicilio.value)
                console.log(datos.value)
            });
        } catch (error) {
            $q.notify({
                position: 'top',
                type: 'negative',
                message: 'No se ha poddio guardar la información intentelo de nuevo.'
            }) 
        }             
    }

    const getInicial = async () => {  
        let payload = { "idconsorcio":sesion.idconsorcio}            
        let payloadI = { 
          "idconsorcio": sesion.idconsorcio,
          "tipo": "ingresos"
          }   
        try {    
            const jsonC = await api.post('api/selects/1/4', payload);
            calendario.value=jsonC.data.data[0]   
            buscar.value.Mes=jsonC.data.data[0].mes  
            buscar.value.Anio=jsonC.data.data[0].anio 

            const json = await api.post('api/selectsadmin/1', payload);
            const {data}=json.data
            arrVal = data    
            options.ops = data  

            const jsonI = await api.post('api/selectsadmin/6', payloadI);
            arrValI=jsonI.data
            optionsI.ops = jsonI.data.data 

            const jsonA = await api.post('api/selectsadmin/25', payload);
            optionsAI.ops = jsonA.data.data

            const jsonM = await api.post('api/selectsadmin/24', payload);
            let mensual =jsonM.data.data
            mensual.map((m)=>{ m.nombre=arrmeses.find(item => item.idM === m.mes).value }) 
            optionsMI.ops =  mensual

            const jsonF = await api.post('api/selects/1/8',  {"visible":1});
            optionsF.ops = jsonF.data.data
            
            $q.loading.hide()                      
        } catch (e) {
            console.log(e)
        }
    }
    
    onMounted( async() =>{
        getInicial()    
        $q.loading.hide()      
    }) 

    return {
        arrmeses,
        numberFormat2,
        calendario,
        limpiar,
        mesActual,
        optionsF,
        verDoc,
        show_doc,
        pdfSrc,
        tipoDoc,
        imgDoc,
        SubirArch: async (img,index,arr) => {
          createStoreDoc(img,index,arr)
        },

        close,
        getCategorias,
        columnas,
        datos: computed( () => datos.value),
        tituloDialg,
        filtros,
        buscar: computed( () => buscar.value),   

        show_dialog,        
        domicilioIndex,
        domicilio: computed( () => domicilio.value),
        defaultDomicilio,
        editDom,
        confirmaePago,
        lstPagos,
        colpag,
        editaDet,

        pagination: { rowsPerPage: 5 },
        options,
        optionsI,
        optionsE,
        optionsMI,
        optionsAI,
        inFullscreen,
        full () {
            inFullscreen.value=!inFullscreen.value
        },
        filterFn (val, update) {
            if (val === '') {
                update(() => { options.ops = arrVal })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                options.ops = arrVal.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
            })
        },
    }
  }
})

</script>

<style scoped>

.zip-input input {
    height: 150px;
    width: 200px;
}

</style>


