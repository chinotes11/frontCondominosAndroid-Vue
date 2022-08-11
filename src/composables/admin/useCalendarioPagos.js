import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '../../boot/axios'
import { meses } from '../../helpers/utils'
const moment = require('moment');
const options2 = { style: 'currency', currency: 'MXN' };
const numberFormat2 = new Intl.NumberFormat('es-MX', options2);

// let $q
// console.log('QQQ',$q)

const useCalendarioPagos = () =>{  

    
    return {
        
    }
}


export default useCalendarioPagos
