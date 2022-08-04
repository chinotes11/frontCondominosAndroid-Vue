<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          
        </q-toolbar-title>

        

        <q-btn stretch flat to="/login" v-if="!isAuthenticated">Login</q-btn>       
        
        <!--
          <q-btn flat round dense icon="search" class="q-mr-xs" />
          <q-btn stretch flat @click="logout" icon="logout" alt="Cerrar Sesión" v-else></q-btn> 
          
        -->

        <q-btn stretch flat v-if="isAuthenticated" icon="account_circle">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div lines="1" class="text-h6 q-mb-md">Perfil Usuario </div>
                <q-btn
                  icon="real_estate_agent"
                    color="primary"
                    label="Editar"
                    push
                    size="md"
                    v-close-popup
                    to="/condominos/Perfil" 
                  />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <q-icon color="primary" size="70px" name="real_estate_agent" />
                </q-avatar>
                <div class="caption q-mt-md q-mb-xs">{{usr}}</div>
                <q-btn
                  icon="logout"
                    color="primary"
                    label="Salir"
                    push
                    size="md"
                    v-close-popup
                    @click="logout" 
                  />
                </div>
            </div>
          </q-menu>
        </q-btn>



      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
          class="q-mt-xs text-body2 text-weight-bold text-uppercase"
        >
        <q-icon name="home_work" size="30px" color="primary" />
          Condominos
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

     <q-footer reveal >
        
           <q-tabs 
            v-model="tab"
              dense
              inline-label
              align="justify"
              >
            <q-tab name="images" icon="home"/>
            <q-tab name="videos" icon="la-igloo" />
            <q-tab name="articles" icon="mail"  />
          </q-tabs>
        
      </q-footer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

const {rl} =JSON.parse(localStorage.getItem('token'))

let lista=[]
const linksListas = [
  {
      title: 'Inicio',
      caption: 'Datos Generales',
      icon: 'las la-home',
      link: '/condominos/dashboard',
      tipo:0,
      level: 0,
      children: []
  },
  {
      title: 'Flex Layout',
      caption: 'Estilos con Flex',
      icon: 'las la-layer-group',
      link: '/condominos/flex',
      tipo:0,
      level: 0,
      children: []
  },
  {
      title: 'Administración',
      caption: '',
      icon: 'admin_panel_settings',
      link: 'https://quasar.dev',
      tipo:1,
      level: 0,
      children: [{
            title: 'Panel',
            caption: 'Panel Administrativo',
            icon: 'dashboard_customize',
            link: '/condominos/admin',
            tipo:0,
            level: 1,
            children: []
        }, {
            title: 'Crear Calendario',
            caption: 'Calendario de Pagos',
            icon: 'date_range',
            link: '/condominos/calendariopagos',
            tipo:0,
            level: 1,
            children: []
        },]
  },
  
  {
      title: 'Discord Chat Channel',
      caption: 'chat.quasar.dev',
      icon: 'chat',
      link: 'https://chat.quasar.dev',
      tipo:0,
      level: 0,
      children: []
  },
  {
      title: 'Forum',
      caption: 'forum.quasar.dev',
      icon: 'record_voice_over',
      link: 'https://forum.quasar.dev',
      tipo:0,
      level: 0,
      children: []
  },
  {
      title: 'Twitter',
      caption: '@quasarframework',
      icon: 'rss_feed',
      link: 'https://twitter.quasar.dev',
      tipo:0,
      level: 0,
      children: []
  },
  {
      title: 'Facebook',
      caption: '@QuasarFramework',
      icon: 'public',
      link: 'https://facebook.quasar.dev',
      tipo:0,
      level: 0,
      children: []
  },
  {
      title: 'Quasar Awesome',
      caption: 'Community Quasar projects',
      icon: 'favorite',
      link: 'https://awesome.quasar.dev',
      tipo:0,
      level: 0,
      children: []
  }
]

switch (rl) {
    case 0:
    case 2:
        lista= linksListas.filter(lst =>Number(lst.tipo)==Number(rl) )
        break;

    case 1:
      console.log('LISTAS')
        lista=linksListas
        break;            
}

const linksList = lista


export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksList,
      usr:''
    }
  },
  methods: {
    
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    logout () {
      this.$store.dispatch('auth/signOut')
      this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
    
  },
  mounted(){
    this.usr = this.$store.getters['auth/getMe']?this.$store.getters['auth/getMe'].username:''   
    
  }
})
</script>
