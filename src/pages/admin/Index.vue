<template>
  <q-page>
    
    <div class="fondo1">
        <q-card class="esqredonda">
          <br>
          <q-card-section class="q-pa-md row items-start q-gutter-md">

            <div v-for="menu in menuAdmin" :key="menu.id" > 
              <q-card class="my-card bg-white text-gray-7 esqredondaInd" clickable v-ripple @click="go(menu.url)">
                <q-card-section >
                  <div class="text-h6"><q-icon color="teal" size="30px" :name="menu.icono" /> {{menu.name}} </div>
                  <div class="text-subtitle2">{{menu.descripcion}}</div>                
                </q-card-section>
                <q-separator  />
                <q-card-actions>
                  <q-btn class="full-width" outline color="primary" >{{menu.ir}} </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          
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
import { menuAdm } from '../../helpers/utils'


export default {
  name: 'Index',
  // computed: {
  //   ...mapGetters('auth', ['getMe'])
  // },
  //
  
  setup(props) {
    const store = useStore()
    const router = useRouter()
    let menuAdmin = ref(null)
    menuAdmin.value = menuAdm
    
    //const { data } = await  = await store.dispatch('fetchActivityTypes')computed( () => store.getters['auth/getMe'][0]),

    return {
      inicia: computed( () => store.getters['auth/getMe']),
      menuAdmin,
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