<template>
  <div id="page-discover">
    <div class="content-wrapper">
      <!-- 最上方搜索卡片 -->
      <a-card id="search-card" hoverable style="width: 100%">
        <!-- 卡片封面 -->
        <template #cover>
          <div class="card-cover" style="height: 240px; width: 100%; display: flex">
            <div class="cover-shadow">
              <h2>Discover</h2>
            </div>
          </div>
        </template>
        <!-- 卡片内容 -->
        <div class="card-content">
          <div class="search-wrapper">
            <div class="search-type">
              <span class="type-label">Which sport?</span>
              <div class="select-wrapper">
                <div class="selector">
                  <a-select
                    :style="{ minWidth: '150px' }"
                    :trigger-props="{ autoFitPopupMinWidth: true }"
                    placeholder="Select"
                    v-model="searchType"
                  >
                    <a-option :value="0">Hiking</a-option>
                    <a-option :value="1">Biking</a-option>
                    <a-option :value="2">
                      Car
                    </a-option>
                    <a-option :value="3">
                      All
                    </a-option>
                  </a-select>
                </div>
              </div>
            </div>
            <div class="search-content">
              <span class="type-label">Where?</span>
              <div class="input-wrapper">
                <div class="inputer">
                  <a-input
                    :style="{ width: '100%' }"
                    allow-clear
                    placeholder="Please enter something"
                    v-model="curInput"
                  >
                    <template #prefix>
                      <icon-search />
                    </template>
                  </a-input>
                </div>
              </div>
            </div>
            <div class="search-button">
              <div class="button-wrapper">
                <a-button
                  type="primary"
                  style="background-color: rgb(79, 133, 13); font-weight: bold"
                  @click="searchText=curInput"
                  >Search</a-button>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <p
        style="
          text-align: center;
          font-size: 14px;
          margin-top: 1.5rem;
          font-family:
            PingFang SC,
            DFPKingGothicGB-Regular,
            sans-serif;
        "
      >
        Not sure where you want to go?
        <a-link href="">Browse routes and topics</a-link>
      </p>
      <!-- 发现内容 -->
      <div id="content-discover">
        <div class="discover-title">
          <h3>Get Inspired</h3>
        </div>
        <a-divider class="discover-divider" />
        <ul class="content-list">
          <li v-for="(item,i) in itemList" :key="i">
            <!--            TOUR-->
            <DCard
              v-if="item.type==='tour'"
              :tour-data="(item.item as TourRecord)"
              style="margin: 10px"
              @jump="$router.push({name: 'tour', query:{id:item.item.id}})"
            ></DCard>
            <!--          COLLECTION-->
            <DArticle v-if="item.type==='collection'" :info="(item.item as TourCollection)"></DArticle>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DArticle from '@/views/web/discover/components/DArticle.vue'
import DCard from '@/views/web/discover/components/DCard.vue'
// import type { articleInfo } from './type'
import { getTourCollection, type TourCollection } from '@/apis/collection'
import { onMounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { type TourRecord, getTours } from '@/apis/tour'
import useLoading from '@/hooks/loading'
import { computed } from 'vue'
import { shuffle } from 'lodash-es'
import { watch } from 'vue'

interface DisPlayItem {
  type: 'collection' | 'tour'
  item: TourCollection | TourRecord
}

const tourList = ref<TourRecord[]>([])
const collectionList = ref<TourCollection[]>([])
const searchType = ref(3)
const searchText = ref('')
const curInput = ref('')
watch(curInput,()=>{
  if(curInput.value===''){
    searchText.value = curInput.value
  }
})
const itemList = computed<DisPlayItem[]>(() => {
  const list = shuffle([
      ...tourList.value.map((tour) => ({
        item: tour,
        type: 'tour'
      })),
      ...collectionList.value.map((collection) => ({
        item: collection,
        type: 'collection'
      }))
    ] as DisPlayItem[])
    console.log(searchText.value)
  if(searchType.value!==3 || searchText.value !==''){
    return list.filter(item=>{
      if(searchType.value!==3&&searchText.value){
        if(item.type==='tour'){
          return (item.item as TourRecord).type===searchType.value &&
            (item.item as TourRecord).title===searchText.value
        }else{
          return false
        }
      }else if(searchType.value!==3){
        if(item.type==='tour'){
          return (item.item as TourRecord).type===searchType.value
        }else{
          return false
        }
      }else{
        return item.item.title === searchText.value
      }
    })
  }
    return list
  }
)

const getTourLoading = useLoading()
const fetchTourList = () => {
  getTourLoading.setLoading(true)
  getTours()
    .then((apiRes) => {
      tourList.value = apiRes.data!
    })
    .catch((e) => {
      Message.error(e)
    })
    .finally(() => {
      getTourLoading.setLoading(false)
    })
}
const getCollectionLoading = useLoading()
const fetchCollection = () => {
  getCollectionLoading.setLoading(true)
  getTourCollection()
    .then((apiRes) => {
      collectionList.value = apiRes.data!.filter(item=>item.title!='Default Collection')
    })
    .catch((e) => {
      Message.error(e)
    })
    .finally(() => {
      getCollectionLoading.setLoading(false)
    })
}

onMounted(() => {
  fetchTourList()
  fetchCollection()
})
</script>

<script lang="ts">
export default {
  name: 'DiscoverView'
}
</script>

<style scoped>
#search-card :deep(.arco-card-body) {
  padding: 0;
}

.selector :deep(.arco-select-view-single) {
  background-color: transparent;
  border: 1px #cccccc solid;
  border-radius: 10px;
  height: 40px;
}

.inputer :deep(.arco-input-wrapper .arco-input) {
  height: 40px;
}

.inputer :deep(.arco-input-wrapper) {
  border-radius: 10px;
}

.button-wrapper :deep(.arco-btn-primary) {
  height: 40px;
  border-radius: 10px;
}

#content-discover :deep(.arco-divider-horizontal) {
  border-bottom: 1px solid #cccccc;
}
</style>
