<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import gsap from 'gsap';
import { onMounted, ref } from 'vue';
// import wlv from 'walcraft2.0.mp4'
const authStore = useAuthStore()
const wlv = ''

onMounted(()=>{
  gsap.to('#r123',{rotate:360, duration: 3})
})

</script>

<template>
  <div class="home-wrapper" style="height: 100%; width: 100%; overflow: auto; position: relative;">
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
    <div v-else class="flex-c back-container" >
      <div style="height: 100vh; width: 100%; position: relative;" >
        <div class="flex-c flex-justify-c Logo-wrapper" >
          <button type="button" @click="$router.push({ name: 'login' })">
            <div style="font-size: 1.5rem;" >Login</div>
          </button>
          <!-- <a-button
          type="primary"
          status="success"
          @click="$router.push({ name: 'login' })"
        >Login</a-button> -->
        </div>
        <!-- <img src="//fp1.fghrsh.net/2020/01/12/a34fb4bccf0056405451e822c2de7b2f.jpg" alt="" style="object-fit: cover; width: 100%; height: 100%;"> -->
        <video style="height: 100%; width: 100%; object-fit: cover;" :src="wlv" autoplay muted loop></video>
      </div>
      <!-- <div style="height: 100vh; width: 100%" >
        <img src="//fp1.fghrsh.net/2020/01/12/a34fb4bccf0056405451e822c2de7b2f.jpg" alt="" style="object-fit: cover; width: 100%; height: 100%;">
      </div> -->
    </div>
    
  </div>
</template>

<script lang="ts">
export default {
  name: 'IndexView'
}
</script>
