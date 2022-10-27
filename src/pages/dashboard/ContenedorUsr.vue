<template>
    <q-page>    
        <div class="fondo1">
            <q-card class="esqredonda">
                <br>
                <q-card-section class="q-pa-md  q-gutter-md">
                    <q-card class="my-card" flat no-border>                 
                        <q-card-section horizontal>        
                            <q-card-section class="q-pt-xs">
                                <div class="text-h6"> 
                                <q-icon color="primary" size="30px" :name="seccion.icono" />  {{seccion.name}}  </div>     
                                <div class="text-subtitle2">{{seccion.descripcion}}</div>                            
                            </q-card-section>
                        </q-card-section>
                    </q-card>
                </q-card-section>
            </q-card>
            <div>                         
                <div v-if="idC===1"  name="avisos">
                    <VistaAvisos></VistaAvisos>                                
                </div>
                <div  v-if="idC===2" name="documentos">
                    <VistaDocmentos></VistaDocmentos>
                </div>
                 
                <div  v-if="idC===3" name="balance">
                    <VistaBalance></VistaBalance>
                </div>
                <!--
                <div  v-if="idC===4" name="egresos">
                    <TablaEgresos></TablaEgresos>
                </div>                             -->
            </div>
                 
        </div>
    </q-page>  
    <q-page-sticky position="top-right" :offset="[20, 1]">
        <q-fab fab icon="arrow_back" padding="sm" @click="$router.go(-1)" color="primary" />
    </q-page-sticky>
</template>

<script>


import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { ref, computed, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seccionesUsr } from '../../helpers/utils'

import {defineComponent, defineAsyncComponent} from 'vue';
export default defineComponent({
    name: 'ContenedorUsr',
    components: {
        VistaAvisos: defineAsyncComponent(() => import('../components/dashboard/VerAvisosUsr/verAvisosUsr.vue')),
        VistaDocmentos: defineAsyncComponent(() => import('../components/dashboard/verDocumentosUsr/verDocumentosUsr.vue')),
        VistaBalance: defineAsyncComponent(() => import('../components/dashboard/VerBalance/verBalance.vue')),
    },
  
    setup() {
        const store = useStore()
        const $q = useQuasar() 
        const router = useRouter()
        const route = useRoute()
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        const sesion = store.getters['auth/getMe'] 
        const idC = Number(route.params.tipo)
        let seccion = ref([])        

        onMounted( async() =>{                
            $q.loading.hide()
            seccion.value = seccionesUsr.find(sec => Number(sec.id)== idC); 
            //console.log(seccion)
        })

        return {      
            a: computed( () => a.value), 
            seccion,
            idC,
        }

    }
})
</script>


<style scoped>
</style>
