<template>

    <q-page>    
        <div class="fondo1">
            <q-card class="esqredonda">
                     <q-stepper
                        v-model="step"
                        vertical
                        color="primary"
                        animated
                        >
                        <q-step
                            :name="1"
                            title="Estado general de adeudos."
                            icon="settings"
                            :done="step > 1"
                        >                            
                                <q-timeline color="grey">
                                    <q-timeline-entry  
                                        class="text-h5" 
                                        body="Estatus de Pagos" />

                                    <q-timeline-entry
                                        v-if="totalAdeudo"
                                        title="Saldo deudor sin pago."
                                        color="negative"
                                        subtitle="Febrero 01, 2022"
                                        icon="warning"
                                        :body="numberFormat2.format(totalAdeudo)"
                                    />

                                    <q-timeline-entry 
                                        v-if="totalPendiente"
                                        title="Monto con aprobación en proceso"
                                        color="orange"
                                        subtitle="Febrero 15, 2022"
                                        icon="swap_vert"
                                        :body="numberFormat2.format(totalPendiente)"

                                    />
                                    <q-timeline-entry 
                                        v-if="totalParcial"
                                        title="Monto con pago parcial"
                                        color="purple"
                                        subtitle="Febrero 15, 2022"
                                        icon="swap_vert"
                                        :body="numberFormat2.format(totalParcial)"

                                    />
            
                                    <q-timeline-entry
                                        v-if="pagado"                        
                                        title="Pagado"
                                        subtitle="Febrero 17, 2022"
                                        color="green"
                                        icon="done_all"
                                        :body="pagado"
                                    />
                                </q-timeline>

                            <q-stepper-navigation>
                            <q-btn @click="step = 2" color="primary" label="Iniciar Proceso de Pago" />
                            </q-stepper-navigation>
                        </q-step>

                        <q-step
                            :name="2"
                            title="Seleccionar adeudos a pagar."
                            icon="create_new_folder"
                            :done="step > 2"
                        >
                            <q-table 
                                title="Adeudos" 
                                :rows="datos" 
                                :columns="columnas" 
                                row-key="id" 
                                :selected-rows-label="getSelectedString"
                                selection="multiple"
                                v-model:selected="selected"
                                :filter="filter"
                                :pagination="pagination"
                                :fullscreen="inFullscreen"                                
                            >

                                <template v-slot:top-right>
                                    <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Buscar en Tabla">
                                        <template v-slot:append>
                                        <q-icon name="manage_search"/>
                                        </template>
                                    </q-input><br>

                                    <q-btn
                                        color="primary"
                                        :icon="inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                                        @click="full()"
                                        class="q-ml-md"
                                    > Pantalla</q-btn>                                
                                </template>

                                <template v-slot:body="props">
                                    <q-tr :props="props"> 
                                        <q-td key="selected" :props="props" class="text-h6">
                                            <q-checkbox v-if="props.row.pagar!=0" dense v-model="props.selected" />
                                        </q-td>

                                        <q-td key="id" :props="props" class="text-h6">
                                            {{ props.row.id }}
                                        </q-td>                        
                                        <q-td key="describe" :props="props" class="text-subtitle2">
                                            <span class="text-subtitle2" > {{props.row.categoria}} {{ arrmeses.find(mes => Number(mes.id)== Number(props.row.mes)).value.toUpperCase() }} {{props.row.anio}}</span><br>
                                            <span class="text-subtitle2" v-if="props.row.aprobado==0"> <q-badge color="negative"> CON ADEUDO</q-badge> </span>
                                            <span class="text-subtitle2" v-if="props.row.aprobado==1 "> <q-badge color="orange">PENDIENTE DE VALIDAR</q-badge> </span>  
                                            <span class="text-subtitle2" v-if="props.row.aprobado==2"> <q-badge color="purple">ADEUDO PARCIAL</q-badge> </span>    
                                            <span class="text-subtitle2" v-if="props.row.aprobado==3"> <q-badge color="negative"><q-icon name="warning"></q-icon> RECHAZADO</q-badge> </span>   
                                            <span class="text-subtitle2" v-if="props.row.aprobado==4"> <q-badge color="positive">PAGADO</q-badge> </span>
                                        </q-td>                                
                                        <q-td key="montoapagar" :props="props" class="text-subtitle2">{{ numberFormat2.format(props.row.montoapagar)  }}</q-td>
                                        <q-td key="periodo" :props="props" class="text-subtitle2">{{props.row.anio}}/{{ props.row.mes }}</q-td>
                                        <q-td key="pagar" :props="props" class="text-subtitle2">{{ numberFormat2.format(props.row.pagar)  }}</q-td>
                                        
                                        <!-- 
                                        <q-td key="actions" :props="props">
                                            <q-btn color="blue" label="Editar" @click="editItem(props.row)" size="md" no-caps></q-btn>
                                            <q-btn color="red" label="Borrar"  @click="deleteItem(props.row)" size="md" no-caps></q-btn>
                                        </q-td>
                                        -->
                                    </q-tr>
                                </template>
                            </q-table>

                            <q-stepper-navigation>
                            <q-btn @click="step = 3" color="primary" label="Comprobantes de pago" />
                            <q-btn flat @click="step = 1" color="primary" label="Regresar" class="q-ml-sm" />
                            </q-stepper-navigation>
                        </q-step>

                        <q-step
                            :name="3"
                            title="Comprobantes y montos."
                            icon="assignment"
                            :done="step > 3"
                        >
                            <span class="text-weight-bold text-blue-grey-8"> Si en un comprobante se pagaron 2 o mas adeudos, recuerde adjuntar el comprobante en todos los pagos que abarque dicho documento.</span> 
                            <q-list bordered>
                                <q-item  v-for="(selecteds, index) in selected" :key="selecteds.id" class="q-my-sm">  
                                    <q-item-section>    
                                        <q-separator color="primary" /><br>
                                        <q-item-label class="text-subtitle1 text-weight-bold text-teal"> {{ selecteds.categoria }} </q-item-label>
                                        <q-item-label class="text-subtitle2">{{ arrmeses.find(mes => Number(mes.id)== Number(selecteds.mes)).value.toUpperCase() }} {{ selecteds.anio }}</q-item-label>
                                        <q-item-label class="text-body1 " > Monto de adeudo: <span class="text-weight-bold"> {{ numberFormat2.format(selecteds.pagar)  }}</span> </q-item-label>

                                         <q-input
                                                class="text-weight-bold"
                                                type="number"
                                                step="any"
                                                outlined
                                                prefix="$"
                                                v-model="selecteds.zpago"
                                                :modelValue="selecteds.zpago" 
                                                label="Monto de Pago"
                                                @update:modelValue="val => selecteds.zpago = Number(val)"
                                                hint="Capture el monto de pago de su comprobante."
                                            />
                                            <span v-if="selecteds.zpago > selecteds.pagar" class="text-weight-bold text-negative"> * El monto a pagar es mayor al monto del adeudo.</span> 
                                        <br>

                                        <q-file clearable color="white" bg-color="primary" class="vertical-bottom text-white text-weight-bold"
                                                standout bottom-slots v-model="selecteds.ruta1" label="Agregar Comprobante de Pago" size="35px"
                                                counter @change="SubirArch(selecteds.ruta1,index,selecteds)" accept=".jpg, .pdf, image/*" >

                                            <template class="text-weight-bold" v-slot:prepend bg-color="primary" >
                                            <q-icon name="photo_camera" />
                                            </template>
                                            <template class="text-weight-bold" v-slot:append bg-color="primary" >                           
                                            </template>
                                        </q-file>   
                                         <q-btn v-if="selecteds.ruta1" @click="verDoc(selecteds)" icon="image" color="teal" label="Revisar Comprobante " />

                                    </q-item-section>                                    
                                </q-item>

                                <q-separator color="primary" />                                
                                <q-list v-if="selected.length == 0">
                                    <q-item>
                                        <q-item-section >
                                            <span class="text-weight-bold text-blue-grey-8"> No hay pagos seleccionados.</span>
                                        </q-item-section>
                                    </q-item>
                                </q-list>

                                <q-item>
                                    <q-item-section >
                                        <span class=" text-weight-bold text-h6 text-primary flex-right teal-9">Monto Total a Pagar 
                                            <span class="text-black"> 
                                                {{ (selected.length > 0) ? numberFormat2.format(selected.map((d) => { return d.zpago}).reduce((acc, d) => d + acc)):'$ 0'  }}
                                            </span> 
                                        </span>  
                                        <span class="text-weight-bold text-blue-grey-8"> Recuerde que este monto debe coincidir con el valor de sus comprobantes de pago.</span>  
                                    </q-item-section>
                                </q-item>

                            </q-list>

                            <q-stepper-navigation>
                            <q-btn v-if="(selected.length > 0) ? selected.map((d) => { return d.zpago}).reduce((acc, d) => d + acc):false " 
                                @click="validar()" 
                                color="primary"
                                label="Revisión de pago" />
                            <q-btn flat @click="step = 2" color="primary" label="Regresar" class="q-ml-sm" />
                            </q-stepper-navigation>
                        </q-step>

                        <q-step
                            :name="4"
                            title="Pago"
                            icon="add_comment"
                        >
                        <q-list bordered>
                            <q-item>
                                    <q-item-section >
                                        <span class=" text-weight-bold text-h5 text-primary flex-right teal-9">Pagar 
                                            <span class="text-black"> 
                                                {{ (selected.length > 0) ? numberFormat2.format(selected.map((d) => { return d.zpago}).reduce((acc, d) => d + acc)):'$ 0'  }}
                                            </span> 
                                        </span> 
                                        <span class="text-weight-bold text-blue-grey-8"> Recuerde que este monto debe coincidir con el valor de sus comprobantes de pago.</span>                                           
                                    </q-item-section>
                                </q-item>
                        </q-list>
                        <q-separator color="primary" /> 

                        <q-list bordered>
                            <q-item  v-for="selecteds in selected" :key="selecteds.id" class="q-my-sm">  
                                <q-item-section>  
                                    <q-item-label class="text-subtitle1 text-weight-bold text-teal"> {{ selecteds.categoria }} </q-item-label>
                                    <q-item-label class="text-subtitle2 text-teal">{{ arrmeses.find(mes => Number(mes.id)== Number(selecteds.mes)).value.toUpperCase() }} {{ selecteds.anio }}</q-item-label>
                                    <q-item-label class="text-body1 " > Monto de adeudo: <span > {{ numberFormat2.format(selecteds.pagar)  }}</span> </q-item-label>
                                    <q-item-label class="text-body1 " > Monto de pago: <span class="text-weight-bold"> {{ numberFormat2.format(selecteds.zpago)  }}</span> </q-item-label>

                                    <span v-if="selecteds.zpago==0" class="text-weight-bold text-negative"> * No debe tener un monto en cero (0).</span> 
                                    <span v-if="!selecteds.ruta1" class="text-weight-bold text-negative"> * Debe agregar un comprobante de pago.</span> 
                                    <span v-if="selecteds.zpago > selecteds.pagar" class="text-weight-bold text-negative"> * El monto a pagar es mayor al monto del adeudo.</span> 
                                </q-item-section>                                    
                            </q-item>
                        </q-list> 

                        <q-separator color="primary" /><br>   
                         <span v-if="pagoFinal==0" class="text-subtitle1 text-weight-bold text-negative"> 
                            * Para poder realizar el pago todos los adeudos seleccionados deben tener un monto de pago y un comprobante asignado.
                        </span> <br>
                         <span v-if="totalPago > totalAdeudo " class=" text-subtitle1 text-weight-bold text-amber-9"> 
                           <q-icon name="warning"/> * El monto de pago es mayor al monto del adeudo, si es correcto continue con el pago.
                        </span> 
                                     
                            <q-stepper-navigation>
                            <q-btn v-if="pagoFinal==1" @click="pagar" color="primary" label="Pagar" />
                            <q-btn flat @click="step = 3" color="primary" label="Regresar" class="q-ml-sm" />
                            </q-stepper-navigation>
                        </q-step>
                        </q-stepper>

                <!-- <q-card-section class="q-pa-md  q-gutter-md"> 
                    <div class="q-mt-md row">
                       
                        
                            <q-card class="my-card">
                                

                                <img :src="imageSrc">
                                
                                <q-img v-if="imgPago != ''" style="max-height: 700px; max-width: 600px" :src="imgPago" spinner-color="primary" >
                                    <div class="absolute-bottom">
                                    <div class="text-subtitle2">La imagen de su pago solo la podra ver el administrador y el propietario.</div>
                                    </div>
                                </q-img>

                                <q-card-actions >
                                <div class="row full-height full-width text-left">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <q-file clearable color="white" bg-color="warning" class="vertical-bottom"
                                                standout bottom-slots v-model="archivo" label="Adjuntar imagen para conciliar pago" size="35px"
                                                counter @change="SubirArch(archivo)" >

                                            <template v-slot:prepend bg-color="warning" >
                                            <q-icon name="attach_file" />
                                            </template>
                                            <template v-slot:append bg-color="warning" >                           
                                            </template>

                                        </q-file>
                                        <br>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">                      
                                        <q-btn  style="width:100%"  color="teal" size="20px" @click="captureImage" >
                                            
                                            <div left class="text-subtitle2 text-left">
                                            <q-icon left name="photo_camera" />
                                                Tomar fotografía para conciliar pago
                                            </div>                                
                                        </q-btn>
                                        <br><br>
                                    </div>
                                </div>
                                </q-card-actions>
                            </q-card>


                        </div>
                </q-card-section> -->
            </q-card>  

            <q-dialog v-model="show_dialog" :maximized="true">
                  <q-card>
                    <q-card-section>
                      <div>
                        <span class="text-h6">{{tituloDialg}}</span>
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

            <q-dialog  v-model="show_pago" >
                <q-card style="width: 300px">
                    <q-card-section align="center">
                        <span class="text-h6 items-center justify-center flex flex-center text-green-9">Pago Exitoso</span>
                    </q-card-section>

                    <q-card-section align="center">
                      <!-- <q-icon name="done_outline" size="100px"  color="positive" v-close-popup /> -->
                      <span class="text-h6 items-center justify-center flex flex-center">
                        <q-btn
                            round
                            color="white"
                            size="60px"
                            >
                            <q-icon name="done_outline" size="90px"  color="positive"  />
                        </q-btn>
                      </span>                      
                    </q-card-section>
                </q-card>
            </q-dialog>

        </div>
    </q-page>  
    <q-page-sticky position="top-right" :offset="[20, 1]">
        <q-fab fab icon="arrow_back" padding="sm" @click="$router.go(-1)" color="primary" />
    </q-page-sticky>
