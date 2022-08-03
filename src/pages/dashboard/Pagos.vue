<template>

    <q-page>
        <div class="q-mt-md row">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">

                <div class="q-px-lg q-pb-md">
                    
                    <q-timeline color="grey">
                    <q-timeline-entry  
                        class="text-h4" 
                        body="Proceso de Pago" />

                    <q-timeline-entry
                        title="Saldo deudor"
                        color="red"
                        subtitle="Febrero 01, 2022"
                        icon="warning"
                        body="$ 430.00"
                    />

                    <q-timeline-entry
                        title="Aprobación en Proceso"
                        color="orange"
                        subtitle="Febrero 15, 2022"
                        icon="swap_vert"
                        body="Su pago lo esta revisando la administración."
                    />

                    <q-timeline-entry
                        title="Pagado"
                        subtitle="Febrero 17, 2022"
                        color="green"
                        icon="done_all"
                        body="Su pago se ha realizado con exito."
                    />
                    </q-timeline>
                </div>
                <q-separator color="primary" inset />
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
    </q-page>
    <q-page-sticky position="top-right" :offset="[1, 1]">
        <q-fab fab icon="arrow_back"  @click="$router.go(-1)" color="primary" />
    </q-page-sticky>
</template>

<script>

import { api } from '../../boot/axios'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { ref, reactive, computed, onMounted  } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'


export default {
    name:'Pagos',
  setup () {
    let imgPago=ref('')
    const $q = useQuasar()
    const imageSrc = ref('')

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

    return {
        archivo: ref(null),
        imgPago,
        SubirArch: async (e) => {
            createStoreDoc(e)
        },
        imageSrc,
        captureImage,
      
    }
  }
}
</script>
