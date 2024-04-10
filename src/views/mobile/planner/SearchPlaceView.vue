<script setup lang="ts">
import { ref } from 'vue'

const searchInput = ref('')
</script>

<template>
  <div id="search-view">
    <van-nav-bar
      left-text=""
      left-arrow
      @click-left="$router.back()"
      class="nav-bar"
      :border="false"
    >
      <template #title>
        <van-field v-model="searchInput" placeholder="Place or Address" class="nav-field" />
      </template>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <van-grid class="search-btn-group" :border="false">
      <van-grid-item text="Use Current Location">
        <template #icon>
          <van-icon class="search-btn-icon" name="location"></van-icon>
        </template>
      </van-grid-item>
      <van-grid-item text="Choose On Map">
        <template #icon>
          <van-icon class="search-btn-icon" name="map-marked"></van-icon>
        </template>
      </van-grid-item>
      <van-grid-item text="Select From Starred Place">
        <template #icon>
          <van-icon class="search-btn-icon" name="star"></van-icon>
        </template>
      </van-grid-item>
      <van-grid-item text="Delete Waypoint">
        <template #icon>
          <van-icon class="search-btn-icon" name="delete"></van-icon>
        </template>
      </van-grid-item>
    </van-grid>
    <van-divider class="divider-1"></van-divider>
    <div class="recent-search">
      <p class="recent-search-title">Recent searches</p>
      <!--      <div style="padding: 10px 0 10px 0">-->
      <!--        <van-icon name="underway-o" size="21"/>-->
      <!--        <span style="">South West Jiaotong University</span>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<style scoped></style>
