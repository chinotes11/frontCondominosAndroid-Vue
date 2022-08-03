<template>
  <img src="~assets/wave.png" class="wave" alt="login-wave">
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <img src="~assets/login.svg" class="responsive" alt="login-image">
    </div>
    <div v-bind:class="{'justify-center': $q.screen.md || $q.screen.sm ||$q.screen.xs}"
         class="col-12 col-md-6 flex content-center">
      <q-card v-bind:style="$q.screen.lt.sm ? {'width': '80%'} : {'width': '50%'}">
        <q-card-section>
          <q-avatar size="103px" class="absolute-center shadow-10">
            <img src="~assets/avatar.svg" alt="avatar">
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h3 class="text-h2 text-uppercase q-my-none text-weight-regular">Activando</h3>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { mapActions } from 'vuex'
import { useRoute } from 'vue-router'

let $q
let route
let id

export default {
  name: 'Login',
  data () {
    return {}
  },
  methods: {
    ...mapActions('auth', ['doActivar']),

    async activar () {
        this.doActivar(id).then((msg) => {
           $q.notify({
                type: 'positive',
                message: msg.msg,
                position: 'top',
            })
           const toPath = this.$route.query.to || '/login'
           this.$router.push(toPath)
          }).catch((err) => {                   
              $q.notify({
                  type: 'negative',
                  message: err.msg,
                  position: 'top',
              })
              const toPath = this.$route.query.to || '/register'
              this.$router.push(toPath)
          })
    },
  },
  mounted () {
    $q = useQuasar()
    route = useRoute()
    id = route.params.id
    this.activar()    
  }
}
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
