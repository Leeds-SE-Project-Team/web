<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('1')
</script>

<template>
  <div id="mobile-planner">
    <div id="top-menu">
      <div class="outer-container">
        <div class="menu-select">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item name="1">
              <template #icon
                ><img
                  class="menu-icon"
                  src="@/assets/walk.svg"
                  alt="walk"
                  width="30px"
                  height="30px"
              /></template>
              <template #title>
                <span class="menu-title">Sport</span>
              </template>
              <template #value>Hiking</template>
              <van-grid>
                <van-grid-item>
                  <template #icon>
                    <img src="@/assets/walk.svg" alt="walk" width="25px" height="25px" />
                  </template>
                </van-grid-item>
                <van-grid-item>
                  <template #icon>
                    <img src="@/assets/drive.svg" alt="drive" width="25px" height="25px" />
                  </template>
                </van-grid-item>
                <van-grid-item>
                  <template #icon>
                    <img src="@/assets/cycling.svg" alt="cycling" width="25px" height="25px" />
                  </template>
                </van-grid-item>
              </van-grid>
            </van-collapse-item>
          </van-collapse>
        </div>
        <div class="menu-locations"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'plannerMobileView'
}
</script>
