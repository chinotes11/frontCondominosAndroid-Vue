<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
              <q-table 
                title="Usuarios/Domicilios" 
                :rows="datos" 
                :columns="columnas" 
                row-key="id" 
                binary-state-sort                
                :pagination="pagination"
                :filter="filtros"
              >

                <!-- <template v-slot:top-right>
                  
                </template> -->

                <template v-slot:top>
                  <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">    
                     <q-select
                          outlined
                          v-model="buscar.bsqDom"
                          :modelValue="buscar.bsqDom"
                          emit-value
                          map-options
                          use-input
                          option-label="nombre"
                          option-value="nombre"
                          :options="options.ops" 
                          label="Buscar Calle/Edificio/Torre/Privada"                            
                          behavior="menu"    
                          @filter="filterFn"   
                          lazy-rules                  
                      >
                          <template v-slot:no-option>
                          <q-item>
                              <q-item-section class="text-grey">
                              Sin  resultados
                              </q-item-section>
                          </q-item>
                          </template>
                      </q-select>                  
                  </div>
                  <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">   
                    <q-input
                            outlined
                            v-model="buscar.bsqNom"
                            :modelValue="buscar.bsqNom" 
                            @update:modelValue="val => buscar.bsqNom = val.toUpperCase()"
                            label="Buscar por Nombre"
                        >
                     </q-input> 
                  </div>
                  <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">   
                    <q-btn color="primary" icon="search" label="Buscar por filtros" @click="getCategorias" no-caps></q-btn>  
                  </div>
                  <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">   
                    <q-btn color="primary" icon="list" label="Mostrar listado completo" @click="getCategorias" no-caps></q-btn>  
                  </div>
                  <!-- <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">  </div>
                  <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm" v-if="verListado" >   
                    <q-input  outlined borderless dense debounce="300" v-model="filtros" :modelValue="filtros"  placeholder="Buscar en la tabla">
                        <template v-slot:append>
                        <q-icon name="manage_search"/>
                        </template>
                    </q-input>
                  </div> -->

                  <div class="q-pa-sm q-gutter-sm">
                    <q-dialog v-model="show_dialog" :maximized="true">
                      <q-card>
                        <q-card-section>
                          <div>
                            <span class="text-h6"> {{tituloDialg}} domicilio</span>
                            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
                          </div>
                        </q-card-section>

                        <q-card-section>
                          <div class="row">
                            <div class="col-sm-6 col-xs-12  q-pa-sm q-gutter-sm">                             
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
                                    label="Calle/Edificio/Torre/Privada"                            
                                    behavior="menu"    
                                    @filter="filterFn"   
                                    lazy-rules       
                                                         
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-input
                                    outlined
                                    v-model="domicilio.numeroext"
                                    :modelValue="domicilio.numeroext" 
                                    label="Numero Exterior"
                                    @update:modelValue="val => domicilio.numeroext = val.toUpperCase()"
                                    lazy-rules   
                                    :rules="[ val => val && val.length > 0 || 'Este campo es obligatorio']"  
                                    

                                />
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                <q-input
                                    outlined
                                    v-model="domicilio.numeroint"
                                    :modelValue="domicilio.numeroint" 
                                    label="Numero Interior (Si aplica)"
                                    @update:modelValue="val => domicilio.numeroint = val.toUpperCase()"
                                    

                                />
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                <q-input
                                    outlined
                                    v-model="domicilio.numeroalf"
                                    :modelValue="domicilio.numeroalf" 
                                    label="Numero Alfanumerico (Si aplica)"
                                    @update:modelValue="val => domicilio.numeroalf = val.toUpperCase()"
                                    
                                />
                            </div>
                            <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                <q-input
                                    outlined
                                    v-model="domicilio.piso"
                                    :modelValue="domicilio.piso" 
                                    label="Piso (Si aplica)"
                                    @update:modelValue="val => domicilio.piso = val.toUpperCase()"
                                    hint="Ejemplo 13 ó PB ó PH"
                                />
                            </div>
                                                          
                            <div class=" col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-list>
                                <q-item tag="label" v-ripple>
                                  <q-item-section>
                                    <q-item-label>Define si el domicilio esta activo o inactivo.</q-item-label>
                                  </q-item-section>
                                  <q-item-section avatar>
                                     <q-toggle
                                      size="lg"
                                      name="visible"
                                      v-model="domicilio.visible"
                                      :true-value="Number(1)"
                                      :false-value="Number(0)"
                                    />
                                    <span v-if="domicilio.visible==1"> Activo</span>
                                    <span v-else> Inactivo</span>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              
                            </div>
                          </div>
                        </q-card-section>
                        
                        <q-card-actions align="right">
                          <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                          <q-btn icon="check_circle" color="blue" label="Guardar" v-close-popup @click="addDom" >  </q-btn>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>   

                  <div class="q-pa-sm q-gutter-sm"> 
                    <q-dialog v-model="show_Usr" :maximized="true">
                      <q-card>
                        <q-card-section>
                          <div>
                            <span class="text-h6"> Datos Usuario </span>
                            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
                          </div>
                        </q-card-section>
                        <q-form 
                          class="q-gutter-md" 
                          @submit.prevent="onSubmit"
                          @reset="onReset"
                        >
                          <q-card-section>
                            <div class="row">
                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                <q-input 
                                  outlined 
                                  label="Correo" 
                                  v-model="usuario.email" 
                                  :modelValue="usuario.email" 
                                  @update:modelValue="val => usuario.email = val.toLowerCase()" 
                                  lazy-rules
                                  :rules="[ 
                                    val => val && val.length > 0 || 'Este campo es obligatorio',
                                    isValidEmail
                                  ]"
                                />
                              </div>
                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                <q-input
                                      outlined
                                      v-model="usuario.nombre" 
                                      :modelValue="usuario.nombre" 
                                      @update:modelValue="val => usuario.nombre = val.toUpperCase()"                                          
                                      label="Nombre (s)"
                                      
                                  />
                              </div>
                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                  <q-input
                                      outlined
                                      v-model="usuario.paterno"
                                      :modelValue="usuario.paterno" 
                                      label="Apellido Paterno"
                                      @update:modelValue="val => usuario.paterno = val.toUpperCase()"

                                  />
                              </div>
                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                  <q-input
                                      outlined
                                      v-model="usuario.materno"
                                      label="Apellido Materno"
                                      @update:modelValue="val => usuario.materno = val.toUpperCase()"

                                  />
                              </div>
                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                  <q-input
                                      outlined
                                      v-model="usuario.telefono"
                                      label="Telefono Celular Principal"
                                      mask="## #### ####"
                                      fill-mask
                                      hint="10 Digitos: ## #### ####"
                                  />
                              </div>
                                <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                  <q-input
                                      outlined
                                      v-model="usuario.telefonod"
                                      label="Telefono Celular Alternativo"
                                      mask="## #### ####"
                                      fill-mask
                                      hint="10 Digitos: ## #### ####"
                                  />                            
                              </div>
                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-input 
                                    outlined 
                                    label="Reestablecer Contraseña" 
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
                              </div>

                              <div class="col-sm-6 col-xs-12 q-pa-sm q-gutter-sm">
                                <q-input
                                    outlined                
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
                              </div>

                              <div class="col-sm-6 col-xs-12">
                                <q-list>
                                  <q-item tag="label" v-ripple>
                                    <q-item-section>
                                      <q-item-label>Define si el usuario está inactivo o inactivo.</q-item-label>
                                    </q-item-section>
                                    <q-item-section avatar>
                                      <q-toggle
                                        size="lg"
                                        name="estatus"
                                        v-model="usuario.visible"
                                        :true-value="Number(1)"
                                        :false-value="Number(0)"
                                      />
                                      <span v-if="usuario.estatus==1"> Activo</span>
                                      <span v-else> Inactivo</span>
                                    </q-item-section>
                                  </q-item>
                                </q-list>                              
                              </div>  

                            </div>
                          </q-card-section>

                        </q-form>
                        
                        <q-card-actions align="right">
                          <q-btn icon="cancel" label="Cerrar" color="primary"  v-close-popup ></q-btn>
                          <q-btn icon="check_circle"  color="blue" type="submit"  v-close-popup  @click="addUsr" > Guardar </q-btn>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>                  
                </template>

                
                <template v-slot:body="props">
                    <q-tr :props="props">                      
                      <q-td key="domicilios" class="text-left" :props="props">   
                        <q-icon name="apartment" size="25px" color="primary" /><span v-if="props.row.calle" class="text-subtitle2">  {{props.row.calle}} #{{props.row.numeroext}} {{props.row.numeroint}} </span> <span class="text-subtitle2" v-if="props.row.nombre">, Piso {{props.row.piso}} </span><br>                     
                                            
                      </q-td>    
                      <q-td key="usuarios" class="text-left" :props="props">                           
                        <span class="text-subtitle2" v-if="props.row.nombre"> {{props.row.nombre}} {{props.row.paterno}} {{props.row.materno}}</span><br>
                        <span class="text-subtitle2"> {{props.row.username}}</span>
                      </q-td>                
                      <q-td key="usuario" :props="props">
                        <q-btn color="blue" icon="edit" label="Editar Usuario" @click="editUsr(props.row)" size="md" no-caps></q-btn>
                      </q-td>
                      <q-td key="domicilio" :props="props">
                        <q-btn color="red" icon="edit" @click="editDom(props.row)" size="md" no-caps>
                          <span v-if="props.row.idDomicilio">Editar Domicilio</span>
                          <span v-else>Crear Domicilio</span>
                        </q-btn>
                      </q-td>
                    </q-tr>
                </template>

              </q-table>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>

