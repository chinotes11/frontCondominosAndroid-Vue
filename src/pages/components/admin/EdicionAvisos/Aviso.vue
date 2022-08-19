<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
              <q-table 
                title="Avisos" 
                :rows="datos" 
                :columns="columnas" 
                row-key="titulo" 
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

                <template v-slot:top-left>
                  <q-btn v-if="verListado" color="primary" icon="list" label="Mostrar Listado de Avisos" @click="getCategorias" no-caps></q-btn>  
                  <q-btn v-if="!verListado" color="primary" icon="add_circle" label="Agregar Aviso" @click="nuevoRow" no-caps></q-btn>                  
                  <div class="q-pa-sm q-gutter-sm">
                    <q-dialog v-model="show_dialog" :maximized="true">
                      <q-card>
                        <q-card-section>
                          <div>
                            <span class="text-h6">{{tituloDialg}} documento. </span>
                            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
                          </div>
                        </q-card-section>

                        <q-card-section>
                          <div class="row">
                            <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-input outlined
                                v-model="editedItem.titulo" 
                                :modelValue="editedItem.titulo" 
                                label="Título/Nombre de documento"
                                @update:modelValue="val => editedItem.titulo = val.toUpperCase()"
                                lazy-rules   
                                :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"
                                maxlength="100"
                              >
                              </q-input>
                            </div>
                            <div class="col-sm-6 col-xs-12">
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

                            <div class="col-sm-12 col-xs-12 q-pa-sm q-gutter-sm">

                                <q-editor
                                  v-model="editedItem.descripcion"
                                  :modelValue="editedItem.descripcion"
                                  :dense="$q.screen.lt.md"
                                  :toolbar="[
                                    [
                                      {
                                        label: $q.lang.editor.align,
                                        icon: $q.iconSet.editor.align,
                                        fixedLabel: true,
                                        list: 'only-icons',
                                        options: ['left', 'center', 'right', 'justify']
                                      }
                                    ],
                                    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                                    ['token', 'hr', 'link', 'custom_btn'],
                                    ['print', 'fullscreen'],
                                    [
                                      {
                                        label: $q.lang.editor.formatting,
                                        icon: $q.iconSet.editor.formatting,
                                        list: 'no-icons',
                                        options: [
                                          'p',
                                          'h1',
                                          'h2',
                                          'h3',
                                          'h4',
                                          'h5',
                                          'h6',
                                          'code'
                                        ]
                                      },
                                      {
                                        label: $q.lang.editor.fontSize,
                                        icon: $q.iconSet.editor.fontSize,
                                        fixedLabel: true,
                                        fixedIcon: true,
                                        list: 'no-icons',
                                        options: [
                                          'size-1',
                                          'size-2',
                                          'size-3',
                                          'size-4',
                                          'size-5',
                                          'size-6',
                                          'size-7'
                                        ]
                                      },
                                      {
                                        label: $q.lang.editor.defaultFont,
                                        icon: $q.iconSet.editor.font,
                                        fixedIcon: true,
                                        list: 'no-icons',
                                        options: [
                                          'default_font',
                                          'arial',
                                          'arial_black',
                                          'comic_sans',
                                          'courier_new',
                                          'impact',
                                          'lucida_grande',
                                          'times_new_roman',
                                          'verdana'
                                        ]
                                      },
                                      'removeFormat'
                                    ],
                                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                                    ['undo', 'redo'],
                                    ['viewsource']
                                  ]"
                                  :fonts="{
                                    arial: 'Arial',
                                    arial_black: 'Arial Black',
                                    comic_sans: 'Comic Sans MS',
                                    courier_new: 'Courier New',
                                    impact: 'Impact',
                                    lucida_grande: 'Lucida Grande',
                                    times_new_roman: 'Times New Roman',
                                    verdana: 'Verdana'
                                  }"
                                />

                              
                            </div>
                            
                            <div class="col-sm-12 col-xs-12 q-pa-sm ">
                              <div class="text-weight-bolder">Se pueden subir hasta 5 documentos o imagenes por aviso.</div>
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm ">    

                                <q-file v-if="!editedItem.ruta1" outlined clearable color="white" bg-color="white" class="vertical-bottom"
                                        standout bottom-slots v-model="archivo1" label="Adjuntar documento No. 1" size="35px"
                                        counter @change="SubirArch(archivo1,1)" >
                                    <template v-slot:prepend bg-color="white" >
                                    <q-icon name="attach_file" />
                                    </template>
                                    <template v-slot:append bg-color="white" >                           
                                    </template>
                                </q-file>
                                <q-btn v-if="editedItem.ruta1" icon="delete" color="primary" label="Borrar Documento 1" @click="borraDoc(editedItem,1)" size="lg" no-caps></q-btn>
                                <br>
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm">
                                <q-file v-if="!editedItem.ruta2" outlined clearable color="white" bg-color="white" class="vertical-bottom"
                                        standout bottom-slots v-model="archivo2" label="Adjuntar documento No. 2" size="35px"
                                        counter @change="SubirArch(archivo2,2)" >
                                    <template v-slot:prepend bg-color="white" >
                                    <q-icon name="attach_file" />
                                    </template>
                                    <template v-slot:append bg-color="white" >                           
                                    </template>

                                </q-file>
                                <q-btn v-if="editedItem.ruta2" icon="delete" color="primary" label="Borrar Documento 2" @click="borraDoc(editedItem,2)" size="lg" no-caps></q-btn>
                                <br>
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm">
                                <q-file v-if="!editedItem.ruta3" outlined clearable color="white" bg-color="white" class="vertical-bottom"
                                        standout bottom-slots v-model="archivo3" label="Adjuntar documento No. 3" size="35px"
                                        counter @change="SubirArch(archivo3,3)" >
                                    <template v-slot:prepend bg-color="white" >
                                    <q-icon name="attach_file" />
                                    </template>
                                    <template v-slot:append bg-color="white" >                           
                                    </template>

                                </q-file>
                                <q-btn v-if="editedItem.ruta3" icon="delete" color="primary" label="Borrar Documento 3" @click="borraDoc(editedItem,3)" size="lg" no-caps></q-btn>
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm">
                                <q-file v-if="!editedItem.ruta4" outlined clearable color="white" bg-color="white" class="vertical-bottom"
                                        standout bottom-slots v-model="archivo4" label="Adjuntar documento No. 4" size="35px"
                                        counter @change="SubirArch(archivo4,4)" >
                                    <template v-slot:prepend bg-color="white" >
                                    <q-icon name="attach_file" />
                                    </template>
                                    <template v-slot:append bg-color="white" >                           
                                    </template>

                                </q-file>
                                <q-btn v-if="editedItem.ruta4" icon="delete" color="primary" label="Borrar Documento 4" @click="borraDoc(editedItem,4)" size="lg" no-caps></q-btn>
                                
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm ">
                                <q-file v-if="!editedItem.ruta5" outlined clearable color="white" bg-color="white" class="vertical-bottom"
                                        standout bottom-slots v-model="archivo5" label="Adjuntar documento No. 5" size="35px"
                                        counter @change="SubirArch(archivo5,5)" >
                                    <template v-slot:prepend bg-color="white" >
                                    <q-icon name="attach_file" />
                                    </template>
                                    <template v-slot:append bg-color="white" >                           
                                    </template>

                                </q-file>
                                <q-btn v-if="editedItem.ruta5" icon="delete" color="primary" label="Borrar Documento 5" @click="borraDoc(editedItem,5)" size="lg" no-caps></q-btn>
                                
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
                </template>

                

                <template v-slot:body="props">
                    <q-tr :props="props">                      
                      <q-td key="titulo" :props="props">{{ props.row.titulo }}</q-td>
                      <q-td key="documentos" :props="props">
                         <q-btn v-if="props.row.ruta1" icon="assignment" color="primary" label="1" @click="verDoc(props.row,props.row.ruta1,1)" size="md" no-caps></q-btn>
                         <q-btn v-if="props.row.ruta2" icon="assignment" color="primary" label="2" @click="verDoc(props.row,props.row.ruta2,2)" size="md" no-caps></q-btn>
                         <q-btn v-if="props.row.ruta3" icon="assignment" color="primary" label="3" @click="verDoc(props.row,props.row.ruta3,3)" size="md" no-caps></q-btn>
                         <q-btn v-if="props.row.ruta4" icon="assignment" color="primary" label="4" @click="verDoc(props.row,props.row.ruta4,4)" size="md" no-caps></q-btn>
                         <q-btn v-if="props.row.ruta5" icon="assignment" color="primary" label="5" @click="verDoc(props.row,props.row.ruta5,5)" size="md" no-caps></q-btn>                        
                      </q-td>
                      <q-td key="activo" :props="props">                        
                        <span v-if="props.row.activo==1"> <q-badge color="primary">Activo</q-badge> </span>
                        <span v-else><q-badge color="grey">Inactivo</q-badge> </span>
                      </q-td>
                      <q-td key="actions" :props="props">
                        <q-btn color="blue" label="Editar" @click="editItem(props.row)" size="md" no-caps></q-btn>
                        <q-btn color="red" label="Borrar"  @click="deleteItem(props.row)" size="md" no-caps></q-btn>
                      </q-td>
                    </q-tr>
                </template>
              </q-table>
            </div>


             <q-dialog v-model="show_vista" :maximized="true">
                  <q-card>
                    <q-card-section>
                      <div>
                        <span class="text-h6">{{tituloVista}}</span>
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
                        <q-img style="max-height: 700px; max-width: 600px" :src="imgDoc" spinner-color="primary" >
                            <div class="absolute-bottom">
                            <div class="text-subtitle2">La imagen de su pago solo la podra ver el administrador y el propietario.</div>
                            </div>
                        </q-img>
                      </div>

                    </q-card-section>
                    <q-card-actions align="right">
                          <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                        </q-card-actions>
                  </q-card>
             </q-dialog>
        </q-card-section>
    </q-card>
