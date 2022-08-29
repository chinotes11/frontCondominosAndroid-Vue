<template>

    <q-page>    
        <div class="fondo1">
            <q-card class="esqredonda">
                <q-card-section>
                    <q-timeline color="grey">
                        <q-timeline-entry  
                            class="text-h4" 
                            body="Proceso de Pago" />

                        <q-timeline-entry
                            v-if="totalAdeudo"
                            title="Saldo deudor sin pago."
                            color="red"
                            subtitle="Febrero 01, 2022"
                            icon="warning"
                            :body="numberFormat2.format(totalAdeudo)"
                        />

                        <q-timeline-entry 
                            v-if="totalPendiente"
                            title="Aprobación en Proceso"
                            color="orange"
                            subtitle="Febrero 15, 2022"
                            icon="swap_vert"
                            :body="numberFormat2.format(totalPendiente)"

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
                    <q-separator color="primary" inset />
                </q-card-section>

                <q-card-section>
                    <q-table 
                        title="Pagos" 
                        :rows="datos" 
                        :columns="columnas" 
                        row-key="id" 
                        binary-state-sort
                        :filter="filter"
                        :pagination="pagination"
                    >

                        <template v-slot:top-right>
                        <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Buscar en Tabla">
                            <template v-slot:append>
                            <q-icon name="manage_search"/>
                            </template>
                        </q-input>
                        </template>

                        <!-- <template v-slot:top-left>
                            <q-btn v-if="verListado" color="primary" icon="list" label="Mostrar Listado de Calle/Edificio/Torre/Privada" @click="getCategorias" no-caps></q-btn>  
                            <q-btn v-if="!verListado" color="primary" icon="add_circle" label="Agregar Calle/Edificio/Torre/Privada" @click="nuevoRow" no-caps></q-btn>                  
                            <div class="q-pa-sm q-gutter-sm">
                                <q-dialog v-model="show_dialog">
                                <q-card>
                                    <q-card-section>
                                    <div>
                                        <span class="text-h6"> {{tituloDialg}} Calle/Edificio/Torre/Privada</span>
                                    </div>
                                    </q-card-section>

                                    <q-card-section>
                                    <div class="row">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <q-input outlined 
                                            v-model="editedItem.nombre" 
                                            :modelValue="editedItem.nombre" 
                                            label="Calle/Edificio/Torre/Privada"
                                            @update:modelValue="val => editedItem.nombre = val.toUpperCase()"
                                            lazy-rules   
                                            :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"
                                        >
                                        </q-input>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <q-toggle
                                                size="lg"
                                                name="activo"
                                                v-model="editedItem.activo"
                                                :true-value="Number(1)"
                                                :false-value="Number(0)"
                                            />
                                            <span v-if="editedItem.activo==1"> Activo</span>
                                            <span v-else> Inactivo</span>
                                        </div>
                                    </div>
                                    </q-card-section>
                                    
                                    <q-card-actions align="right">
                                    <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                                    <q-btn icon="check_circle"  color="blue" v-close-popup @click="addRow" > Guardar</q-btn>
                                    </q-card-actions>
                                </q-card>
                                </q-dialog>
                            </div>                  
                        </template> -->

                        <template v-slot:body="props">
                            <q-tr :props="props"> 
                                <q-td key="id" :props="props" class="text-subtitle2">{{ props.row.id }}</q-td>                        
                                <q-td key="anio" :props="props" class="text-subtitle2">{{ props.row.anio }}</q-td>
                                <q-td key="mes" :props="props" class="text-subtitle2">{{ arrmeses.find(mes => Number(mes.id)== Number(props.row.mes)).value.toUpperCase() }}</q-td>
                                <q-td key="montoapagar" :props="props" class="text-subtitle2">{{ numberFormat2.format(props.row.montoapagar)  }}</q-td>
                                <q-td key="categoria" :props="props" class="text-subtitle2">{{ props.row.categoria }}</q-td>
                                <q-td key="aprobado" :props="props" class="text-subtitle2">
                                    <span v-if="props.row.montodepago==0"> <q-badge color="negative"> CON ADEUDO</q-badge> </span>
                                    <span v-if="props.row.aprobado==1 || props.row.aprobado==2"> <q-badge color="orange">PENDIENTE DE VALIDAR</q-badge> </span>                                    
                                </q-td>
                                <!-- <q-td key="activo" :props="props">                        
                                    <span v-if="props.row.activo==1"> <q-badge color="primary">Activo</q-badge> </span>
                                    <span v-else><q-badge color="grey">Inactivo</q-badge> </span>
                                </q-td> -->
                                <q-td key="actions" :props="props">
                                    <q-btn color="blue" label="Editar" @click="editItem(props.row)" size="md" no-caps></q-btn>
                                    <q-btn color="red" label="Borrar"  @click="deleteItem(props.row)" size="md" no-caps></q-btn>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </q-card-section>

                <q-card-section class="q-pa-md  q-gutter-md"> 
                    <div class="q-mt-md row">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">

                            <div class="q-px-lg q-pb-md">
                                
                                
                            </div>
                            
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        
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

                    </div>
                </q-card-section>
            </q-card>     
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
import { ref, reactive, computed, onMounted  } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { meses } from '../../helpers/utils'


