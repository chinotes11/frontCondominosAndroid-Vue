
    
<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
                <q-card bordered>
                    <q-card-section>
                        <div class="text-h6">{{ datos.titulo }}</div>
                    </q-card-section>

                    <q-separator dark inset />

                    <q-editor 
                        readonly 
                        v-model="datos.descripcion" 
                        min-height="5rem" 
                        :toolbar="[
                            ['fullscreen'],
                        ]"
                        />
                    
                </q-card>
            </div>
        </q-card-section>
    </q-card>
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
    console.log("IDC ",idC)
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    let datos = ref([])

    const getAviso = async () => {    
        try { 
            let payload = { 
                "idconsorcio": sesion.idconsorcio,
                "id": idC
            }                 
            const json = await api.post('api/selects/1/2', payload);
            const {data}=json.data
            datos.value=data[0]
            
        } catch (e) {            
            $q.notify({
              position: 'top',
              type: 'negative',
              message: e.response.data.msg
            }) 
        }
    }

     onMounted( async() =>{
        getAviso()
        $q.loading.hide()
    })

    return {
        datos

       
    }
  }
})


</script>

<style scoped>
</style>


