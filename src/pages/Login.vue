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
              <h3 class="text-h4 text-uppercase q-my-none text-weight-regular">Iniciar</h3>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitForm">
            <q-input label="Correo" v-model="login.correo" :rules="[ isValidEmail ]">
            </q-input>
            <q-input 
                label="Password"                 
                v-model="login.password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"
                :type="isPwd ? 'password' : 'text'" 
              >
                <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div>
              <q-btn class="full-width" color="primary" label="ENTRAR" type="submit" rounded></q-btn>
              <div class="text-center q-mt-sm q-gutter-lg">
                <router-link class="text-black" to="/register">Registrarse</router-link>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { mapActions } from 'vuex'

let $q

export default {
  name: 'Login',
  data () {
    return {
      login: {
        correo: '',
        password: ''
      },
      isPwd:true,
    }
  },
  methods: {
    ...mapActions('auth', ['doLogin']),

    async submitForm () {

      $q.loading.show({ message: 'Espere mientras termina el proceso...' })    

      if (!this.login.correo || !this.login.password) {

        $q.notify({
          type: 'negative',
          message: 'Los datos no son validos favor de verificar.',
          position: 'top',
        })
        $q.loading.hide()

      } else if (this.login.password.length < 6) {

        $q.notify({
          type: 'negative',
          message: 'la contraseña debe tener 8 o más caracteres',
          position: 'top',
        })
        $q.loading.hide()

      } else {

        this.doLogin(this.login).then((error) => {
           const toPath = this.$route.query.to || '/condominos/dashboard'
           this.$router.push(toPath)
           $q.loading.hide()
          }).catch((err) => {          
            console.log('ERRORES',err.msg)           
            $q.notify({
                type: 'negative',
                message: err.msg,
                position: 'top',
            })
            $q.loading.hide()
          })
          
      }
    },
    isValidEmail( val ) {
      console.log(val)
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'El correo no parece ser válido';
    },
  },
  mounted () {
    $q = useQuasar()
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
