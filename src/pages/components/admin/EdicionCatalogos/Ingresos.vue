<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
              <q-table 
                title="Ingresos" 
                :rows="datos" 
                :columns="columnas" 
                row-key="categoria" 
                binary-state-sort
                :filter="filter"
                :pagination="pagination"
              >

                <template v-slot:top-right>
                  <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Buscar en Tabla">
                      <template v-slot:append>
                      <q-icon name="manage_search"/>
                      </template>
                  </q-input>
                </template>

                <template v-slot:top-left>
                  <q-btn v-if="verListado" color="primary" icon="list" label="Mostrar Listado de Ingresos" @click="getCategorias" no-caps></q-btn>  
                  <q-btn v-if="!verListado" color="primary" icon="add_circle" label="Agregar Nuevo Ingreso" @click="nuevoRow" no-caps></q-btn>   
                                   
                  <div class="q-pa-sm q-gutter-sm">
                    <q-dialog v-model="show_dialog">
                      <q-card>
                        <q-card-section>
                          <div>
                            <span class="text-h6"> {{tituloDialg}} tipo de ingreso</span>
                            <span class="float-right"><q-btn icon="cancel" color="primary" v-close-popup ></q-btn></span>
                          </div>
                        </q-card-section>

                        <q-card-section>
                          <div class="row">
                            <div class="col-sm-12 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-input outlined v-model="editedItem.categoria" label="Nombre de Ingreso"></q-input>
                            </div>
                            <div class="col-sm-12 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-input outlined v-model="editedItem.tipo" label="Tipo" disable></q-input>
                            </div>
                            <div class=" col-sm-12 col-xs-12 q-pa-sm q-gutter-sm">
                              <q-toggle
                                    size="lg"
                                    name="mensual"
                                    label="Definir como ingreso de mensualidad o cuota ordinaria."
                                    v-model="editedItem.mensual"
                                    :true-value="Number(1)"
                                    :false-value="Number(0)"
                                    @click="validaMensual(editedItem)"

                                  />
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <q-list>
                                <q-item tag="label" v-ripple>
                                  <q-item-section>
                                    <q-item-label>Define si el concepto sigue activo.</q-item-label>
                                  </q-item-section>
                                  <q-item-section avatar>
                                     <q-toggle
                                      size="lg"
                                      name="activo"
                                      v-model="editedItem.activo"
                                      :true-value="Number(1)"
                                      :false-value="Number(0)"
                                    />
                                    <span v-if="editedItem.activo==1"> Activo</span>
                                    <span v-else> Inactivo</span>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                              
                            </div>
                          </div>
                        </q-card-section>
                        
                        <q-card-actions align="right">
                          <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                          <q-btn icon="check_circle"  color="blue" v-close-popup @click="addRow" > Guardar</q-btn>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>                  
                </template>

                <template v-slot:body="props">
                    <q-tr :props="props">                      
                      <q-td key="categoria" :props="props">{{ props.row.categoria }}</q-td>
                      <q-td key="tipo" :props="props" class="text-uppercase">{{ props.row.tipo }}</q-td>
                      <q-td key="mensual" :props="props">                        
                        <span v-if="props.row.mensual==1"> <q-badge color="teal">Mensualidad</q-badge> </span>
                      </q-td>
                      <q-td key="activo" :props="props">                        
                        <span v-if="props.row.activo==1"> <q-badge color="primary">Activo</q-badge> </span>
                        <span v-else><q-badge color="grey">Inactivo</q-badge> </span>
                      </q-td>
                      <q-td key="actions" :props="props">
                        <q-btn color="blue" label="Editar" @click="editItem(props.row)" size="md" no-caps></q-btn>
                        <q-btn color="red" label="Borrar"  @click="deleteItem(props.row)" size="md" no-caps></q-btn>
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
const moment = require('moment')

