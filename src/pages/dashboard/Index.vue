<template>
  <q-banner dense inline-actions v-if="!usuario.nombre && !usuario.telefono || [domicilio].length===0 " class="text-white bg-orange ">
      Debe capturar los DATOS DE USUARIO y DOMICILIO para visulizar su información mensual. 
    <template v-slot:action>
      <q-btn flat color="white" icon="warning" label="Capturar" to="/condominos/Perfil" />
    </template>
  </q-banner>  

  <q-banner v-if="false" dense inline-actions class="text-white bg-orange ">
      Debe capturar un DOMICILIO para visulizar su información mensual.
    <template v-slot:action>
      <q-btn flat color="white" icon="warning" label="Capturar" to="/condominos/Perfil"/>
    </template>
  </q-banner> 
  
  <div class="fondo1">
    <q-card class="esqredonda">
      <q-card-section >  
          <q-item-label >
            <span class="cursor-pointer text-body2 text-weight-bolder text-uppercase text-grey-8"> 
              <q-icon color="primary" name="home_work" size="30px" /> Hola buen día  {{ usuario.nombre }} <br>
            </span>
            <span class="cursor-pointer text-body2 text-weight-medium text-uppercase text-grey-8"> 
              {{ domicilio.calle }} #{{ domicilio.numeroext }}  {{ domicilio.numeroint }} <span v-if="domicilio.piso"> Piso {{ domicilio.piso }}</span>
            </span>
          </q-item-label>      
      </q-card-section>

      <q-separator spaced />

      <q-card-section >
        <q-list v-if="usuario.nombre && usuario.telefono && [domicilio].length!=0" bordered separator color="primary" padding class="q-mt-xs ">      
          <!--<q-item-label header  class="text-white text-weight-bold bg-teal-5">PAGAR</q-item-label>-->

          <q-item clickable v-ripple to="/condominos/Pagos">
            <q-item-section avatar top>
              <q-avatar  size="40px" icon="payments" color="teal-5" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="q-mt-xs text-weight-bold text-h5 text-uppercase">
                <span class="cursor-pointer text-grey-8">$ 0.0</span>
              </q-item-label>
              <q-item-label class="q-mt-xs text-body2 text-weight-bold text-uppercase">
                  <span class="cursor-pointer text-green "><q-icon color="text-green" size="30px" name="done_outline" /> Tu cuenta esta al corriente  </span>          
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="arrow_forward_ios" color="teal-5" />
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <!--<q-item-label header  class="text-white text-weight-bold  bg-amber-9">HISTORIAL</q-item-label>-->

          <q-item clickable v-ripple>
            <q-item-section avatar top>
              <q-avatar  size="40px" icon="checklist" color="amber-9" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="q-mt-xs text-weight-bold text-h6 ">
                <span class="text-grey-8">Revisar historico de pagos</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="arrow_forward_ios" color="amber-9" />
            </q-item-section>
          </q-item>

        </q-list>

      </q-card-section>

    </q-card>

    

    <div class="q-pa-md q-gutter-sm">
      <q-btn color="primary" icon="mail" label="On Left" @click="mailF" />
    </div>
  </div>

</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar'

export default {
  name: 'Index',
  // computed: {
  //   ...mapGetters('auth', ['getMe'])
  // },
  //
  
  setup(props) {    
    const store = useStore()
    const $q = useQuasar()
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    console.log(store)
   
    //const { data } = await  = await store.dispatch('fetchActivityTypes')computed( () => store.getters['auth/getMe'][0]),    
    onMounted( async() =>{
        $q.loading.hide()
        
    })
    
    return {
      inicia: computed( () => store.getters['auth/getMe']),
      usuario: computed( () => store.getters['auth/getUser']),
      domicilio: computed( () => store.getters['auth/getDomicilio']),
      mailF:  () => store.dispatch('auth/getAlgo')
    }

  }
}
</script>

<style scoped>




</style>
