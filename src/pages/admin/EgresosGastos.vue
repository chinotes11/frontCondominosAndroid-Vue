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
                                <q-icon color="primary" size="30px" name="monetization_on" />  Gastos o Egresos  </div>     
                                <div class="text-subtitle2">Sección para gestionar los gastos o egresos del condominio.</div>                            
                            </q-card-section>
                        </q-card-section>
                    </q-card>
                </q-card-section>
                <q-card-section  class="q-pt-xs" >
                    <q-list bordered>
                        <q-item v-for="seccion in secciones" :key="seccion.id" class="q-my-sm" clickable v-ripple @click="go(seccion.id)">
                            <q-item-section avatar>
                              <q-icon :name="seccion.icono" color="primary" />                            
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-subtitle1">{{ seccion.name }}</q-item-label>
                                <q-item-label caption lines="1">{{ seccion.descripcion }}</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-icon name="send" color="primary" />
                            </q-item-section>
                        </q-item>

                        <q-separator />
                    </q-list>
                </q-card-section>
            </q-card>     
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
import { seccionesAdm } from '../../helpers/utils'
const options2 = { style: 'currency', currency: 'MXN' };

import {defineComponent, defineAsyncComponent} from 'vue';
export default defineComponent({
    name: 'EgresosGastos',
    components: {},
  
    setup() {
        const store = useStore()
        const $q = useQuasar() 
        const router = useRouter()
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        const sesion = store.getters['auth/getMe'] 
        let secciones = ref([])

        onMounted( async() =>{                
            $q.loading.hide()
            secciones.value = seccionesAdm
        })

        return {      
            tab: ref('usrdom'),
            a: computed( () => a.value),     
            secciones,    
            go:  (ruta) => { 
                router.push(`/condominos/contenedoradm/${ruta}`);
            } 
        }

    }
})
</script>


<style scoped>
</style>
