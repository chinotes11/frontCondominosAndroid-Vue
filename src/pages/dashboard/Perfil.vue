<template>
  <q-page>
    <div class="row">

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card class="my-card" flat bordered>                 
            <q-card-section horizontal> 
       
                <q-card-section class="q-pt-xs">
                <div class="text-overline">Condominio Asociado ID - {{asociado.id}}</div>
                <div class="text-h5 q-mt-sm q-mb-xs">{{asociado.nombre}}</div>
                <div class="text-caption text-grey">
                    {{asociado.calle}} #{{asociado.numero}}, COL. {{asociado.colonia}}, C.P. {{asociado.cp}}, MUNICIPIO {{asociado.municipio}}
                </div>
                <div class="text-overline q-mt-sm ">
                    Usuario <br>
                    {{usuario.email}}
                </div>
                </q-card-section>

                <q-card-section class="col-2 flex flex-center">
                    <q-avatar size="110px">
                        <q-icon color="primary" size="90px" name="real_estate_agent" />
                    </q-avatar>                
                </q-card-section>
            </q-card-section>

            </q-card>
        </div>

        
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-card>
            <q-card-section>
                <q-form
                    class="q-gutter-md"
                    @submit.prevent="onSubmit"
                >
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-md ">
                        <q-card class="my-card" flat bordered>   
                            <q-card-section class="q-gutter-md" > 
                                <h6 class="text-h6 text-uppercase q-my-none text-weight-regular">Datos de Usuario</h6>

                                <q-input
                                    outlined
                                    v-model="usuario.nombre" 
                                    :modelValue="usuario.nombre" 
                                    @update:modelValue="val => usuario.nombre = val.toUpperCase()"
                                    lazy-rules   
                                    :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"                                            
                                    label="Nombre (s)"
                                    
                                />

                                <q-input
                                    outlined
                                    v-model="usuario.paterno"
                                    :modelValue="usuario.paterno" 
                                    label="Apellido Paterno"
                                    @update:modelValue="val => usuario.paterno = val.toUpperCase()"
                                    lazy-rules   
                                    :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"  

                                />

                                <q-input
                                    outlined
                                    v-model="usuario.materno"
                                    label="Apellido Materno"
                                    @update:modelValue="val => usuario.materno = val.toUpperCase()"

                                />

                                <q-input
                                    outlined
                                    v-model="usuario.telefono"
                                    label="Telefono Celular Principal"
                                    lazy-rules   
                                    :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"
                                    mask="## #### ####"
                                    fill-mask
                                    hint="10 Digitos: ## #### ####"
                                />

                                <q-input
                                    outlined
                                    v-model="usuario.telefonod"
                                    label="Telefono Celular Alternativo"
                                    mask="## #### ####"
                                    fill-mask
                                    hint="10 Digitos: ## #### ####"
                                />
                            </q-card-section>
                        </q-card>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-gutter-md">
                        <q-card class="my-card" flat bordered>   
                            <q-card-section class="q-gutter-md" > 
                                <h6 class="text-h6 text-uppercase q-my-none text-weight-regular">Domicilio</h6>                                

                                <q-select
                                    outlined
                                    v-model="domicilio.calle"
                                    :modelValue="domicilio.calle"
                                    emit-value
                                    map-options
                                    use-input
                                    option-label="nombre"
                                    option-value="nombre"
                                    :options="options.ops" 
                                    label="Calle, Edificio, Torre o Privada"                            
                                    behavior="menu"    
                                    @filter="filterFn"   
                                    lazy-rules        
                                    :disable="disabled"                       
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>

                                <q-input
                                    outlined
                                    v-model="domicilio.numeroext"
                                    :modelValue="domicilio.numeroext" 
                                    label="Numero Exterior"
                                    @update:modelValue="val => domicilio.numeroext = val.toUpperCase()"
                                    lazy-rules   
                                    :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"  
                                    :disable="disabled"

                                />

                                <q-input
                                    outlined
                                    v-model="domicilio.numeroint"
                                    :modelValue="domicilio.numeroint" 
                                    label="Numero Interior (Si aplica)"
                                    @update:modelValue="val => domicilio.numeroint = val.toUpperCase()"
                                    :disable="disabled"

                                />

                                <q-input
                                    outlined
                                    v-model="domicilio.numeroalf"
                                    :modelValue="domicilio.numeroalf" 
                                    label="Numero Alfanumerico (Si aplica)"
                                    @update:modelValue="val => domicilio.numeroalf = val.toUpperCase()"
                                    :disable="disabled"
                                />

                                <q-input
                                    outlined
                                    v-model="domicilio.piso"
                                    :modelValue="domicilio.piso" 
                                    label="Piso (Si aplica)"
                                    @update:modelValue="val => domicilio.piso = val.toUpperCase()"
                                    hint="Ejemplo 13 ó PB ó PH"
                                    :disable="disabled"
                                />

                                <q-input
                                    outlined
                                    v-model="domicilio.cp"
                                    @update:modelValue="val => domicilio.cp = val.toUpperCase()"
                                    label="Código Postal"
                                    fill-mask
                                    hint="5 Números: #####"
                                    maxlength="5"
                                    :disable="disabled"

                                />

                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <div>
                    <q-btn icon="save" label="Actualizar Datos" type="submit" :disable="disabled" color="primary"/>
                </div>
                </q-form>
            </q-card-section>
            </q-card>
        </div>

    </div>
  </q-page>
  <q-page-sticky position="top-right" :offset="[1, 1]">
        <q-fab fab icon="arrow_back" padding="md"  @click="$router.go(-1)" color="primary" />
    </q-page-sticky>
</template>

<script>

import useDomicilios from '../../composables/dashboard/useDomicilios'
import { api } from '../../boot/axios'
import { doWsSelect} from '../../helpers/utils'
import { ref, reactive, computed, onMounted  } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default {
    name:'Perfil',
    setup() {
        
        const store = useStore()  
        const $q = useQuasar()
        $q.loading.show({ message: 'Espere mientras termina el proceso...' })
                        
        let {usuario, domicilio, asociado, me, guardarInfo, disabled} = useDomicilios ()
        const sesion = store.getters['auth/getMe']  
        let arrVal=[]
        let options = reactive({
            ops: null,
            })            
         

        const getCalles = async () => {  
            let payload = { "idconsorcio":sesion.idconsorcio}       
            try {                
                const json = await api.post('api/selects/1/1', payload);
                const {data}=json.data
                arrVal = data    
                options.ops = data 
            } catch (e) {
                console.log(e)
            }
        }
        

        onMounted( async() =>{
                getCalles()
                $q.loading.hide()
        })

        return {
                usuario,
                domicilio,
                asociado,  
                me,   
                disabled,
                onSubmit: async (e,a) => {
                    guardarInfo(e,a)
                },            
                options,
                filterFn (val, update) {
                    if (val === '') {
                        update(() => {
                            options.ops = arrVal
                        })
                        return
                    }
                    update(() => {
                        const needle = val.toLowerCase()
                        options.ops = arrVal.filter(v => v.nombre.toLowerCase().indexOf(needle) > -1)
                    })
                }
                //calles: computed( () => datos.value),                    
                //@change="updateUsr(usuario, $event)" 
        }
        
    },
    
}
</script>

<style scoped>

</style>
