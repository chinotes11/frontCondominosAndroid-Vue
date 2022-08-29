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
                <div v-if="idC===1"  name="usrdom">
                    <TablaDomicilios></TablaDomicilios>                                
                </div>
                <div  v-if="idC===2" name="calles">
                    <TablaCalles></TablaCalles>
                </div>
                <div  v-if="idC===3" name="ingresos">
                    <TablaIngresos></TablaIngresos>
                </div>
                <div  v-if="idC===4" name="egresos">
                    <TablaEgresos></TablaEgresos>
                </div>                            
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
import { seccionesAdm } from '../../helpers/utils'
const options2 = { style: 'currency', currency: 'MXN' }

import {defineComponent, defineAsyncComponent} from 'vue';
export default defineComponent({
    name: 'CalendarioPagos',
    components: {
        TablaIngresos: defineAsyncComponent(() => import('../components/admin/EdicionCatalogos/Ingresos.vue')),
        TablaEgresos: defineAsyncComponent(() => import('../components/admin/EdicionCatalogos/Egresos.vue')),
        TablaDomicilios: defineAsyncComponent(() => import('../components/admin/EdicionCatalogos/Domicilios.vue')),
        TablaCalles: defineAsyncComponent(() => import('../components/admin/EdicionCatalogos/Calles.vue')),
    },
  
    setup() {
        const store = useStore()
        const $q = useQuasar() 
        const router = useRouter()
        const route = useRoute()
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        const sesion = store.getters['auth/getMe'] 
        const idC = Number(route.params.id)
        let seccion = ref([])        

        onMounted( async() =>{                
            $q.loading.hide()
            seccion.value = seccionesAdm.find(sec => Number(sec.id)== idC); 
            console.log(seccion)
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
