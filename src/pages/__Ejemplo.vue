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
                                <q-icon color="primary" size="30px" name="folder_open" />  Administrador de Catalogos  </div>     
                                <div class="text-subtitle2">Sección para crear o modificar, usuarios, domicilios, catalogo de ingresos ó egresos etc.</div>                            
                            </q-card-section>
                        </q-card-section>
                    </q-card>
                </q-card-section>
                <q-card-section>

                    

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
import { useQuasar, QSpinnerGears  } from 'quasar'
import { reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../boot/axios'
const moment = require('moment');
const options2 = { style: 'currency', currency: 'MXN' };
const numberFormat2 = new Intl.NumberFormat('es-MX', options2);

export default {
  name: 'CalendarioPagos',

  
  setup() {

    const store = useStore()
    const $q = useQuasar() 
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 


    onMounted( async() =>{
            
            $q.loading.hide()
    })

    return {       
      a: computed( () => a.value),  
     
      }

    }
}
</script>


<style scoped>
</style>
