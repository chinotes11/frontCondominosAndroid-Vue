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
                                <q-icon color="primary" size="30px" name="query_stats" /> Balances y Reportes </div>     
                                <div class="text-subtitle2">Sección para balances y reportes informativos.</div>                          
                            </q-card-section>
                        </q-card-section>
                    </q-card>
                </q-card-section>
            </q-card>  
            <VistaBalance></VistaBalance>  
        </div>
    </q-page>  
    <q-page-sticky position="top-right" :offset="[20, 1]">
        <q-fab fab icon="arrow_back" padding="sm" @click="$router.go(-1)" color="primary" />
    </q-page-sticky>
</template>

<script>


import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { ref, computed, onMounted} from 'vue';
import { useRouter } from 'vue-router'
const options2 = { style: 'currency', currency: 'MXN' };

import {defineComponent, defineAsyncComponent} from 'vue';
export default defineComponent({
    name: 'BalanceTabulado',
    components: {
        VistaBalance: defineAsyncComponent(() => import('../components/admin/BalanceTabulado/Balancetab.vue')),
    },
  
    setup() {
        const store = useStore()
        const $q = useQuasar() 
        const router = useRouter()
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        const sesion = store.getters['auth/getMe'] 

        onMounted( async() =>{                
            $q.loading.hide()
        })

        return {      
            tab: ref('usrdom'),
            a: computed( () => a.value),    
            go:  (ruta) => { 
                router.push(`/condominos/contenedoradm/${ruta}`);
            } 
        }

    }
})
</script>


<style scoped>
</style>