</template>

<script>

import { api } from '../../boot/axios'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ref, reactive, computed, onMounted  } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { meses } from '../../helpers/utils'
const moment = require('moment');


export default {
    name:'Pagos',
  setup () {
    const store = useStore()
    const $q = useQuasar()
    const router = useRouter()
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const options2 = { style: 'currency', currency: 'MXN' };
    const numberFormat2 = new Intl.NumberFormat('es-MX', options2);    
    const sesion = store.getters['auth/getMe'] 
    const dom = store.getters['auth/getDomicilio']      
    const imageSrc = ref('')    
    let arrmeses=meses
    let selected = ref([])
    let step= ref(1)    
    let show_dialog = ref(false)
    let show_pago=ref(false)
    let datos = ref([])
    let columnas =ref()
    let totalAdeudo =ref(null)
    let totalPendiente =ref(null)
    let totalParcial =ref(null)
    let pagado=ref(null)
    let totalPago = ref()
    let tituloDialg= ref(' Comprobante de pago')
    let pdfSrc = ref()
    let tipoDoc = ref(null)
    let imgDoc=ref('')
    let extensionesImg = ['png','jpg','jpeg','gif']
    let extensionesDoc = ['pdf']
    let verListado = ref(true)
    let inFullscreen = ref(false)
    let pagoFinal=ref(0)

    columnas.value = [
        {name: 'selected', label: '', field: 'selected',align: 'center'},
        {name: 'describe', label: 'Descripción', field: 'describe', sortable: true, align: 'left'},
        {name: 'montoapagar', label: 'Monto Concepto', field: 'montoapagar', sortable: true},
        {name: 'periodo', label: 'Periodo', field: 'periodo', sortable: true, align: 'center'},
        {name: 'pagar', label: 'Monto por Pagar ', field: 'pagar', sortable: true},  
        {name: 'id', label: '', field: 'id', sortable: true, align: 'center'},    
    ];

    const adeudos = async () => {            
      try {   
          if(dom.calle){
            let payload = { 
              "idconsorcio":sesion.idconsorcio, 
              "iddomicilio":dom.id,
            }            
            const json = await api.post('api/selects/1/22', payload);
            const {data} = json.data       
            let res= data   
            res.map((dat)=>{ dat.zpago=0  })
            datos.value=res
            verListado.value=!verListado.value
            totalAdeudo.value = datos.value.map((d) => { return d.aprobado==1 ? 0 : d.pagar}).reduce((acc, d) => d + acc)
            totalAdeudo.value =totalAdeudo.value ===0?null:totalAdeudo.value
            totalPendiente.value = datos.value.map((d) => { return d.aprobado==1 ?d.montoapagar:0}).reduce((acc, d) => d + acc)
            totalPendiente.value =totalPendiente.value == 0?null:totalPendiente.value
            totalParcial.value = datos.value.map((d) => { return d.aprobado==2?d.montodepago:0}).reduce((acc, d) => d + acc)
            totalParcial.value =totalParcial.value == 0?null:totalParcial.value
            pagado.value=datos.value.length>0?null:'Sin adeudos.'
            console.log('DATOS - ',totalPendiente.value )      
          }          
      } catch (e) {
          console.log(e)
      }
    }  

    const captureImage = async  () =>{
      const image = await Camera.getPhoto({
         quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt
      })

      // The result will vary on the value of the resultType option.
      // CameraResultType.Uri - Get the result from image.webPath
      // CameraResultType.Base64 - Get the result from image.base64String
      // CameraResultType.DataUrl - Get the result from image.dataUrl
      imageSrc.value = image.webPath
    }

    const createStoreDoc = async (img,index,arr) => { 
        try { 
            let formData = new FormData();
            formData.append('archivo', img);
            const imgs = await api.post(`api/uploads/14/${arr.id}/pagos/ruta1`, formData)  
            Promise.all([imgs]).then((responses) => {
                const {data} = responses[0]
                console.log(index, '   -   ' ,data[0]);  
                arr.ruta1 =  data[0].ruta1
                console.log('ARR  -  ',arr)
                Object.assign(selected.value[index], arr);    
                formData.value=[]     
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha guardo el comprobante de pago con exito.'
                })   
                console.log(selected.value)
            });
        } catch (error) {
            $q.notify({
                position: 'top',
                type: 'negative',
                message: 'No se ha poddio guardar la información intentelo de nuevo.'
            }) 
        }             
    }

    const verDoc= async (arr) => { 
      try {        
          
          show_dialog.value=true
          console.log(arr)
          const nombreCortado = arr.ruta1.split('.');
          const extension = nombreCortado[ nombreCortado.length - 1 ];
          const json = await api.get(`api/uploads/14/${arr.id}/pagos/ruta1`,{responseType: 'blob' });
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
        console.log(e)          
          $q.notify({
            position: 'top',
            type: 'negative',
            message: e// e.response.data.msg
          }) 
      }      
    }

    const pagar = async () => { 
        try { 
            const allPay = selected.value.map(async (sel) => {
                let payload = { 
                    aniopago:Number( moment(new Date(Date.now())).format("YYYY")),
                    mespago: Number(moment(new Date(Date.now())).format("M")),
                    aprobado: 1,
                    formapago: 3,
                    montodepago: sel.zpago
                }  
                //console.log(`api/updates/${sel.id}/14`, payload)                
                const docs = await api.put(`api/updates/${sel.id}/14`, payload);       
                return docs.data;
            });            

            Promise.all(allPay).then((responses) => {
                console.log(responses); 
                pagoFinal.value=0
                show_pago.value=true
                setTimeout(()=>{
                    show_pago.value=false
                    router.go(-1)
                },2000)     
            });
        
        } catch (e) {
            console.log(e)          
            // $q.notify({
            //     position: 'top',
            //     type: 'negative',
            //     message: e// e.response.data.msg
            // }) 
      }
    }             

    onMounted( async() =>{
      adeudos()  
      $q.loading.hide()   
    })

    return { 
            SubirArch: async (img,index,arr) => {
                createStoreDoc(img,index,arr)
            },
            imageSrc,
            captureImage,
            show_dialog,
            show_pago,
            columnas, 
            datos: computed( () => datos.value),   
            tituloDialg,    
            filter: ref(''),
            verListado: computed( () => verListado.value), 
            pagination: { rowsPerPage: 10 },
            arrmeses,
            numberFormat2,
            totalAdeudo,
            totalPendiente,
            totalParcial,
            pagado,
            totalPago,
            step,
            inFullscreen,
            getSelectedString () {
                selected.value = selected.value.filter(sel=> sel.aprobado != 1)
                return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${datos.value.length}`
            },
            selected, 
            full () {
                inFullscreen.value=!inFullscreen.value
            },  
            pdfSrc,
            imgDoc,
            tipoDoc,
            verDoc,
            pagoFinal,
            validar(){
                console.log(step)
                totalPago.value = (selected.value.length > 0) ? selected.value.map((d) => { return d.zpago}).reduce((acc, d) => d + acc) : 0
                let ctaPago = selected.value.filter(sel=> sel.zpago == 0)
                let ctaComprobante = selected.value.filter(sel=> sel.ruta1 == null)
                console.log(ctaPago.length,"   -   ",ctaComprobante.length, " |||||" , totalPago.value, "  -  ", totalAdeudo.value)            
                pagoFinal.value = ctaPago.length == 0 && ctaComprobante.length == 0 ? 1 : 0
                step.value = 4
            },
            pagar               
        
        }
    }
}
</script>
