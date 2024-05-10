<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import { getTourByUser, type TourRecord } from '@/apis/tour'

const currUser = computed(() => useUserStore().curUser)

onMounted(() => {
  console.log(currUser)
  console.log(currUser.value?.id)
})

const router = useRouter()

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}

const tours = ref<TourRecord[] | undefined>([])

const totalCalories = ref<number>(0)
const totalMiles = ref<number>(0)
const tourNumber = ref<number>(0)

getTourByUser().then((res) => {
  if (res.success) {
    tours.value = res.data
    totalCalories.value =
      tours.value?.reduce((total, tour) => total + (tour.tourRecordData?.calorie || 0), 0) || 0
    totalMiles.value =
      tours.value?.reduce((total, tour) => total + (tour.tourRecordData?.totalDistance || 0), 0) ||
      0
    tourNumber.value = tours.value ? tours.value.length : 0
  }
})
</script>

<template>
  <div id="personal-page">
    <a-layout class="profile-layout">
      <!-- left bar -->
      <a-layout-sider class="left-sider">
        <div class="pic-profile">
          <img :src="currUser?.avatar" alt="" />
        </div>

        <div class="name">
          {{ currUser?.nickname }}

          <span v-if="currUser?.type" class="vip-button">
            <van-icon :size="20" name="/account/vip.svg" />
          </span>
        </div>

        <div class="banner">
          <div>
            <div class="num-b">{{ tourNumber }}</div>
            Tours
          </div>
          <div>
            <div class="num-b">{{ totalMiles.toFixed(2) }}</div>
            Total Distance
          </div>
          <div>
            <div class="num-b">{{ totalCalories.toFixed(2) }}</div>
            Calories Consume
          </div>
        </div>

        <a-menu class="menu" :default-selected-keys="[$route.meta.title]">
          <a-menu-item key="personalprofile" @click="navigateTo('personal')">
            Your Profile
          </a-menu-item>
          <a-menu-item key="personaltours" @click="navigateTo('personal-tour')">
            Tours
          </a-menu-item>
          <!-- <a-menu-item key="personalhighlights" @click="navigateTo('personalhighlights')">
              Highlights
            </a-menu-item> -->
          <a-menu-item key="personalcollections" @click="navigateTo('personal-collection')">
            My Collections
          </a-menu-item>
          <a-menu-item key="personalgroup" @click="navigateTo('personal-group')">
            Groups
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- right one -->
      <a-layout>
        <a-layout-content class="right-content">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">
export default {
  name: 'personalPage'
}
</script>
