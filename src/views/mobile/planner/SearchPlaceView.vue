<script setup lang="ts">
import { ref } from 'vue'
import useLoading from '@/hooks/loading'

const searchInput = ref('')
const recentSearchList = ref(['Southwest Jiaotong University', 'Chunxi Road'])

const loadingObjPOI = useLoading()
const finishedPOI = ref(false)
const onLoadPOI = () => {
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      poiList.value.push({ icon: 'location', title: `Collection ${poiList.value.length + 1}` })
    }

    // 加载状态结束
    loadingObjPOI.setLoading(false)

    // 数据全部加载完成
    if (poiList.value.length >= 20) {
      finishedPOI.value = true
    }
  }, 1000)
}

const poiList = ref([
  { icon: 'youzan-shield', title: 'Highlights' },
  { icon: 'star', title: 'Starred Places' },
  { icon: 'shop', title: 'Shopping Market' },
  { icon: 'video', title: 'Cinemas' },
  { icon: 'card', title: 'Banks' }
])
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
    <div class="search-content-area">
      <p class="search-content-area-title">Recent searches</p>
      <van-list class="search-content-area-list van-hairline--bottom" finished-text="loaded all">
        <van-cell v-for="(item, idx) in recentSearchList" :key="idx" :center="true">
          <template #icon>
            <van-icon class="search-content-area-list-icon" name="underway-o"></van-icon>
          </template>
          <template #title>
            <span class="search-content-area-content van-hairline--bottom">{{ item }}</span>
          </template>
        </van-cell>
      </van-list>
      <van-divider class="divider-1"></van-divider>
    </div>
    <div class="search-content-area">
      <p class="search-content-area-title">SHOW PLACES ON MAP</p>
      <van-list
        v-model:loading="loadingObjPOI.loading.value"
        :finished="finishedPOI"
        @load="onLoadPOI"
        class="search-content-area-list van-hairline--bottom"
        finished-text="loaded all"
      >
        <van-cell v-for="(item, idx) in poiList" :key="idx" :center="true">
          <template #icon>
            <van-icon class="search-content-area-list-icon" :name="item.icon"></van-icon>
          </template>
          <template #title>
            <span class="search-content-area-content">{{ item.title }}</span>
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<style scoped></style>