import { useStore } from 'vuex'
import { useQuasar, QSpinnerGears  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'

export default defineComponent({
  name: "ingresos",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    const show_filter = ref(false)
    let filtros= ref('')
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    let buscar = ref({
      bsqDom:null,
      bsqNom:null
    })
    let show_dialog = ref(false)
    let datos = ref([])

    let columnas =ref()
    columnas.value = [
      {name: 'domicilios', label: 'Domicilio', field: 'domicilios', align: 'left', format: val => `${val}`, sortable: true},
      {name: 'usuarios', label: 'Usuario', field: 'usuarios', align: 'left', format: val => `${val}`, sortable: true},      
      {name: "usuario", label: "", field: "usuario", align: 'center'},
      {name: "domicilio", label: "", field: "domicilio", align: 'center'}
    ];
    let tituloDialg= ref(' Crear ')
    let verListado = ref(false)
    const nuevoRow = ()=>{      
      editedItem.value = defaultItem.value
      editedItem.value.mensual = 0
      show_dialog.value = true      
    }
    let isPwd = ref(true)
    let isPwd2 = ref(true)   
    let registro = ref(  {   
        password:'',         
        password2:''
    })
    let usuarioIndex = ref(-1)
    let show_Usr = ref(false)

    let usuario = ref( {   
        email:'',         
        materno:'',
        nombre:'aaaaa',
        paterno:'',
        rfccurp:'',
        telefono:'',
        telefonod:'',
        activo:1
    })

    let defaultUsuario = ref(  {   
        email:'',         
        materno:'',
        nombre:'',
        paterno:'',
        rfccurp:'',
        telefono:'',
        telefonod:'',
        activo:0
    })

    const editUsr = async (item) => {  
      try {   
          usuarioIndex.value = datos.value.indexOf(item);  
          show_Usr.value = true;  
          let payload = { 
            "iduser": item.id
          }            
          const json = await api.post('api/selectsadmin/16', payload);
          const {data}=json.data
          usuario.value=data[0]
          //
      } catch (e) {
        console.log(e)
            $q.notify({
            position: 'top',
            type: 'negative',
            message: 'No se ha poddio cargar la información revise su conexión.'
        }) 
      }        
    }

    const addUsr = async ()=>{
      try {
        if (usuarioIndex.value > -1) { 
          
          let payload = { 
            "username": usuario.value.email,
            "visible": usuario.value.visible,
          }

          const usrDatos = await api.put(`api/updates/${usuario.value.id}/16`, usuario.value); 
          const user = await api.put(`api/updates/${usuario.value.iduser}/15`, payload);           
          await Promise.all([usrDatos,user]).then(function (res) {
              const usr = res[0].data.data
              datos.value[usuarioIndex.value].username=usr[0].email
              datos.value[usuarioIndex.value].nombre=usr[0].nombre
              datos.value[usuarioIndex.value].paterno=usr[0].paterno
              datos.value[usuarioIndex.value].materno=usr[0].materno                         
              $q.notify({
                  position: 'top',
                  type: 'positive',
                  message: 'Se ha actualizado el usuario correctamente.'
              })      
              close()  
          });          
        }         
      } catch (error) {
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          }) 
          
      }        
    }

    let domicilioIndex = ref(-1)

    let domicilio = ref(  {
            iduser: 0,
            idconsorcio: sesion.idconsorcio,
            calle: '',
            numeroext: '',
            numeroint: '',
            numeroalf: '',
            piso: '',
            cp: '',
            vehiculos: 0,
            editable: 1,
            aviso: 0,
            notificacion: 0,
            activo: 1,
            visible:1
    })

    let defaultDomicilio = ref({        
        iduser: 0,
        idconsorcio: sesion.idconsorcio,
        calle: '',
        numeroext: '',
        numeroint: '',
        numeroalf: '',
        piso: '',
        cp: '',
        vehiculos: 0,
        editable: 1,
        aviso: 0,
        notificacion: 0,
        activo: 1,
        visible:1
    })

    const editDom = async (item) => {  
      try {    
          domicilioIndex.value = datos.value.indexOf(item)
          tituloDialg.value=' Editar '
          show_dialog.value = true
          //getCalles()
          if(item.idDomicilio){
            let payload = { 
              "id": item.idDomicilio
            }            
            const json = await api.post('api/selectsadmin/12', payload)
            const {data}=json.data
            domicilio.value=data[0]
          } else {
            domicilio.value=defaultDomicilio.value
          }
      } catch (e) {
        console.log(e)
            $q.notify({
            position: 'top',
            type: 'negative',
            message: 'No se ha poddio cargar la información revise su conexión.'
        }) 
      }        
    }

const addDom = async ()=>{
      try {

        if (domicilio.value.id) {  
          console.log("EDITA",datos.value[domicilioIndex.value])   
          const dom = await api.put(`api/updates/${domicilio.value.id}/12`, domicilio.value);        
          await Promise.all([dom]).then(function (res) {
              const egr = res[0].data.data
              datos.value[domicilioIndex.value].calle=egr[0].calle
              datos.value[domicilioIndex.value].idDomicilio=egr[0].id
              datos.value[domicilioIndex.value].numeroext=egr[0].numeroext
              datos.value[domicilioIndex.value].numeroint=egr[0].numeroint
              datos.value[domicilioIndex.value].piso=egr[0].piso
              $q.notify({
                  position: 'top',
                  type: 'positive',
                  message: 'Se ha actualizado el egreso correctamente.'
              })      
              close()  
          });
          
        } else {
          console.log("INSERTA",domicilioIndex.value)  
          domicilio.value.iduser=datos.value[domicilioIndex.value].id
          const dom = await api.put(`api/inserts/12`, domicilio.value);        
          await Promise.all([dom]).then(function (res) {
              const egr = res[0].data.data
              datos.value[domicilioIndex.value].calle=egr[0].calle
              datos.value[domicilioIndex.value].idDomicilio=egr[0].id
              datos.value[domicilioIndex.value].numeroext=egr[0].numeroext
              datos.value[domicilioIndex.value].numeroint=egr[0].numeroint
              datos.value[domicilioIndex.value].piso=egr[0].piso
              $q.notify({
                  position: 'top',
                  type: 'positive',
                  message: 'Se ha creado un nuvo egreso correctamente.'
              })    
              close()    
          });          
        }      
        
      } catch (error) {
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          }) 
          
      }        
    }

    const deleteItem = async ( item )=>{

      try {
        const index = datos.value.indexOf(item);       
        $q.dialog({
            title: 'Confirmación de Borrado',
            message: `¿Esta usted seguro de borrar el registro, recuerde que la información vinculada a este desaparecerá, desea continuar con el proceso?`,
            html: true,
            ok: {
              push: true,
              color: 'blue',
              label: 'Aceptar',
              icon: 'check_circle'
              
            },
            cancel: {
              push: true,
              color: 'primary',
              label: 'Cancelar',
              icon: 'cancel'
            },
            persistent: true
          }).onOk( async() => {
            const egreso = await api.put(`api/updates/${item.id}/6`, {activo:0,visible:0});        
            await Promise.all([egreso]).then(function (res) {
                const egr = res[0].data.data
                datos.value.splice(index, 1);                       
                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha actualizado el egreso correctamente.'
                })      
                close()  
            });
          }).onCancel(() => {
          }).onDismiss(() => {})   
        
      } catch (error) {
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          })           
      }   
      // confirm("Are you sure you want to delete this item?") &&
      //   datos.value.splice(index, 1);
    }

  
    const close = ()=>{
      show_dialog.value = false
      show_Usr.value = false
      setTimeout(() => {
        usuario.value = Object.assign({}, defaultDomicilio.value)
        usuarioIndex.value = -1
        domicilio.value = Object.assign({}, defaultUsuario.value)
        domicilioIndex.value = -1        
      }, 300)
    }
   
    const getCategorias = async () => {  
        datos.value=[]  
        let payload = { 
          "idconsorcio": sesion.idconsorcio
        }  
        console.log(buscar.value)

        if(buscar.value.bsqDom){payload.calle=buscar.value.bsqDom }
        if(buscar.value.bsqNom){payload.nombre=buscar.value.bsqNom  } 
        verListado.value=!verListado.value  
       
        try {                
            const json = await api.post('api/selectsadmin/20', payload);
            const {data}=json.data
            datos.value=data
            buscar.value.bsqDom=null
            buscar.value.bsqNom=null
            verListado.value=true
        } catch (e) {
             $q.notify({
              position: 'top',
              type: 'negative',
              message: e.response.data.msg
          }) 
        }
    }

    const isValidEmail = ( val ) => {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'El correo no parece ser válido';
    }

    const isSamePassword = ( val ) => {
        return ( val === registro.value.password ) || 'Las contraseñas no son iguales' 
    }

    let arrVal=[]
    let options = reactive({
        ops: null,
    })    

    const getCalles = async () => {  
        let payload = { "idconsorcio":sesion.idconsorcio}       
        try {                
            const json = await api.post('api/selectsadmin/1', payload);
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
        nuevoRow,
        deleteItem,
        close,
        isValidEmail,
        isSamePassword,
        getCategorias,
        columnas,
        isPwd,
        isPwd2,
        datos: computed( () => datos.value),
        registro: computed( () => registro.value),
        tituloDialg,
        filtros,
        show_filter,
        verListado: computed( () => verListado.value), 
        buscar: computed( () => buscar.value),   

        

        show_dialog,        
        domicilioIndex,
        domicilio: computed( () => domicilio.value),
        defaultDomicilio,
        editDom,
        addDom,


        show_Usr,
        usuarioIndex,
        usuario: computed( () => usuario.value),
        defaultUsuario,
        editUsr, 
        addUsr,

        pagination: { rowsPerPage: 10 },
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
    }
  }
})


</script>

<style scoped>
</style>


