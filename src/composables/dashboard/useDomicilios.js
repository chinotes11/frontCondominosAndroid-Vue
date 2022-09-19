
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '../../boot/axios'

// let $q
// console.log('QQQ',$q)

const useDomicilios = () =>{  
    
    const store = useStore()  
    const $q = useQuasar()
    const me = store.getters['auth/getMe']
    const user = store.getters['auth/getUser']
    let domicilia = store.getters['auth/getDomicilio']
    let domicilios={}
    let usuarios={}
    let disabled = ref(true);
        
    if(store.getters['auth/getDomicilio'].length==0){
        domicilios = ref ({
            iduser: me.id,
            idconsorcio: me.idconsorcio,
            calle:'',
            numeroext: '',
            edificio: '',
            numeroint: '',
            numeroalf: '',
            piso: '',
            cp: '',
            editable: 1,
        })  
        
        disabled.value=false

    } else {
        if(!domicilia.id){
            domicilios = ref ({
                iduser:domicilia.iduser,
                idconsorcio:domicilia.idconsorcio,
                calle:domicilia.calle,
                numeroext:domicilia.numeroext,
                edificio:domicilia.edificio,
                numeroint:domicilia.numeroint,
                numeroalf:domicilia.numeroalf,
                piso:domicilia.piso,
                cp:domicilia.cp,
                editable: domicilia.editable,
            })   
            
            disabled.value=domicilia.editable==1?false:true;                

        } else{
            domicilios = ref ({
                id:domicilia.id,
                iduser:domicilia.iduser,
                idconsorcio:domicilia.idconsorcio,
                calle:domicilia.calle,
                numeroext:domicilia.numeroext,
                edificio:domicilia.edificio,
                numeroint:domicilia.numeroint,
                numeroalf:domicilia.numeroalf,
                piso:domicilia.piso,
                cp:domicilia.cp,
                activo:domicilia.activo,
                editable: domicilia.editable,
                createdAt:domicilia.createdAt,
                updatedAt:domicilia.updatedAt,
                deletedAt:domicilia.deletedAt,
            })

            disabled.value=domicilia.editable==1?false:true;
        }     
    }

    usuarios = ref ({
        activo:user.activo,
        createdAt:user.createdAt,
        deletedAt:user.deletedAt,
        editable:user.editable,
        email:user.email,
        estatus:user.estatus,
        id:user.id,
        iduser:user.iduser,
        materno:user.materno,
        nombre:user.nombre,
        paterno:user.paterno,
        rfccurp:user.rfccurp,
        telefono:user.telefono,
        telefonod:user.telefonod,
        updatedAt:user.updatedAt,
    })
        console.log(disabled.value)
    
    const guardarInfo = async (e,a)=>{
        //
        try {
            store.commit('auth/setUser',usuarios.value)
            store.commit('auth/setDomicilio',domicilios.value)

            let dom = ''
            const usr = await api.put(`api/updates/${usuarios.value.id}/16`, usuarios.value);

            if(!domicilia.id){
                dom = await api.put('api/inserts/12', domicilios.value);
                //domicilios.value.editable = 0
            } else{
                //domicilios.value.editable = 0
                dom = await api.put(`api/updates/${domicilia.id}/12`, domicilios.value);
            }
            
            await Promise.all([dom, usr]).then(function (res) {
                const domic = res[0].data.data
                const user = res[1].data.data
                console.log(domic[0],user[0]);
                
                store.commit('auth/setUser',user[0])
                store.commit('auth/setDomicilio',domic[0])   
                domicilia = store.getters['auth/getDomicilio']  
                disabled.value=domicilia.editable==1?false:true;

                $q.notify({
                    position: 'top',
                    type: 'positive',
                    message: 'Se ha actualizado su información personal correctamente.'
                })      
            });
            
        } catch (error) {

            $q.notify({
                position: 'top',
                type: 'negative',
                message: 'No se ha poddio guardar la información intentelo de nuevo.'
            }) 
            
        }        
    }

    return {
            usuario: computed( () => usuarios.value),
            domicilio: computed( () => domicilios.value),
            asociado: computed( () => store.getters['auth/getAsociado']),     
            me: computed( () => me),
            disabled: computed( () => disabled.value),
            guardarInfo,
            //calles: computed( async () => datos),
    }
}


export default useDomicilios
    