<template>
<div>
    <div v-if="children.length == 0">
      <q-item 
          clickable
          tag="a"
          @click="navigateTo"
          :inset-level="level">
          <q-item-section
                v-if="icon"
                avatar
              >
                <q-icon :name="icon" />
              </q-item-section>
          <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption>
            {{ caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <div v-else>
      <div v-if="children.length > 0">
        <!-- {{children}} -->
        <q-expansion-item
            expand-separator
            :icon="icon"
            :label="title"
            :caption="caption"
            :header-inset-level="level"
            default-closed>
          <EssentialLink
            v-for="child in children"
            :key="child"
            v-bind="child">
          </EssentialLink>
        </q-expansion-item>
      </div>
      <div v-else>
         <q-item 
              clickable
              tag="a"
              @click="navigateTo"
              :inset-level="level">
              <q-item-section
                    v-if="icon"
                    avatar
                  >
                    <q-icon :name="icon" />
                  </q-item-section>
              <q-item-section>
              <q-item-label>{{ title }}</q-item-label>
              <q-item-label caption>
                {{ caption }}
              </q-item-label>
            </q-item-section>
          </q-item>
      </div>
    </div>
  </div>

  
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },
    tipo: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 0
    },

    children: []
  },
   setup( props ) {

    const router = useRouter()

    //console.log("ROUTER", router)
    return {
      navigateTo() {

        //console.log(props.link)

        props.link.startsWith('http')
          ? window.open( props.link, '_blank' )
          : router.push(props.link)
        

      }
    }
  }
})
</script>
