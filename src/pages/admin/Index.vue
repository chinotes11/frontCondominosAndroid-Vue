<template>
  <q-page>
    
    <div class="fondo1">
        <q-card class="esqredonda">
          <br>
          <q-card-section class="q-pa-md row items-start q-gutter-md">

            <q-card class="my-card bg-white text-gray-7 esqredondaInd" >
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="query_stats" />  Balance General </div>
                <div class="text-subtitle2">Sección para crear el calendario de cuotas ordinarias mensual.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline  color="primary" > Ir a Balance General </q-btn>
              </q-card-actions>
            </q-card>

             <q-card class="my-card bg-white text-gray-7 esqredondaInd" >
              <q-card-section >
                <div class="text-h6"><q-icon color="teal" size="30px" name="payments" /> Conciliar Pagos o ingresos </div>
                <div class="text-subtitle2">Sección para conciliación de pagos o ingresos del condominio.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Conciliar Pagos </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="monetization_on" /> Gastos o egresos</div>
                <div class="text-subtitle2">Sección para gestionar los gastos o egresos del condominio.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Gastos </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd" clickable v-ripple @click="go('calendariopagos')">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="date_range" />  Calendario de Pago </div>
                <div class="text-subtitle2">Sección para crear el calendario de cuotas ordinarias mensual.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" to="/condominos/calendariopagos"  >Ir a Calendario de Pago </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd"  clickable v-ripple @click="go('admincatalogos')">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="folder_open" />  Administrador de Catalogos </div>
                <div class="text-subtitle2">Sección para crear o modificar, usuarios, domicilios, categorias ingresos egresos etc.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" to="/condominos/admincatalogos" >Ir a Administrador de Catalogos </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="description" />  Documentos </div>
                <div class="text-subtitle2">Sección para subir documentos como reglamento o acta constitutiva.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Documentos </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="notifications" />  Avisos </div>
                <div class="text-subtitle2">Sección para crear los avisos del mes y volver a activarlos.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Avisos </q-btn>
              </q-card-actions>
            </q-card>

            

            <q-card class="my-card bg-white text-gray-7 esqredondaInd">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="sports_kabaddi" /> Gestor de Amenidades </div>
                <div class="text-subtitle2">Sección para crear el calendario de amenidades o actividades.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Gestor de Amenidades </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="print" />  Reportes </div>
                <div class="text-subtitle2">Sección para generar reoprtes de la administracion del condominio.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Reportes </q-btn>
              </q-card-actions>
            </q-card>

            <q-card class="my-card bg-white text-gray-7 esqredondaInd">
              <q-card-section>
                <div class="text-h6"><q-icon color="teal" size="30px" name="report" />  Incidentes </div>
                <div class="text-subtitle2">Sección para dar seguimiento al reporte de incidentes.</div>                
              </q-card-section>
              <q-separator  />
              <q-card-actions>
                <q-btn class="full-width" outline color="primary" >Ir a Reportes </q-btn>
              </q-card-actions>
            </q-card>

          
          </q-card-section>
        </q-card>
    </div>
  </q-page> 
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'


export default {
  name: 'Index',
  // computed: {
  //   ...mapGetters('auth', ['getMe'])
  // },
  //
  
  setup(props) {
    const store = useStore()
    const router = useRouter()
    
    //const { data } = await  = await store.dispatch('fetchActivityTypes')computed( () => store.getters['auth/getMe'][0]),

    return {
      inicia: computed( () => store.getters['auth/getMe']),
      go:  (ruta) => { 
        router.push(`/condominos/${ruta}`);
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px


</style>