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
                  >
                    <a-option>Hiking</a-option>
                    <a-option>Biking</a-option>
                    <a-option>
                      <icon-search />
                      Running
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
          <li>
            <!--            TOUR-->
            <DCard :info="testCardInfo" style="margin: 10px"></DCard>
          </li>
          <li v-for="ele in articleInfos" :key="ele.id">
            <!--          COLLECTION-->
            <DArticle :info="ele"></DArticle>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DArticle from '@/views/discover/DArticle.vue'
import DCard from './DCard.vue'
// import type { articleInfo } from './type'
import { getTourCollection, type TourCollection } from '@/apis/collection'
import { onMounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { type TourRecord, TourType } from '@/apis/tour'
import { exampleUserRecord } from '@/apis/user'
import { getTourSpotExample } from '@/apis/tour/spot'

// const testInfo: articleInfo = {
//   username: '测试用户',
//   userFollower: 10000,
//   userFollowing: 10,
//   userAvatar:
//     '//fp1.fghrsh.net/2023/05/16/b082833e5c59a309880eca3d525e7cae.gif',
//   backgroundUrl: '//fp1.fghrsh.net/2020/01/12/1e8c4232da6be35942f6ecd630797f60.jpg',
//   collection: 'hiking',
//   title: '随便写点',
//   specify: '12334235',
//   introduction:
//     '我不会再退缩 \
//                     送给你纯白色的花,塞西莉亚,塞西莉亚,盛开在起风的地方,沐浴九月的骄阳,\
//                     偷偷放在你的身上,替我传达,我不敢说的话,在流浪的路上,你是我唯一牵挂,\
//                     无尽海上的星光,所以别让我担心啊',
//   like: 123345,
//   comment: 234234
// }

const testCardInfo: TourRecord = {
  id: 0,
  title: 'Tour card',
  user: {
    id: 0,
    email: '234',
    nickname: 'test user',
    avatar: '//fp1.fghrsh.net/2023/05/16/b082833e5c59a309880eca3d525e7cae.gif',
    registerTime: '234',
    latestLoginTime: '25'
  },
  spots: [getTourSpotExample(1), getTourSpotExample(2), getTourSpotExample(3)],
  mapCapture: import.meta.env.APP_STATIC_URL.concat('/tour/example/map/map.png'),
  // map: '//fp1.fghrsh.net/2020/01/12/b51236a90d69167c8f4b5af47ab57861.jpg',
  // like: 100,
  // comment: 3,
  comments: [
    {
      id: 1,
      tourId: 1,
      author: exampleUserRecord,
      content: 'this is a sample content',
      publishTime: '2024-3-4 00:00:00',
      replies: []
    },
    {
      id: 2,
      tourId: 1,
      author: exampleUserRecord,
      content: 'this is a sample content',
      publishTime: '2024-3-4 00:00:00',
      replies: []
    },
    {
      id: 3,
      tourId: 1,
      author: exampleUserRecord,
      content: 'this is a sample content',
      publishTime: '2024-3-4 00:00:00',
      replies: []
    }
  ],
  startLocation: '',
  endLocation: '',
  createTime: '2024-3-4 00:00:00',
  type: TourType.WALK,
  pons: [],
  status: 'awaitApproval',
  tourCollectionId: 1
}

const articleInfos = ref<TourCollection[] | undefined>()

const fetchTourCollection = () => {
  getTourCollection()
    .then((tours) => {
      if (!tours.success) {
        Message.info(tours.message)
      }
      tours.data?.forEach((ele) => {
        if (ele.description.length > 50) {
          ele.description = ele.description.substring(0, 50) + '...'
        }
      })
      articleInfos.value = tours.data
    })
    .catch((reason: any) => {
      Message.error(reason)
    })
}

onMounted(() => {
  fetchTourCollection()
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
