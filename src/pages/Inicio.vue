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
              <h3 class="text-h3 text-uppercase q-my-none text-weight-regular">Bienvenido</h3>
            </div>
          </div>
        </q-card-section><br>
        <q-card-section>
          <div class="text-center q-mt-sm ">
            <q-btn class="full-width" color="primary"  to="/login" label="Iniciar Sesión" rounded ></q-btn>            
          </div> 
          <br>
          <div class="text-center q-mt-sm ">
            <q-btn class="full-width" color="primary"  to="/register" label="Registrar Usuario" rounded ></q-btn>            
          </div>             
              
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
  name: 'Inicio',
  data () {
    return {
      login: {
        correo: 'prueba@1212.com',
        password: '1234567'
      }
    }
  },
  methods: {
    ...mapActions('auth', ['doLogin']),

    async submitForm () {
      
      if (!this.login.correo || !this.login.password) {
        $q.notify({
          type: 'negative',
          message: 'Los datos no son validos favor de verificar.',
          position: 'top',
        })
      } else if (this.login.password.length < 6) {
        $q.notify({
          type: 'negative',
          message: 'la contraseña debe tener 8 o más caracteres',
          position: 'top',
        })
      } else {

        this.doLogin(this.login).then((error) => {
           console.log('ENTRA LOG',error)
           const toPath = this.$route.query.to || '/admin'
           this.$router.push(toPath)
          }).catch((err) => {          
            console.log('ERRORES',err.msg)           
              $q.notify({
                  type: 'negative',
                  message: err.msg,
                  position: 'top',
              })
          })
        // try {
        //   await this.doLogin(this.login)
        //   const toPath = this.$route.query.to || '/admin'
        //   this.$router.push(toPath)
        // } catch (err) {
        //   console.log('err',err)
        //   if (err.response.data.detail) {
        //     $q.notify({
        //       type: 'negative',
        //       message: err.response.data.detail
        //     })
        //   }
        // }
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
