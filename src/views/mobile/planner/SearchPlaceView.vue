<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import useLoading from '@/hooks/loading'
import { debounce } from 'lodash-es'
import { useMapStore } from '@/stores/map'
import { showNotify } from 'vant'

const searchInput = ref('')
/* search main */
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
/* search main */

/* search result */
const searchField = ref()
const mapStore = useMapStore()
watch(searchInput, (value, oldValue) => {
  handleSearch(value, oldValue)
})
const loadingObjSearch = useLoading()
const finishedResult = ref(false)
const paginationResult = reactive({
  count: -1,
  pageIndex: 0, // start from 1
  pageSize: 10
})
const onLoadResult = () => {
  handleSearch(searchInput.value)
}
// 获取搜索信息
const handleSearch = debounce((value: string, oldValue?: string) => {
  if (oldValue && value !== oldValue) {
    paginationResult.pageIndex = 0
    searchResultList.value = []
  }

  if (value.length) {
    loadingObjSearch.setLoading(true)
    mapStore
      .searchPlace(value, {
        pageIndex: paginationResult.pageIndex + 1,
        pageSize: paginationResult.pageSize
      })
      .then((res) => {
        paginationResult.count = res.poiList.count
        paginationResult.pageIndex = res.poiList.pageIndex
        paginationResult.pageSize = res.poiList.pageSize
        if (paginationResult.pageIndex === paginationResult.pageSize) {
          finishedResult.value = true
        }
        searchResultList.value.push(...res.poiList.pois)
      })
      .catch((e) => {
        showNotify({ type: 'danger', message: e })
      })
      .finally(() => {
        loadingObjSearch.setLoading(false)
      })
  }
}, 1000)
const searchResultList = ref<any[]>([])
/* search result */

const emits = defineEmits<{
  (e: 'select', lnglat: AMap.LngLat): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div id="search-view">
    <van-nav-bar
      :border="false"
      class="nav-bar"
      left-arrow
      left-text=""
      @click-left="emits('cancel')"
    >
      <template #title>
        <van-field
          ref="searchField"
          v-model="searchInput"
          class="nav-field"
          placeholder="Place or Address"
        />
      </template>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div v-if="!searchInput">
      <!--    search main-->
      <van-grid :border="false" class="search-btn-group">
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
          class="search-content-area-list van-hairline--bottom"
          finished-text="loaded all"
          @load="onLoadPOI"
        >
          <van-cell v-for="(item, idx) in poiList" :key="idx" :center="true">
            <template #icon>
              <van-icon :name="item.icon" class="search-content-area-list-icon"></van-icon>
            </template>
            <template #title>
              <span class="search-content-area-content">{{ item.title }}</span>
            </template>
          </van-cell>
        </van-list>
      </div>
      <!--    search main-->
    </div>

    <div v-else class="search-result-area">
      <!--    search result-->
      <van-list
        v-model:loading="loadingObjSearch.loading.value"
        :finished="finishedResult"
        class="search-result-area-list"
        finished-text="loaded all"
        @load="onLoadResult"
      >
        <van-cell
          v-for="(item, idx) in searchResultList"
          :key="idx"
          class="search-result-area-list-item"
          is-link
          @click="emits('select', item.location)"
        >
          <template #icon>
            <van-icon class="search-result-area-list-icon" name="location"></van-icon>
          </template>
          <template #title>
            <div class="search-result-area-content van-ellipsis">{{ item.name }}</div>
          </template>
          <template #label>
            <div class="search-result-area-label">
              <div class="search-result-area-label-text van-ellipsis">{{ item.address }}</div>
              <van-tag
                v-for="(tag, idx) in item.type.split(';')"
                :key="idx"
                class="search-result-area-label-tag"
                plain
                type="primary"
              >
                {{ tag }}
              </van-tag>
            </div>
          </template>
        </van-cell>
      </van-list>
      <!--    search result-->
    </div>
  </div>
</template>

<style scoped></style>