export default {
    name:'Pagos',
  setup () {
    const store = useStore()
    const $q = useQuasar()
    const options2 = { style: 'currency', currency: 'MXN' };
    const numberFormat2 = new Intl.NumberFormat('es-MX', options2);
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    const dom = store.getters['auth/getDomicilio']
    let imgPago=ref('')    
    const imageSrc = ref('')    
    const show_filter = ref(false)
    let arrmeses=meses
    //meses.find(mes => Number(mes.id)== Number(calendarioPago.value.mes)).value.toUpperCase()
    let editedIndex = ref(-1)
    let show_dialog = ref(false)
    let datos = ref([])
    let columnas =ref()
    let totalAdeudo =ref(null)
    let totalPendiente =ref(null)
    let pagado=ref(null)
    let totalPago =ref(null)
    let tituloDialg= ref(' Agregar nueva ')
    let verListado = ref(true)
    columnas.value = [
        {name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center'},
        {name: 'anio', label: 'Año', field: 'anio', sortable: true, align: 'center'},
        {name: 'mes', label: 'Mes', field: 'mes', sortable: true, align: 'center'},
        {name: 'montoapagar', label: 'Monto Adeudo', field: 'montoapagar', sortable: true},
        {name: 'categoria', label: 'Concepto', field: 'categoria', align: 'center', sortable: true  },
        {name: 'aprobado', label: 'Estatus', field: 'aprobado', sortable: true},
        {name: "actions", label: "Acciones", field: "actions", align: 'center'}
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
            datos.value=data
            verListado.value=!verListado.value
            totalAdeudo.value = datos.value.map((d) => { return d.aprobado==1 || d.aprobado==2?0:d.montoapagar}).reduce((acc, d) => d + acc)
            totalAdeudo.value =totalAdeudo.value ===0?null:totalAdeudo.value
            totalPendiente.value = datos.value.map((d) => { return d.aprobado==1 || d.aprobado==2?d.montoapagar:0}).reduce((acc, d) => d + acc)
            totalPendiente.value =totalPendiente.value == 0?null:totalPendiente.value
            pagado.value=datos.value.length>0?null:'Sin adeudos.'
            //totalPendiente.value = datos.value.reduce((first, last) => first + Number(last.montoapagar), 0)
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


    const createStoreDoc = async (img) => {        
        let formData = new FormData();
        //${usuarios.value.id}

        console.log(img)
        formData.append('archivo', img);
        
        await api.put(`api/uploads/14/50/pagos`, formData) .then((response) => {
            console.log("success!", response.data[0].url);
            imgPago.value = URL.createObjectURL(img);
            $q.notify({
                type: 'positive',
                message: 'Se integro la imagen del comprobante de pago para su revisión.',
                position: 'top',
            })                
        })
        .catch((error) => {
            console.log(error);
        });
    }

    onMounted( async() =>{
      adeudos()  
      $q.loading.hide()   
    })

    return {
        archivo: ref(null),
        imgPago,
        SubirArch: async (e) => {
            createStoreDoc(e)
        },
        imageSrc,
        captureImage,
        show_dialog,
        columnas, 
        datos: computed( () => datos.value),   
        tituloDialg,    
        filter: ref(''),
        show_filter,
        verListado: computed( () => verListado.value), 
        pagination: { rowsPerPage: 10 },
        arrmeses,
        numberFormat2,
        totalAdeudo,
        totalPendiente,
        pagado,
        totalPago: computed( () => totalPago.value),  
      
    }
  }
}
</script>
