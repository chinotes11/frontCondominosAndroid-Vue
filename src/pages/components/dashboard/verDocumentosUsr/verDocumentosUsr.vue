
    
<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
                <q-card bordered>
                    <q-card-section>
                        <div class="text-h6">{{ datos.titulo }}</div>
                    </q-card-section>

                    <q-separator color="primary" />

                    <q-editor 
                        readonly 
                        v-model="datos.descripcion" 
                        min-height="5rem" 
                        :toolbar="[
                            ['fullscreen'],
                        ]"
                        />
                        
                    <div class="q-pa-md">
                        <q-card class="row items-start" >
                            <q-card-section class="my-card" v-for="doc in docs" :key="doc.id">
                                <q-img
                                    class="col"
                                    :src="doc.doc"
                                    style="height:220px"
                                />
                                <q-card-actions vertical class="justify-around">
                                    <q-btn flat  color="primary" icon="view_in_ar" @click="verDoc(doc.id, doc.tipo, doc.doc, doc.pdf)" label="Ver Completa"/>
                                </q-card-actions>
                            </q-card-section>
                        </q-card>                       
                    </div>
                    
                </q-card>
            </div>
        </q-card-section>
    </q-card>

    <q-dialog v-model="show_vista" :maximized="true">
        <q-card>
        <q-card-section>
            <div>
            <span class="text-h6">Vista pantalla completa</span>
            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
            </div>
            
        </q-card-section>
        <q-card-section>
            <div v-if="tipoDoc==='Doc'" class="q-pa-md q-gutter-sm"  style="height: 700px;">
            <q-pdfviewer
                type="html5"
                :src="imgDoc"
            />
            </div>

            <div v-if="tipoDoc==='Img'">
            <q-img style="max-height: 700px; max-width: 600px" :src="imgDoc" spinner-color="primary" >
                <div class="absolute-bottom">
                </div>
            </q-img>
            </div>

        </q-card-section>
        <q-card-actions align="right">
                <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { useStore } from 'vuex'
import { useQuasar  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../../../boot/axios'
const moment = require('moment')

export default defineComponent({
  name: "egresos",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    const route = useRoute()
    const idC = Number(route.params.id)
    let show_vista = ref(false)
    console.log("IDC ",idC)
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    let datos = ref([])
    let slide = ref(1)
    let docs = ref([])
    let tipoDoc= ref('')
    let imgDoc =ref(null)
    let extensionesImg = ['png','jpg','jpeg','gif']
    let extensionesDoc = ['pdf']

    const getAviso = async () => {    
        try { 
            let payload = { 
                "idconsorcio": sesion.idconsorcio,
                "id": idC
            }                 
            const json = await api.post('api/selects/1/11', payload);
            const {data}=json.data
            Promise.all(data).then((responses) => {
                datos.value=responses[0]
                const urlCreator = window.URL || window.webkitURL
                responses.map(async (av) => { 
                    console.log(av) 
                    if(av.ruta1){
                        const nombreCortado = av.ruta1.split('.');
                        const extension = nombreCortado[ nombreCortado.length - 1 ];
                        const json1 = await api.get(`api/uploads/11/${av.id}/documentos/ruta1`,{responseType: 'blob' });
                        const {data}=json1
                        if ( !extensionesImg.includes( extension ) ) {
                            docs.value.push({doc:"img/pdf.png", tipo:"Doc", id:av.id, pdf:urlCreator.createObjectURL(new Blob([data], { type: `application/${extension}` }))})
                        } else{
                            docs.value.push({doc:urlCreator.createObjectURL(new Blob([data], { type: `image/${extension}` })), tipo:"Img", id:av.id, pdf:null})
                        }  
                    }
                    if(av.ruta2){
                        const nombreCortado = av.ruta2.split('.');
                        const extension = nombreCortado[ nombreCortado.length - 1 ];
                        const json2 = await api.get(`api/uploads/11/${av.id}/documentos/ruta2`,{responseType: 'blob' });
                        const {data}=json2
                        if ( !extensionesImg.includes( extension ) ) {
                            docs.value.push({doc:"img/pdf.png", tipo:"Doc", id:av.id, pdf:urlCreator.createObjectURL(new Blob([data], { type: `application/${extension}` }))})
                        } else{
                            docs.value.push({doc:urlCreator.createObjectURL(new Blob([data], { type: `image/${extension}` })), tipo:"Img", id:av.id, pdf:null})
                        }  
                    }
                    if(av.ruta3){
                        const nombreCortado = av.ruta3.split('.');
                        const extension = nombreCortado[ nombreCortado.length - 1 ];
                        const json3 = await api.get(`api/uploads/11/${av.id}/documentos/ruta3`,{responseType: 'blob' });
                        const {data}=json3
                        if ( !extensionesImg.includes( extension ) ) {
                            docs.value.push({doc:"img/pdf.png", tipo:"Doc", id:av.id, pdf:urlCreator.createObjectURL(new Blob([data], { type: `application/${extension}` }))})
                        } else{
                            docs.value.push({doc:urlCreator.createObjectURL(new Blob([data], { type: `image/${extension}` })), tipo:"Img", id:av.id, pdf:null})
                        }  
                    }
                    if(av.ruta4){
                        const nombreCortado = av.ruta4.split('.');
                        const extension = nombreCortado[ nombreCortado.length - 1 ];
                        const json4 = await api.get(`api/uploads/11/${av.id}/documentos/ruta4`,{responseType: 'blob' });
                        const {data}=json4
                        if ( !extensionesImg.includes( extension ) ) {
                            docs.value.push({doc:"img/pdf.png", tipo:"Doc", id:av.id, pdf:urlCreator.createObjectURL(new Blob([data], { type: `application/${extension}` }))})
                        } else{
                            docs.value.push({doc:urlCreator.createObjectURL(new Blob([data], { type: `image/${extension}` })), tipo:"Img", id:av.id, pdf:null})
                        }  
                    }
                    if(av.ruta5){
                        const nombreCortado = av.ruta5.split('.');
                        const extension = nombreCortado[ nombreCortado.length - 1 ];
                        const json5 = await api.get(`api/uploads/11/${av.id}/documentos/ruta5`,{responseType: 'blob' });
                        const {data}=json5
                        if ( !extensionesImg.includes( extension ) ) {
                            docs.value.push({doc:"img/pdf.png", tipo:"Doc", id:av.id, pdf:urlCreator.createObjectURL(new Blob([data], { type: `application/${extension}` }))})
                        } else{
                            docs.value.push({doc:urlCreator.createObjectURL(new Blob([data], { type: `image/${extension}` })), tipo:"Img", id:av.id, pdf:null})
                        }  
                    }

                })   
            });   
            
        } catch (e) {            
            $q.notify({
              position: 'top',
              type: 'negative',
              message: e.response.data.msg
            }) 
        }
    }
    const verDoc =  async (id, tipo, imgD, pdf) => {  
        show_vista.value = true 
        tipoDoc.value = tipo
        imgDoc.value = pdf?pdf:imgD

        console.log(id, tipo, imgD)
    }

     onMounted( async() =>{
        getAviso()
        $q.loading.hide()
    })

    return {
        datos,
        slide,
        fullscreen: ref(false),
        docs,    
        show_vista,   
        tipoDoc,
        imgDoc,
        verDoc,
    }
  }
})


</script>


<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
  height: 300px 


</style>


