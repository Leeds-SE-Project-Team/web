<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// 配置布局
const layout = computed(
  () => 'layout-' + ((route.meta.layout as string) || 'default').toLowerCase()
)

//
// ws.onopen = () =>
//   speechSynthesis(ws, {
//     business: {
//       aue: 'raw',
//       vcn: 'xiaoyan',
//       pitch: 50,
//       speed: 50
//     },
//     data: {
//       status: 2,
//       text: base64
//     }
//   })

// .then((res) => {
//   console.log(res)
// })
// .catch((e) => {
//   console.error(e)
// })

// let speechInstance = new SpeechSynthesisUtterance('大家好，我是渣渣辉。')
// speechSynthesis.speak(speechInstance)
</script>

<!--App.vue-->
<template>
  <!-- Component Library Config Provider-->
  <a-config-provider>
    <!--    Layout & Router View-->
    <component :is="layout"></component>
    <!--    Layout & Router View-->
  </a-config-provider>
  <!-- Component Library Config Provider-->
</template>

<style scoped></style>