export default defineComponent({
  name: "ingresos",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    const show_filter = ref(false)
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    let editedIndex = ref(-1)
    let show_dialog = ref(false)
    let datos = ref([])
    let columnas =ref()
    let tituloDialg= ref(' Agregar nuevo ')
    let verListado = ref(true)

    columnas.value = [
      {name: 'categoria', label: 'Concepto de Egreso', field: 'categoria', align: 'left', sortable: true  },
      {name: 'tipo', label: 'Tipo de Concepto', field: 'tipo', sortable: true},
      {name: 'mensual', label: 'Mensualidad', field: 'mensual', sortable: true},
      {name: 'activo', label: 'Activo', field: 'activo', sortable: true},
      {name: "actions", label: "Acciones", field: "actions"
      }
    ];

    let editedItem = ref(  {            
        idconsorcio: sesion.idconsorcio,
        categoria: '',
        idctacontable: null,
        tipo: 'ingresos',
        visible: null,  
        mensual:0    
    })

    let defaultItem = ref({        
        idconsorcio: sesion.idconsorcio,
        categoria: '',
        tipo: 'ingresos',
        visible: 1,
        activo: 1,
        mensual:0
    })

    const nuevoRow = ()=>{      
      editedItem.value = defaultItem.value
      editedItem.value.mensual = 0
      show_dialog.value = true      
    }
    const validaMensual = (item)=>{  
      editedItem.value.mensual = datos.value.find(o => o.mensual===1) ? 0 : 1;  
    }

    const addRow = async ()=>{
      try {
        if (editedIndex.value > -1) {               
          const egreso = await api.put(`api/updates/${editedItem.value.id}/6`, editedItem.value);        
          await Promise.all([egreso]).then(function (res) {
              const egr = res[0].data.data
              console.log(egr[0]);
              Object.assign(datos.value[editedIndex.value], egr[0]);                          
              $q.notify({
                  position: 'top',
                  type: 'positive',
                  message: 'Se ha actualizado el egreso correctamente.'
              })      
              close()  
          });
          
        } else {   
          const egreso = await api.put(`api/inserts/6`, editedItem.value);        
          await Promise.all([egreso]).then(function (res) {
              const egr = res[0].data.data
              console.log(egr[0]);  
              datos.value.push(egr[0]);                       
              $q.notify({
                  position: 'top',
                  type: 'positive',
                  message: 'Se ha creado un nuvo egreso correctamente.'
              })    
              close()    
          });          
        }      
        
      } catch (error) {
          close() 
          $q.notify({
              position: 'top',
              type: 'negative',
              message: 'No se ha poddio guardar la información intentelo de nuevo.'
          }) 
          
      }        
    }

    const deleteItem = async (item)=>{

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
            const deletedAt = moment(new Date(Date.now())).format("yyyy-MM-DD HH:mm:ss")
            const ingreso = await api.put(`api/updates/${item.id}/6`, {activo:0,visible:0,deletedAt:deletedAt})      
            await Promise.all([ingreso]).then(function (res) {
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

    const editItem = (item)=>{        
        tituloDialg.value=' Editar '
        editedIndex.value = datos.value.indexOf(item);
        editedItem.value = Object.assign({}, item);
        show_dialog.value = true;
    }

    const close = ()=>{
      show_dialog.value = false
      setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      }, 300)
    }
   
    const getCategorias = async () => {   
        let payload = { 
          "idconsorcio": sesion.idconsorcio,
          "tipo": "ingresos"
          }        
        try {                
            const json = await api.post('api/selectsadmin/6', payload);
            const {data}=json.data
            datos.value=data
            verListado.value=!verListado.value
            console.log('DATOS - ',datos.value)
        } catch (e) {
             verListado.value=!verListado.value
             $q.notify({
              position: 'top',
              type: 'negative',
              message: e.response.data.msg
          }) 
        }
    }
    
    onMounted( async() =>{
        $q.loading.hide()
    })

    return {
        nuevoRow,
        addRow,
        deleteItem,
        editItem,
        close,
        validaMensual,
        getCategorias,
        show_dialog,
        editedIndex,
        editedItem: computed( () => editedItem.value),
        defaultItem,
        columnas,
        datos: computed( () => datos.value),
        tituloDialg,
        filter: ref(''),
        show_filter,
        verListado: computed( () => verListado.value),   
        pagination: { rowsPerPage: 10 },  
    }
  }
})

</script>

<style scoped>
</style>


