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
  <div class="q-pa-md q-gutter-md fondo1" >
    <span class="cursor-pointer text-h6  text-uppercase text-white"> 
       ¡ Hola {{ usuario.nombre }} !<br>
    </span>
    <span class="cursor-pointer text-body2 text-white">
      Aquí esta tu resumen diario.
    </span>
  </div>
  
  <div class="fondo1">
    <q-card class="esqredonda">
      <q-card-section >  
          <q-item-label >
            <span class="cursor-pointer text-h6 text-uppercase text-grey-8"> 
             <q-icon color="primary" name="home_work" size="35px" /> {{ domicilio.calle }} #{{ domicilio.numeroext }}  {{ domicilio.numeroint }} <span v-if="domicilio.piso"> Piso {{ domicilio.piso }}</span>
            </span>
          </q-item-label>      
      </q-card-section>

      <q-separator spaced />

      <q-card-section >
        <q-list v-if="usuario.nombre && usuario.telefono && [domicilio].length!=0" bordered separator color="primary" padding class="q-mt-xs ">      
          <!--<q-item-label header  class="text-white text-weight-bold bg-teal-5">PAGAR</q-item-label>-->

          <q-item clickable v-ripple to="/condominos/Pagos">
            <q-item-section avatar top>
              <q-avatar  size="70px" icon="payments" color="teal-5" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="q-mt-xs text-body2 flex flex-center  text-uppercase">
                <span  v-if="monto=='0' || monto=='0.0'"  class="cursor-pointer teal-5 ">
                    <q-icon color="teal-5" size="30px" name="radio_button_checked" /> 
                     Por Pagar 
                  </span>
                  <span v-if="monto!='0' &&  monto!='0.0'"  class="cursor-pointer teal-5 ">
                    <q-icon color="red" size="30px" name="radio_button_checked" /> 
                     Por Pagar    
                  </span>     
                  <span v-if="monto!='0' &&  monto!='0.0'"  class="cursor-pointer teal-5 ">
                    <span> &nbsp;&nbsp;({{adeudo.cuenta}}) Adeudos  </span>
                </span>     
              </q-item-label>
              <q-item-label lines="1" class="q-mt-xs  flex flex-center ">
                <span class="cursor-pointer text-h4 text-uppercase text-grey-8">{{monto}}</span>
                
                <!-- <span v-if="monto!='0' &&  monto!='0.0'"  class="cursor-pointer teal-5 ">
                    <span> {{adeudo.cuenta}} Adeudos  </span>
                </span>   -->
              </q-item-label>
                  
              
            </q-item-section>

            <q-item-section side>
              <q-icon name="arrow_forward_ios" color="teal-5" />
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <!--<q-item-label header  class="text-white text-weight-bold  bg-amber-9">HISTORIAL</q-item-label>-->

          <q-item>
            <q-item-section>
              <div class="row ">
                <div class="col-12 col-md-12">       
                  <q-card>
                    <div class="row q-pa-md flex content-center">
                      
                      <div class="col-4 col-md-4 col-sm-6 col-xs-6 flex content-center">                 
                          <q-card-section class="q-pa-md row items-start q-gutter-md">                      
                            <div class="q-mt-xs">
                              <q-btn round padding="xl" color="white"   >
                                <q-icon color="primary" name="history" size="35px" />
                              </q-btn>
                              <br>
                              <span class="text-subtitle2 flex flex-center "> <br> Historial</span>                        
                            </div>                      
                          </q-card-section>
                      </div>
                      
                      <div class="col-4 col-md-4 col-sm-6 col-xs-6 flex content-center">                 
                          <q-card-section class="q-pa-md row items-start q-gutter-md">                      
                            <div class="q-mt-xs">
                              <q-btn round padding="xl" color="white"   >
                                <q-icon  color="primary" name="local_police" size="35px" />
                              </q-btn>
                              <br>
                              <span class="text-subtitle2 flex flex-center "> <br> Vigilancia</span>                        
                            </div>                      
                          </q-card-section>
                      </div>

                      <div class="col-4 col-md-4 col-sm-6 col-xs-6 flex content-center">                 
                          <q-card-section class="q-pa-md row items-start q-gutter-md">                      
                            <div class="q-mt-xs">
                              <q-btn round padding="xl" color="white"   >
                                <q-icon color="primary" name="speaker_phone" size="35px" />
                              </q-btn>
                              <br>
                              <span class="text-subtitle2 flex flex-center "> <br> Emergencias </span>                        
                            </div>                      
                          </q-card-section>
                      </div>

                    </div>
                  </q-card>
                </div>

              </div>
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
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { api } from '../../boot/axios'
import { useQuasar } from 'quasar'
const options2 = { style: 'currency', currency: 'MXN' };
const numberFormat2 = new Intl.NumberFormat('es-MX', options2);

export default {
  name: 'Index',
  // computed: {
  //   ...mapGetters('auth', ['getMe'])
  // },
  //
  
  setup() {    
    const store = useStore()
    const $q = useQuasar()
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    let sesion, dom, usr
    let adeudo = ref([])
    let monto = ref('')

    const adeudos = async () => {            
      try { 
          if(dom.calle){
            let payload = { 
              "idconsorcio":sesion.idconsorcio, 
              "iddomicilio":dom.id,
            }            
            const json = await api.post('api/selects/1/21', payload);
            const {data}=json.data           
            adeudo.value = data[0]              
            monto.value = numberFormat2.format(data[0].pagar)    
          }
          
      } catch (e) {
          console.log(e)
      }
    }  

    //const { data } = await  = await store.dispatch('fetchActivityTypes')computed( () => store.getters['auth/getMe'][0]),    
    onMounted( async() =>{
      
      sesion = store.getters['auth/getMe'] 
      dom = store.getters['auth/getDomicilio']
      usr = store.getters['auth/getUser']
      // for (let i = 1; i <= 4; i++) {
      //       setTimeout(function() { 
      //         adeudos() 
      //       }, 500);
      //   } 
      let i=0 
      do {
        i++;
      }
      while (!usr);
      console.log(dom)
      // if(!dom){
      //   console.log('ENTRAAA')
      // }
      
      adeudos()  
      $q.loading.hide()   
    })
    
    return {
      inicia: computed( () => store.getters['auth/getMe']),
      usuario: computed( () => store.getters['auth/getUser']),
      domicilio: computed( () => store.getters['auth/getDomicilio']),
      mailF:  () => store.dispatch('auth/getAlgo'),
      adeudo,
      monto,
    }

  }
}
</script>

<style scoped>




</style>
