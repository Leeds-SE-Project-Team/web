<template>
  <div>
    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">
          <NavbarDefault :sticky="true" />
        </div>
      </div>
    </div>

    <div
      class="page-header"
      filter-color="green"
      style="width: 100%; cursor: pointer"
      @click="$router.push({ name: 'login' })"
    >
      <div style="text-align: center">
        <video
          :src="getStaticRes('/resource/walcraft2.0.mp4')"
          autoplay
          loop
          muted
          style="height: 100%; width: 100%; object-fit: cover; position: fixed"
        ></video>

        <div style="position: fixed; width: 100vw; top: 60vh">
          <button
            style="
              scale: 1;
              font-family:
                PingFang SC,
                DFPKingGothicGB-Regular,
                sans-serif;
              width: 300px;
              border: none;
              background-color: #0077d9;
              opacity: 0.8;
              color: white;
              margin-top: 30px;
              padding: 8px 60px;
              border-radius: 15px;
            "
            type="button"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>

    <!--    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n11">-->
    <div class="card card-body blur shadow-blur">
      <PresentationCounter />
      <PresentationInformation />
      <PresentationExample :data="data" />
      <!-- <PresentationPages /> -->
      <!-- <PresentationTestimonials /> -->
      <!-- <div class="container">
        <div class="row">
          <div class="d-flex flex-column w-100 text-center p-5 mb-8">
            <h3>Available on these technologies</h3>
            <div class="d-flex justify-content-center mt-3 flex-wrap">
              <a
                data-bs-placement="bottom"
                data-bs-toggle="tooltip"
                href="https://www.creative-tim.com/product/material-kit"
                title="Bootstrap 5 - Most popular front-end component library"
              >
                <img :src="logoBootstrap" :style="{ height: '90px' }" alt="title" loading="lazy" />
              </a>
              <a
                class="opacity-5 ms-3"
                data-bs-placement="bottom"
                data-bs-toggle="tooltip"
                href="#"
                title="Coming Soon"
              >
                <img :src="logoTailwind" :style="{ height: '90px' }" alt="title" loading="lazy" />
              </a>
              <a
                class="mx-3"
                data-bs-placement="bottom"
                data-bs-toggle="tooltip"
                href="https://www.creative-tim.com/product/vue-material-kit-pro"
                title="Vue.js - Is a Progressive JavaScript Framework"
              >
                <img :src="logoVue" :style="{ height: '90px' }" alt="title" loading="lazy" />
              </a>
              <a
                class="opacity-5"
                data-bs-placement="bottom"
                data-bs-toggle="tooltip"
                href="#"
                title="Coming Soon"
              >
                <img :src="logoAngular" :style="{ height: '90px' }" alt="title" loading="lazy" />
              </a>
              <a
                class="mx-3"
                data-bs-placement="bottom"
                data-bs-toggle="tooltip"
                href="https://www.creative-tim.com/product/material-kit-react-pro"
                title="React – A JavaScript library for building user interfaces"
              >
                <img :src="logoReact" :style="{ height: '90px' }" alt="title" loading="lazy" />
              </a>
              <a
                class="opacity-5"
                data-bs-placement="bottom"
                data-bs-toggle="tooltip"
                href="#"
                title="Coming Soon"
              >
                <img :src="logoSketch" :style="{ height: '90px' }" alt="title" loading="lazy" />
              </a>
            </div>
          </div>
        </div>
      </div> -->
      <div
        :style="{
          background: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))'
        }"
        class="container-fluid mt-sm-5 border-radius-xl"
      >
        <div
          :style="{
            backgroundImage: `url(${wavesWhite})`
          }"
          class="page-header py-6 py-md-5 my-sm-3 mb-3 border-radius-xl"
          loading="lazy"
        >
          <span class="mask bg-gradient-dark"></span>
          <div class="container">
            <div class="row">
              <div class="d-flex justify-content-center p-5">
                <div class="col-lg-8 ms-lg-5 text-center">
                  <h3 class="text-white">
                    Do you love our walcraft app?
                  </h3>
                  <p class="text-white text-md">
                    You can invite your friends and you can get 3 days free vip!
                    <br />
                    Go and paly with your friends!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DefaultFooter />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import PresentationCounter from '@/views/home/Sections/PresentationCounter.vue'
import PresentationInformation from '@/views/home/Sections/PresentationInformation.vue'
import PresentationPages from '@/views/home/Sections/PresentationPages.vue'
import PresentationExample from '@/views/Presentation/Sections/PresentationExample.vue'
import data from './Sections/Data/designBlocksData'
import PresentationTestimonials from '@/views/home/Sections/PresentationTestimonials.vue'
import DefaultFooter from '@/examples/footers/FooterDefault.vue'
import NavbarDefault from '@/examples/navbars/NavbarDefault.vue'
import wavesWhite from '@/assets/img/waves-white.svg'
import logoBootstrap from '@/assets/img/logos/bootstrap5.jpg'
import logoTailwind from '@/assets/img/logos/icon-tailwind.jpg'
import logoVue from '@/assets/img/logos/vue.jpg'
import logoAngular from '@/assets/img/logos/angular.jpg'
import logoReact from '@/assets/img/logos/react.jpg'
import logoSketch from '@/assets/img/logos/sketch.jpg'
//example components
//Vue Material Kit 2 components
// sections
//images
const getStaticRes = (relativePath: string) => {
  return import.meta.env.APP_STATIC_URL.concat(relativePath)
}

//hooks
const body = document.getElementsByTagName('body')[0]
onMounted(() => {
  body.classList.add('presentation-page')
  body.classList.add('bg-gray-200')
})
onUnmounted(() => {
  body.classList.remove('presentation-page')
  body.classList.remove('bg-gray-200')
})
</script>

<script lang="ts">
export default {
  name: 'WalcraftHomeView',
  bodyClass: 'index-page'
}
</script>
<style></style>
