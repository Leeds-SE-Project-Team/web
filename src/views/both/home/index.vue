<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted } from 'vue'

const getStaticRes = (relativePath: string) => {
  return import.meta.env.APP_STATIC_URL.concat(relativePath)
}
// import wlv from 'C:\\Main\\walcraft2.0.mp4'
const authStore = useAuthStore()
// const wlv = ''

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.from('#info-1 .image', {
    scrollTrigger: {
      trigger: '#info-1',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-1 .text', {
    scrollTrigger: {
      trigger: '#info-1',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-2 .image', {
    scrollTrigger: {
      trigger: '#info-2',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-2 .text', {
    scrollTrigger: {
      trigger: '#info-2',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-3 .image', {
    scrollTrigger: {
      trigger: '#info-3',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-3 .text', {
    scrollTrigger: {
      trigger: '#info-3',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-4 .image', {
    scrollTrigger: {
      trigger: '#info-4',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-4 .text', {
    scrollTrigger: {
      trigger: '#info-4',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-5 .image', {
    scrollTrigger: {
      trigger: '#info-5',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-5 .text', {
    scrollTrigger: {
      trigger: '#info-5',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-6 .image', {
    scrollTrigger: {
      trigger: '#info-6',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-6 .text', {
    scrollTrigger: {
      trigger: '#info-6',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-7 .image', {
    scrollTrigger: {
      trigger: '#info-7',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: -100,
    opacity: 0,
    duration: 2
  })
  gsap.from('#info-7 .text', {
    scrollTrigger: {
      trigger: '#info-7',
      scroller: '.home-wrapper',
      end: 'bottom bottom',
      scrub: 0.5
    },
    x: 100,
    opacity: 0,
    duration: 2
  })
})
</script>

<template>
  <div class="home-wrapper" style="height: 100%; width: 100%; overflow-y: auto; position: relative;overflow-x: hidden;">
    <a-result v-if="authStore.isTokenValid" :status="'success'" title="Login succeed!">
      <template #icon>
        <IconFaceSmileFill />
      </template>

      <template #extra>
        <a-button :type="'secondary'" @click="authStore.handleLogout">Log out</a-button>
        <a-button :type="'secondary'" @click="$router.push({ name: 'discover' })">发现</a-button>
      </template>
      <a-typography style="background: var(--color-fill-2); padding: 24px">
        <a-typography-paragraph>Access token:</a-typography-paragraph>
        {{ authStore.accessToken }}
      </a-typography>
    </a-result>

    <!-- <a-result v-else :status="'info'" title="Welcome to walcraft">
      <template #icon>
        <icon-info />
      </template>
      <template #subtitle>You haven't logged in an account</template>
      <div class="test" style="width: 100px; height: 100px; background-color: brown;"></div>
      <template #extra>
        <a-button id="r123" type="primary" @click="$router.push({ name: 'login' })">Login</a-button>
      </template>
    </a-result> -->
    <div v-else class="flex-c back-container">
      <div style="height: 100vh; width: 100%; position: relative">
        <div class="flex-c flex-justify-c Logo-wrapper">
          <button type="button" @click="$router.push({ name: 'login' })">
            <div style="font-size: 1.5rem">Login</div>
          </button>
          <!-- <a-button
          type="primary"
          status="success"
          @click="$router.push({ name: 'login' })"
        >Login</a-button> -->
        </div>
        <!-- <img src="//fp1.fghrsh.net/2020/01/12/a34fb4bccf0056405451e822c2de7b2f.jpg" alt="" style="object-fit: cover; width: 100%; height: 100%;"> -->
        <video
          :src="getStaticRes('/resource/walcraft2.0.mp4')"
          autoplay
          loop
          muted
          style="height: 100%; width: 100%; object-fit: cover"
        ></video>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-1" class="walcraft-info">
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/discover.png"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Trip Information and User Interaction</h2>
            <p style="padding: 0 1rem;">
              Discover page serves as a hub for users to discover, engage with, and connect over various travel experiences shared within the platform.
            </p>
          </div>
        </div>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-2" class="walcraft-info">
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Detailed Tour Information</h2>
            <p style="padding: 0 1rem;">
              The Tour Details page offers users an in-depth view of a tour, featuring essential metrics like distance and average speed, supplemented by a navigation map.
            </p>
          </div>
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/tour.jpg"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
        </div>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-3" class="walcraft-info">
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/coll.jpg"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Collect All Tours and Place in a Map</h2>
            <p style="padding: 0 1rem;">
              Tours created by ordinary users will be added to the default Collection by default. All Tours in the Collection will be displayed on the initial map.
            </p>
          </div>
        </div>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-4" class="walcraft-info">
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Itinerary Planning and Customization Options</h2>
            <p style="padding: 0 1rem;">
              The Planner page empowers users to craft personalized itineraries by selecting travel mode, start and end points, and must-pass locations.
            </p>
          </div>
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/planer.jpg"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
        </div>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-5" class="walcraft-info">
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/planer.jpg"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Navigation Interface</h2>
            <p style="padding: 0 1rem;">
              The Record page enables users to navigate along their planned itinerary from the Planner page, displaying the path and providing voice guidance.
            </p>
          </div>
        </div>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-6" class="walcraft-info">
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Customizable Profile and VIP Features and Subscriptions</h2>
            <p style="padding: 0 1rem;">
              The Personal page offers users extensive customization options for their profile, including avatar uploads and detailed personal information editing. VIP users enjoy exclusive features like creating custom Collections and Groups.
            </p>
          </div>
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/vip.jpg"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
        </div>
      </div>
      <div style="min-height: 800px; width: 100%; display: flex; position: relative">
        <div id="info-7" class="walcraft-info">
          <div class="text flex-c">
            <h2 style="padding: 0 1rem;">Group User and Trip Display</h2>
            <p style="padding: 0 1rem;">
              The Group Details page provides a comprehensive overview of group activities, showcasing members and their respective trips.
            </p>
          </div>
          <div class="image" style="max-height: 500px; max-width: 400px">
            <img
              alt=""
              src="https://file.wmzspace.space/resource/group.jpg"
              style="object-fit: cover; width: 100%; height: 100%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'IndexView'
}
</script>