</template>

<script>

import { useStore } from 'vuex'
import { useQuasar, QSpinnerGears  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'
const moment = require('moment')



export default defineComponent({
  name: "egresos",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    const show_filter = ref(false)
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    let editedIndex = ref(-1)
    let show_dialog = ref(false)
    let show_vista = ref(false)
    let tipoDoc = ref(null)
    let imgDoc=ref('')
    let extensionesImg = ['png','jpg','jpeg','gif']
    let extensionesDoc = ['pdf']
    
    let datos = ref([])
    let columnas =ref()
    let tituloDialg= ref(' Agregar nuevo ')
    let tituloVista= ref('')
    let verListado = ref(true)
    let formArch=[];
    let archivo1= ref(null)
    let archivo2 = ref(null)
    let archivo3 = ref(null)
    let archivo4 = ref(null)
    let archivo5 = ref(null)
    let pdfSrc = ref()

    columnas.value = [
      {name: 'titulo', label: 'Título/Nombre de Aviso', field: 'titulo', align: 'left', sortable: true  },  
      {name: 'documentos', label: 'Documentos', field: 'documentos', align: 'left', sortable: true  },      
      {name: 'activo', label: 'Activo', field: 'activo', sortable: true},
      {name: "actions", label: "Acciones", field: "actions"
      }
    ];

    let editedItem = ref(  {            
        idconsorcio: sesion.idconsorcio,
        titulo: '',
        descripcion: '',
        ruta1: '',
        ruta2: '',
        ruta3: '',
        ruta4: '',
        ruta5: '',
        activo: null,      
    })

    let defaultItem = ref({        
        idconsorcio: sesion.idconsorcio,
        titulo: '',
        descripcion: '',
        ruta1: '',
        ruta2: '',
        ruta3: '',
        ruta4: '',
        ruta5: '',
        visible: 1,
        activo: 1,
    })

    const nuevoRow = ()=>{      
      editedItem.value = defaultItem.value
      archivo1.value = null
      archivo2.value = null 
      archivo3.value = null 
      archivo4.value = null
      archivo5.value = null
      show_dialog.value = true      
    }

    const addRow = async ()=>{
      try {
        if (editedIndex.value > -1) {          
          const docs = await api.put(`api/updates/${editedItem.value.id}/2`, editedItem.value);        
          await Promise.all([docs]).then(function (res) {
              const egr = res[0].data.data
              //console.log(egr[0]);
              if(formArch.length>0){
                addDocs(egr[0].id,1)
              }  else {
                Object.assign(datos.value[editedIndex.value], egr[0]);  
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha actualizado el registro correctamente.'
                })      
                close()  
              }                    
              
          });
          
        } else {      
          const docs = await api.put(`api/inserts/2`, editedItem.value);        
          await Promise.all([docs]).then(function (res) {
              const egr = res[0].data.data
              //console.log(egr[0]); 
              if(formArch.length>0){
                addDocs(egr[0].id,2)
              }  else {
                datos.value.push(egr[0]);  
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha actualizado el registro correctamente.'
                })      
                close()  
              }     
          });          
        }      
        
      } catch (error) {
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          }) 
          
      }        
    }

    const deleteItem = async (item)=>{

      try {
        const index = datos.value.indexOf(item);
       
        $q.dialog({
            title: 'Confirmación de Borrado',
            message: `¿Esta usted seguro de borrar el registro, recuerde que la información vinculada a este desaparecerá, desea continuar con el proceso?`,
            html: true,
            ok: {
              push: true,
              color: 'blue',
              label: 'Aceptar',
              icon: 'check_circle'
              
            },
            cancel: {
              push: true,
              color: 'primary',
              label: 'Cancelar',
              icon: 'cancel'
            },
            persistent: true
          }).onOk( async() => {
            const deletedAt = moment(new Date(Date.now())).format("yyyy-MM-DD HH:mm:ss")
            const calle = await api.put(`api/updates/${item.id}/2`, {activo:0,visible:0,deletedAt:deletedAt})     
            await Promise.all([calle]).then(function (res) {
                const egr = res[0].data.data
                datos.value.splice(index, 1);                       
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha actualizado el egreso correctamente.'
                })      
                close()  
            });
          }).onCancel(() => {
          }).onDismiss(() => {})   
        
      } catch (error) {
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          })           
      }   
      // confirm("Are you sure you want to delete this item?") &&
      //   datos.value.splice(index, 1);
    }

    const editItem = (item)=>{        
        tituloDialg.value=' Editar '
        editedIndex.value = datos.value.indexOf(item);
        editedItem.value = Object.assign({}, item);
        show_dialog.value = true;
    }

    const close = ()=>{
      show_dialog.value = false
      setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
        formArch=[]
        archivo1.value = null
        archivo2.value = null 
        archivo3.value = null 
        archivo4.value = null
        archivo5.value = null
      }, 300)
    }
   
    const getCategorias = async () => {   
        let payload = { 
          "idconsorcio": sesion.idconsorcio
          }        
        try {                
            const json = await api.post('api/selectsadmin/2', payload);
            const {data}=json.data
            datos.value=data
            verListado.value=!verListado.value
        } catch (e) {
            verListado.value=!verListado.value
            $q.notify({
              position: 'top',
              type: 'negative',
              message: e.response.data.msg
            }) 
        }
    }

    const createStoreArr = async (dat,id) => { 
      let validar = formArch.find(o => o.id===id);
        if (validar){
          const index = formArch.indexOf(validar);
          formArch.splice(index, 1); 
          formArch.push({dat: dat, id:id, ruta:`ruta${id}`})     
        } else{
          formArch.push({dat: dat, id:id, ruta:`ruta${id}`})     
        }
        
    }

    const addDocs= async (idDoc, tipo)=>{
      try {       
        formArch.sort((a, b) => a.id > b.id ? 1 : -1);
        const allDocs = formArch.map(async (doc) => {
            let formData = new FormData(); 
            formData.append('archivo', doc.dat);
            const docs = await api.post(`api/uploads/2/${idDoc}/documentos/${doc.ruta}`, formData) 
            return docs.data;
        });

        Promise.all(allDocs).then((responses) => {
          console.log(responses[allDocs.length -1][0]); 
          if(tipo==2){
            datos.value.push(responses[allDocs.length -1][0]);
          } else {
            Object.assign(datos.value[editedIndex.value], responses[allDocs.length -1][0]);  
          }
          $q.notify({
              position: 'top',
              type: 'positive',
              message: 'Se ha actualizado el registro correctamente.'
          })      
          close() 
        });
      
      } catch (error) {
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          }) 
          
      }        
    }

    const encode = (data) => {
      let buf = Buffer.from(data);
      let base64 = buf.toString('base64');
      return base64
    }
    
    const verDoc= async (arr,doc,id) => { 

      try {        
          tituloVista.value=`Documento ${id}`
          show_vista.value=true
          console.log(arr,doc,id)
          const nombreCortado = doc.split('.');
          const extension = nombreCortado[ nombreCortado.length - 1 ];
          const json = await api.get(`api/uploads/2/${arr.id}/documentos/ruta${id}`,{responseType: 'blob' });
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
          // $q.notify({
          //   position: 'top',
          //   type: 'negative',
          //   message: e// e.response.data.msg
          // }) 
      }
      

      // 
    }

    const borraDoc= async (arr,id) => {  
      console.log(arr,id)
      try {
         const docs = await api.delete(`api/uploads/2/${arr.id}/documentos/ruta${id}`) 
         await Promise.all([docs]).then(function (res) {
              const egr = res[0].data.data
              switch ( id ) {
                case 1:
                  editedItem.value.ruta1=null
                  Object.assign(datos.value[editedIndex.value], editedItem.value)
                break;       
                case 2:
                  editedItem.value.ruta2=null
                  Object.assign(datos.value[editedIndex.value], editedItem.value)
                break; 
                case 3:
                  editedItem.value.ruta3=null
                  Object.assign(datos.value[editedIndex.value], editedItem.value)
                break; 
                case 4:
                  editedItem.value.ruta4=null
                  Object.assign(datos.value[editedIndex.value], editedItem.value)
                break; 
                case 5:
                  editedItem.value.ruta5=null
                  Object.assign(datos.value[editedIndex.value], editedItem.value)
                break;           
              }              
              $q.notify({
                  position: 'top',
                  type: 'positive',
                  message: 'Se ha borrado el documento correctamente.'
              })      
                  
          }); 

        
       
      // await api.put(`api/uploads/14/50/pagos`, formData) .then((response) => {
      //     console.log("success!", response.data[0].url);
      //     //imgPago.value = URL.createObjectURL(img);
      //     $q.notify({
      //         type: 'positive',
      //         message: 'Se integro la imagen del comprobante de pago para su revisión.',
      //         position: 'top',
      //     })                
      // })
      // .catch((error) => {
      //     console.log(error);
      // });
      } catch (error) {
        
      }
      
     
    }
    
    onMounted( async() =>{
        //getCategorias()
        $q.loading.hide()
    })

    return {
        nuevoRow,
        addRow,
        deleteItem,
        editItem,
        close,
        getCategorias,
        show_dialog,
        show_vista,
        pdfSrc,
        imgDoc,
        tipoDoc,
        extensionesImg,
        extensionesDoc,
        editedIndex,
        editedItem: computed( () => editedItem.value),
        defaultItem,
        columnas,
        datos: computed( () => datos.value),
        tituloDialg,
        getSelectedString: ()=> {},
        filter: ref(''),
        show_filter,
        verListado: computed( () => verListado.value), 
        pagination: { rowsPerPage: 10 },
        archivo1, 
        archivo2, 
        archivo3, 
        archivo4, 
        archivo5, 
        tituloVista,
        // archivo1: computed( () => archivo1.value), 
        // archivo2: computed( () => archivo2.value), 
        // archivo3: computed( () => archivo3.value), 
        // archivo4: computed( () => archivo4.value), 
        // archivo5: computed( () => archivo5.value), 
        SubirArch: async (e,id) => {
            createStoreArr(e,id)
            //guardaStore(e)
        },
        borraDoc,
        verDoc,
        
    }
  }
})


</script>

<style scoped>
</style>


