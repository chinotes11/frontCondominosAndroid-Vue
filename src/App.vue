<template>
  <router-view/>
</template>
<script>
import { defineComponent } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'App',
  beforeCreate () {
    this.$store.dispatch('auth/init')
    const {token} = this.$store.getters['auth/getToken']
    console.log('TOK TOK',token);
    if (token) {      
      api.defaults.headers.common['x-token'] =  token.token
    } else {
      api.defaults.headers.common['x-token'] = ''
    }
  },
  created () {
    this.$q.dark.set(false)
  }
})
</script>
