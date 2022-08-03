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
              <h2 class="text-h2 text-uppercase q-my-none text-weight-regular">Registro</h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form 
            class="q-gutter-md" 
            @submit.prevent="onSubmit"
            @reset="onReset"
          >

          <q-input 
              outlined 
              label="Id Asociado" 
              v-model="registro.idasociado" 
              lazy-rules
              mask="######"
              hint="Númerro de Id Asociado del Condominio, Fraccionamiento o Edificio"
              :rules="[ 
                val => val && val.length > 0 || 'Este campo es obligatorio'
              ]"
             />

            <q-input 
              outlined 
              label="Correo" 
              v-model="registro.correo" 
              :modelValue="registro.correo" 
              @update:modelValue="val => registro.correo = val.toLowerCase()" 
              lazy-rules
              :rules="[ 
                val => val && val.length > 0 || 'Este campo es obligatorio',
                isValidEmail
              ]"
             />

            <q-input 
                outlined 
                label="Contraseña" 
                v-model="registro.password"
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

              <q-input
                filled                
                v-model="registro.password2"
                label="Repetir contraseña"
                lazy-rules
                :rules="[ 
                  val => val && val.length > 0 || 'Este campo es obligatorio',
                  isSamePassword
                ]"
                :type="isPwd2  ? 'password' : 'text'" 
              >
               <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>

             <div >
              <q-img :src="imageSrc" />

              <q-btn  style="width:100%"  color="teal" size="20px" @click="captureImage" >                                
                    <div left class="text-subtitle2 text-left">
                    <q-icon left name="photo_camera" />
                        Tomar fotografía para conciliar pago
                    </div>                                
                </q-btn>
            </div>

              <q-checkbox 
                v-model="registro.conditions"
                label="Acepto las condiciones y términos de uso" 
                :style="registro.errorInConditions 
                        && !registro.conditions
                        && 'color: red'"
              />
            <div>
              <q-btn class="full-width" color="primary" label="Registrar Usuario" type="submit" rounded></q-btn>
              <div class="text-center q-mt-sm q-gutter-lg">
                <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
                <q-btn label="Iniciar Sesión " type="button"  @click="toLogIn" color="primary"/>
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
import { Camera, CameraResultType, CameraSource, Photo, Prompt } from '@capacitor/camera'

let $q

export default {
  name: 'Register',
  data () {
    return {
      registro: {
        idasociado:'',
        correo: '',
        password: '',
        password2: '',
        conditions: false,
        errorInConditions: false
      },
      isPwd:true,
      isPwd2:true,
      imageSrc:'',
      
    }
  },
  methods: {
      ...mapActions('auth', ['doRegistro']),

      async onSubmit () {
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })   

        this.registro.errorInConditions = false

        if ( !this.registro.conditions ) {

            $q.notify({
              message: 'Debe de aceptar los terminos y condiciones de uso.',
              icon: 'las la-exclamation-circle',
              position: 'top',
            })
            this.registro.errorInConditions = true
            $q.loading.hide()
            return
          }
          //admin@koolkat-pinturastermicas.com

          this.doRegistro(this.registro).then((res) => {
            
            $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Revise el correo registrado para activar su cuenta.'
                })
                
              $q.loading.hide()
              const toPath = this.$route.query.to || '/login'
              this.$router.push(toPath)
            }).catch((err) => {  
                                
                $q.notify({
                    type: 'negative',
                    message: err.msg,
                    position: 'top',
                })
                $q.loading.hide()
            })
          
      },

      


      async captureImage () {
        //const {Camera} = plugins
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt
        })

        // The result will vary on the value of the resultType option.
        // CameraResultType.Uri - Get the result from image.webPath
        // CameraResultType.Base64 - Get the result from image.base64String
        // CameraResultType.DataUrl - Get the result from image.dataUrl
        this.$imageSrc = image.webPath
      },

      onReset() {
          this.registro = {
            idasociado:'',
            email: '',
            password1: '',
            password2: '',
            conditions: false,
            errorInConditions: false
          }
      },

      isValidEmail( val ) {
          const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
          return emailPattern.test(val) || 'El correo no parece ser válido';
      },

      isSamePassword( val ) {
        return ( val === this.registro.password ) || 'Las contraseñas no son iguales' 
      },
      toLogIn() {
          this.$router.replace('/login');
      }
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
