<template>
    <q-card>
        <q-card-section class="q-pa-none">
            <q-table
                title="Gestión de Ingresos"
                :rows="datos"
                :columns="columnas"
                row-key="categoria"
                :filter="filter"
                selection="single"
                v-model:selected="selected"
                :selected-rows-label="getSelectedString"
            >
                <template v-slot:top-right>
                <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                    <template v-slot:append>
                    <q-icon name="search"/>
                    </template>
                </q-input>
                <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter=!show_filter" flat/>
                </template>

                <template v-slot:body-selection="scope">
                    <q-toggle v-model="scope.selected" />
                </template>

                <!-- <template v-slot:body-cell="props">
                    <q-td :props="props">
                        <q-badge color="blue" :label="props.value" />
                        <div>{{props.row.id}}</div>
                    </q-td>
                </template> -->

                <template v-slot:body-cell-Action="props">
                    <q-td :props="props">
                        <q-btn color="primary" icon="edit" size="md" flat dense/>
                        <q-btn color="primary" icon="delete" size="md" class="q-ml-sm" flat dense/>
                    </q-td>
                </template>

                <template v-slot:body-cell-activo="props">
                    <q-td :props="props">
                         <q-toggle color="primary" v-model="props.value" :true-value="verdadero" :false-value="falso"/>
                                                       
                        {{props.value}}                  
                    </q-td>
                </template>
            </q-table>
            <div class="q-mt-md">
                Selected: {{ JSON.stringify(selected) }}
            </div>
        </q-card-section>
    </q-card>
</template>

<script>

import { useStore } from 'vuex'
import { useQuasar, QSpinnerGears  } from 'quasar'
import { defineComponent, reactive, ref, computed, onMounted} from 'vue';
import { api } from '../../../../boot/axios'

const data = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
];

const columnas = [
  {name: 'categoria', label: 'Concepto', field: 'categoria', align: 'left', sortable: true  },
  {name: 'tipo', align: 'center', label: 'Tipo de Concepto', field: 'tipo', sortable: true},
  {name: 'activo', label: 'Activo', field: 'activo', sortable: true},
  {name: 'Action', label: '', field: 'Action', sortable: false, align: 'center'}
  //{name: 'categoria', required: true, label: 'Concepto', field: 'categoria', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true  },
  //{name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  
];
export default defineComponent({
  name: "TableBasic",
  setup() {
    const store = useStore()
    const $q = useQuasar() 
    $q.loading.show({ message: 'Espere mientras termina el proceso...' })
    const sesion = store.getters['auth/getMe'] 
    const show_filter = ref(false)
    let selected= ref([])
    let datos = ref()

    const seleccion = ()=>{
        console.log('SELECCION',selected.value)
        //return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
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
            const namesObj =  JSON.stringify(Object.keys(data[0])[0]); 
            console.log(namesObj)
            // arrVal = data    
            // options.ops = data 
        } catch (e) {
            console.log(e)
        }
    }
    
    onMounted( async() =>{
        getCategorias()
        $q.loading.hide()
    })

    return {
        filter: ref(''),
        show_filter,
        datos,
        columnas,
        selected,
        activos:ref(true),
        inactivos:ref(false),
        verdadero:ref(1),
        falso:ref(0),
        getSelectedString: ()=> {
            seleccion()
        }
    }
  }
})
</script>

<style scoped>
</style>
