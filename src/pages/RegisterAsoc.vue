<template>
  <img src="~assets/wave.png" class="wave" alt="login-wave">
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-4 flex justify-center content-center">
      <img src="~assets/login.svg" class="responsive" alt="login-image">
    </div>
    <div v-bind:class="{'justify-center': $q.screen.md || $q.screen.sm ||$q.screen.xs}"
         class="col-12 col-md-8 flex content-center">
      <q-card v-bind:style="$q.screen.lt.sm ? {'width': '80%'} : {'width': '90%'}">
        <q-card-section>
          <q-avatar size="103px" class="absolute-center shadow-10">
            <img src="~assets/avatar.svg" alt="avatar">
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h4 class="text-h4 text-uppercase q-my-none text-weight-regular">Registro Asociado</h4>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form 
              class="q-gutter-md" 
              @submit.prevent="onSubmit"
              @reset="onReset"
              
            >
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-12 col-md-12 ">              
                  <q-input 
                    filled
                    label="Nombre de Condominio, Fraccionamiento o Edificio" 
                    :modelValue="inicio.nombre" 
                    @update:modelValue="val => inicio.nombre = val.toUpperCase()"                    
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'                    
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-8 ">              
                  <q-input 
                    filled
                    label="Vialidad de Domicilio"
                    :modelValue="inicio.calle" 
                    @update:modelValue="val => inicio.calle = val.toUpperCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'                    
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-4 ">              
                  <q-input 
                    filled
                    label="Número" 
                    :modelValue="inicio.numero" 
                    @update:modelValue="val => inicio.numero = val.toUpperCase()"  
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'                    
                    ]"
                  />
                </div>                
                <div class="col-12 col-sm-12 col-md-8 ">              
                  <q-input 
                    filled
                    label="Colonia"           
                    :modelValue="inicio.colonia" 
                    @update:modelValue="val => inicio.colonia = val.toUpperCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'                    
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-4">              
                  <q-input 
                    filled
                    label="Código Postal" 
                    :modelValue="inicio.cp" 
                    @update:modelValue="val => inicio.cp = val.toUpperCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'
                    ]"
                    mask="#####"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-6 ">              
                  <q-input 
                    filled
                    label="Estado"           
                    :modelValue="inicio.entidad" 
                    @update:modelValue="val => inicio.entidad = val.toUpperCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-6 ">              
                  <q-input 
                    filled
                    label="Municipio" 
                    v-model="inicio.municipio" 
                    :modelValue="inicio.municipio" 
                    @update:modelValue="val => inicio.municipio = val.toUpperCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-6 ">              
                  <q-input 
                    filled
                    label="Nombre de Representante"
                    :modelValue="inicio.representante" 
                    @update:modelValue="val => inicio.representante = val.toUpperCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio'
                    ]"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-6 ">              
                  <q-input 
                    filled
                    label="Correo electronico"
                    :modelValue="inicio.email" 
                    @update:modelValue="val => inicio.email = val.toLowerCase()"  
                    lazy-rules
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio',
                      isValidEmail                      
                    ]"
                    
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-6 ">              
                  <q-input 
                    filled
                    label="Confirma Correo electronico"                     
                    :modelValue="inicio.email1" 
                    @update:modelValue="val => inicio.email1 = val.toLowerCase()" 
                    lazy-rules 
                    :rules="[ 
                      val => val && val.length > 0 || 'Este campo es obligatorio',
                      isValidEmail,
                      isSameVariable                 
                    ]"
                    
                  />
                </div>

              </div>        
                <q-checkbox 
                  v-model="inicio.conditions"
                  label="Acepto las condiciones y términos de uso" 
                  :style="inicio.errorInConditions 
                          && !inicio.conditions
                          && 'color: red'"
                />
              <div>
                <q-btn class="full-width" color="primary" label="Registrar Usuario" type="submit" rounded></q-btn>
                <div class="text-center q-mt-sm q-gutter-lg">
                  <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
                  <q-btn label="Ir a Inicio" type="button"  @click="toLogIn" color="primary"/>
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
  name: 'inicio',
  data () {
    return {
      inicio: {
          nombre: '',
          calle: '',
          numero: '',
          colonia: '',
          cp: '',
          municipio: '',
          estado: '',
          representante: '',
          email: '',
          email1: '',
          conditions: false,
          errorInConditions: false
      }
    }
  },
  methods: {
    ...mapActions('auth', ['doInicio']),

    async onSubmit () {
      this.inicio.errorInConditions = false

      console.log('ENTRA')
      console.log(this.inicio)

      if ( !this.inicio.conditions ) {

          $q.notify({
            message: 'Debe de aceptar las condiciones',
            icon: 'las la-exclamation-circle',
            position: 'top',
          })
          this.inicio.errorInConditions = true
          return
        }

        this.doInicio(this.inicio).then((res) => {
           console.log('ENTRA LOG',res)    
           $q.notify({
                  type: 'positive',
                  message: 'Asociado creado con exito, favor de registar un usuario.',
                  position: 'top',
              })       
           const toPath = this.$route.query.to || '/register'
           this.$router.push(toPath)
          }).catch((err) => {          
            console.log('ERRORES',err.msg)           
              $q.notify({
                  type: 'negative',
                  message: err.msg,
                  position: 'top',
              })
          })
     
        
    },

    onReset() {
        this.inicio= {
            nombre: '',
            calle: '',
            numero: '',
            colonia: '',
            cp: '',
            municipio: '',
            estado: '',
            representante: '',
            email: '',
            email1: '',
            conditions: false,
            errorInConditions: false
        }
      },

      isValidEmail( val ) {
          const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
          return emailPattern.test(val) || 'El correo no parece ser válido';
      },

      isSameVariable( val ) {
        return ( val === this.inicio.email ) || 'El correo de confirmación no es igual.' 
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
