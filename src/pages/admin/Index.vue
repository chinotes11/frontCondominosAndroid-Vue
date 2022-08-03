<template>
  <h1>ADMIN Protected route</h1>
  <h3>Olá {{ inicia.username }}</h3>

  <div class="q-pa-md q-gutter-sm">
    <q-btn color="primary" icon="mail" label="On Left" @click="mailF" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { defineComponent, ref } from 'vue';

export default {
  name: 'Index',
  // computed: {
  //   ...mapGetters('auth', ['getMe'])
  // },
  //
  
  setup(props) {
    const store = useStore()
    //const { data } = await  = await store.dispatch('fetchActivityTypes')computed( () => store.getters['auth/getMe'][0]),

    return {
      inicia: computed( () => store.getters['auth/getMe']),
      mailF:  () => store.dispatch('auth/getAlgo')
    }

  }
}
</script>

<style scoped>

</style>
