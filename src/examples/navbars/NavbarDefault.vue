<script setup>
import { RouterLink } from 'vue-router'
import { ref, watch } from 'vue'
import { useWindowsWidth } from '@/assets/js/useWindowsWidth.js'

// images
import ArrDark from '@/assets/img/down-arrow-dark.svg'
import DownArrWhite from '@/assets/img/down-arrow-white.svg'

const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: 'https://www.creative-tim.com/product/vue-material-kit',
      color: 'bg-gradient-success',
      label: 'Free Download'
    })
  },
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
})

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark
  } else if (props.transparent) {
    return DownArrWhite
  } else {
    return ArrDark
  }
}

// set text color
const getTextColor = () => {
  let color
  if (props.transparent && textDark.value) {
    color = 'text-dark'
  } else if (props.transparent) {
    color = 'text-white'
  } else {
    color = 'text-dark'
  }

  return color
}

// set nav color on mobile && desktop

let textDark = ref(props.darkText)
const { type } = useWindowsWidth()

if (type.value === 'mobile') {
  textDark.value = true
} else if (type.value === 'desktop' && textDark.value == false) {
  textDark.value = false
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === 'mobile') {
      textDark.value = true
    } else {
      textDark.value = false
    }
  }
)
</script>
<template>
  <nav
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3': props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
    }"
    class="navbar navbar-expand-lg top-0"
  >
    <a-menu
      :class="props.transparent || props.light || props.dark ? 'container' : 'container-fluid px-0'"
      :default-selected-keys="['1']"
      align="center"
      mode="horizontal"
      style="background: transparent"
    >
      <a-menu-item key="0" class="bg-transparent" disabled style="float: left">
        <RouterLink
          :class="[
            (props.transparent && textDark.value) || !props.transparent
              ? 'text-dark font-weight-bolder ms-sm-3'
              : 'text-white font-weight-bolder ms-sm-3'
          ]"
          :to="{ name: 'home' }"
          class="navbar-brand d-none d-md-block bg-transparent"
          data-placement="bottom"
          rel="tooltip"
          style="height: min-content"
          title="Designed and Coded by Creative Tim"
        >
          <img
            alt="logo"
            class="logo bg-transparent"
            src="/logo/green-transparent.png"
            style="position: absolute; scale: 1.5"
          />
        </RouterLink>
      </a-menu-item>
      <a-anchor
        boundary="center"
        class="nav-anchor"
        @change="
          (e) => {
            console.log(e)
          }
        "
      >
        <a-anchor-link href="#basic">Basic</a-anchor-link>
        <a-anchor-link href="#line-less">LineLess Mode</a-anchor-link>
        <a-anchor-link href="#affix">
          Affix
          <template #sublist>
            <a-anchor-link href="#boundary">Scroll Boundary</a-anchor-link>
            <a-anchor-link href="#hash">Hash mode</a-anchor-link>
          </template>
        </a-anchor-link>
      </a-anchor>
      <a-menu-item key="1" class="bg-transparent">Home</a-menu-item>
      <a-menu-item key="2" class="bg-transparent">Solution</a-menu-item>
      <a-menu-item key="3" class="bg-transparent">Cloud Service</a-menu-item>
      <a-menu-item key="4" class="bg-transparent">Cooperation</a-menu-item>
      <a-menu-item key="5" class="bg-transparent" style="float: right">
        <a-button
          shape="round"
          status="success"
          style="scale: 0.9"
          type="primary"
          @click="$router.push({ name: 'login' })"
          >Join Now
        </a-button>
      </a-menu-item>
    </a-menu>
  </nav>
</template>

<style>
.nav-anchor {
  display: none;
}

.arco-menu-horizontal .arco-menu-inner {
  padding: 0 !important;
}
</style>
