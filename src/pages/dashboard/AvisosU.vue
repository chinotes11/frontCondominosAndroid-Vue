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
                                <q-icon color="primary" size="30px" name="notifications" />  Avisos Mensuales  </div>     
                                <div class="text-subtitle2">Sección donde se muestra el listado de avisos o notificaciones del mes.</div>                            
                            </q-card-section>
                        </q-card-section>
                    </q-card>
                </q-card-section>
                <q-card-section class="q-pa-md  q-gutter-md">
                    <q-list bordered>
                        <q-item v-for="seccion in secciones" :key="seccion.id" class="q-my-sm" clickable v-ripple @click="go(seccion.id)">
                            <q-item-section avatar>
                              <q-icon name="notifications_active" color="teal" />                            
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-subtitle1"> 
                                    <span class="text-subtitle1 text-weight-bold ">{{ seccion.titulo }}</span>
                                </q-item-label> 
                            </q-item-section>
                            
                            <q-item-section side>
                                <q-icon name="send" color="teal" />
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
import { api } from '../../boot/axios'

import {defineComponent} from 'vue';
export default defineComponent({
    name: 'AvisosU',
    components: {},
  
    setup() {
        const store = useStore()
        const $q = useQuasar() 
        const router = useRouter()
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
        const sesion = store.getters['auth/getMe'] 
        let secciones = ref([])

        const avisos = async () => {            
            try { 
                let payload = { 
                    "idconsorcio":sesion.idconsorcio
                }            
                const json = await api.post('api/selects/1/2', payload);
                const {data} = json.data  
                secciones.value = data  
                console.log('DATOS - ',data )
            } catch (e) {
                console.log(e)
            }
        }  

        onMounted( async() =>{                
            $q.loading.hide()
            avisos()
            
        })

        return {      
            a: computed( () => a.value),     
            secciones,    
            go:  (ruta) => { 
                router.push(`/condominos/contenedorusr/1/${ruta}`);
            } 
        }

    }
})
</script>


<style scoped>
</style>
