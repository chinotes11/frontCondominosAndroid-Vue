<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <div class="q-pa-sm q-gutter-sm">
              <q-table title="Treats" :rows="datos" :columns="columnas" row-key="name" binary-state-sort>
                <template v-slot:top>
                  <q-btn  color="primary" icon="add_circle" label="Agregar ingreso" @click="nuevoRow" no-caps></q-btn>                    
                  <div class="q-pa-sm q-gutter-sm">
                    <q-dialog v-model="show_dialog">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6">{{tituloDialg}} tipo de Egreso</div>
                        </q-card-section>

                        <q-card-section>
                          <div class="row">
                            <q-input v-model="editedItem.name" label="Dessert Name"></q-input>
                            <q-input v-model="editedItem.calories" label="Calories"></q-input>
                            <q-input v-model="editedItem.fat" label="Fat"></q-input>
                            <q-input v-model="editedItem.carbs" label="Carbs"></q-input>
                            <q-input v-model="editedItem.protein" label="Protein"></q-input>
                            <q-input v-model="editedItem.sodium" label="Sodium"></q-input>
                            <q-input v-model="editedItem.calcium" label="Calcium"></q-input>
                            <q-input v-model="editedItem.iron" label="Iron"></q-input>
                          </div>
                        </q-card-section>
                        
                        <q-card-actions align="right">
                          <q-btn icon="cancel" label="Cerrar" color="primary" v-close-popup ></q-btn>
                          <q-btn icon="check_circle"  color="blue" v-close-popup @click="addRow" > {{tituloDialg}}</q-btn>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>                  
                </template>

                <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="desc" :props="props">
                        {{ props.row.name }}
                        <q-popup-edit v-model="props.row.name">
                          <q-input v-model="props.row.name" dense autofocus counter ></q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="calories" :props="props">
                        {{ props.row.calories }}
                        <q-popup-edit v-model="props.row.calories" title="Update calories" buttons>
                          <q-input type="number" v-model="props.row.calories" dense autofocus ></q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="fat" :props="props">
                        <div class="text-pre-wrap">{{ props.row.fat }}</div>
                        <q-popup-edit v-model="props.row.fat">
                          <q-input type="textarea" v-model="props.row.fat" dense autofocus ></q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="carbs" :props="props">
                        {{ props.row.carbs }}
                        <q-popup-edit v-model="props.row.carbs" title="Update carbs" buttons persistent>
                          <q-input type="number" v-model="props.row.carbs" dense autofocus hint="Use buttons to close" ></q-input>
                        </q-popup-edit>
                      </q-td>
                      <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
                      <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
                      <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
                      <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
                      <q-td key="actions" :props="props">
                        <q-btn color="blue" label="Actualizar" @click="editItem(props.row)" size="md" no-caps></q-btn>
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

export default defineComponent({
  name: "TableBasic",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    let editedIndex = ref(-1)
    let show_dialog = ref(false)
    let datos = ref()
    let columnas =ref()
    let tituloDialg= ref(' Agregar nuevo ')

    datos.value =  [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%"
        }
      ];

    columnas.value = [
      {
        name: "desc",
        required: true,
        label: "Dessert (100g serving)",
        align: "left",
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "calories",
        align: "center",
        label: "Calories",
        field: "calories",
        sortable: true
      },
      {
        name: "fat",
        label: "Fat (g)",
        field: "fat",
        sortable: true,
        style: "width: 10px"
      },
      { name: "carbs", label: "Carbs (g)", field: "carbs" },
      { name: "protein", label: "Protein (g)", field: "protein" },
      { name: "sodium", label: "Sodium (mg)", field: "sodium" },
      {
        name: "calcium",
        label: "Calcium (%)",
        field: "calcium",
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
      },
      {
        name: "iron",
        label: "Iron (%)",
        field: "iron",
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions"
      }
    ];

    let editedItem = ref( {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        sodium: 0,
        calcium: "0%",
        iron: "0%"
      })

    let defaultItem = ref({
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        sodium: 0,
        calcium: "0%",
        iron: "0%"
      })

    const nuevoRow = ()=>{      
      editedItem.value = defaultItem.value
      show_dialog.value = true      
    }

    const addRow = ()=>{
      if (editedIndex.value > -1) {
        Object.assign(datos.value[editedIndex.value], editedItem.value);
      } else {
        datos.value.push(editedItem.value);
      }
      console.log(datos.value)
      close()
    }

    const deleteItem = (item)=>{
      const index = datos.value.indexOf(item);
      console.log(item)

       $q.dialog({
              title: 'Confirmación de Borrado',
              message: `¿Esta usted seguro de borrar el registro?`,
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
            }).onOk(() => {
              datos.value.splice(index, 1);
               
            }).onCancel(() => {
              // console.log('>>>> Cancel')
            }).onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            })   


      // confirm("Are you sure you want to delete this item?") &&
      //   datos.value.splice(index, 1);
    }

    const editItem = (item)=>{
      tituloDialg.value=' Actualizar '
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
   

    const seleccion = ()=>{

    }   

    const getCategorias = async () => {   
        let payload = { 
          "idconsorcio": sesion.idconsorcio,
          "tipo": "ingresos"
          }        
        try {                
            const json = await api.post('api/selects/1/6', payload);
            const {data}=json.data
            datos.value=data
            console.log(data)
            const namesObj = JSON.stringify(Object.keys(data[0])[0]); 
            console.log(namesObj)
            // arrVal = data    
            // options.ops = data 
        } catch (e) {
            console.log(e)
        }
    }
    
    onMounted( async() =>{
        //getCategorias()
        $q.loading.hide()
    })

    return {
        nuevoRow,
        addRow,
        deleteItem,
        editItem,
        close,
        show_dialog,
        editedIndex,
        editedItem: computed( () => editedItem.value),
        defaultItem,
        columnas,
        datos,
        tituloDialg,
        getSelectedString: ()=> {
            seleccion()
        },
        
    }
  }
})


</script>

<style scoped>
</style>


