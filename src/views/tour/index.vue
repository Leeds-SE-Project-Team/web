<template>
  <div id="tour-content">
    <div class="tour-main">
      <!-- the section of bg and title in tour page -->
      <section class="tour-title">
        <!-- the bg part -->
        <div class="bg">
          <div class="main-bg">
            <img
              src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40"
              alt="">
          </div>
          <div class="sub">
            <div class="sub-bg">
              <img
                src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tr/trthvnkx56se9kcbf398tcu03nih1d0x-uhi28292499/0?width=1000&height=740&crop=true&q=40"
                alt="">
            </div>
            <div class="sub-bg">
              <img
                src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/1u/1urqmvln4zd5vxwvhc9euyi43nih7at3-uhi28292564/0?width=600&height=354&crop=true&q=40"
                alt="">
            </div>
          </div>
        </div>

        <!-- the title part -->
        <div class="title">
          <h1 class="main-title">Alberta - Plain of Six Glaciers</h1>
          <div>
            <span class="category">Expert</span>
            <span class="time">07:10</span>
            <span class="distance">18.4</span>km
            <span class="speed">2.6</span>km/h
          </div>
          <h3 class="des">Expert Hiking Tour. Very good fitness required. Sure-footedness, sturdy shoes and alpine
            experience required.</h3>
        </div>
      </section>
      <!-- the section of TOUR OVERVIEW -->
      <section class="overview">
        <div class="subtitle">TOUR OVERVIEW</div>
        <a-divider />
        <a-timeline labelPosition="relative" class="t imeline">

          <a-timeline-item class="pic-map" label="2017-03-10 8:20" lineType="dashed">
            <div class="mile">3 km</div>
            <div class="tour-1pic">
              <div class="bg">
                <img
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40"
                  alt="">
              </div>
            </div>
          </a-timeline-item>

          <a-timeline-item class="pic-map" label="2018-03-10 13:10" lineType="dashed">
            <div class="picture-map border-map">
              <div ref="picWrapper" class="picture-wrapper">
                <a-image-preview-group>
                  <div class="left">
                    <a-image :height="'100%'" :src="testCardInfo.spots[0].coverUrl" :width="'100%'" fit="cover" />

                  </div>
                  <div class="right">
                    <div class="up right-item">
                      <a-image :height="'100%'" :src="testCardInfo.spots[1].coverUrl" :width="'100%'" fit="cover" />
                    </div>
                    <div class="down right-item">
                      <a-image :height="'100%'" :src="testCardInfo.spots[2].coverUrl" :width="'100%'" fit="cover" />
                    </div>
                  </div>
                </a-image-preview-group>
              </div>
              <div ref="mapWrapper" class="map-wrapper hide">
                <img :src="testCardInfo.mapCapture" alt="" />
              </div>
              <div class="switch">
                <button class="switch-button" @click="switchClick()">
                  <div class="small-img">
                    <img :src="smallImg" alt="" />
                  </div>
                </button>
              </div>
            </div>
            <div class="title border-map">
              <h3>CART TITLE</h3>
              <p>Card content</p>
              <p>Card content</p>
            </div>
          </a-timeline-item>

          <a-timeline-item class="pic-map" label="2017-03-10 8:20" lineType="dashed">
            <div class="mile">3 m</div>
            <div class="tour-3pic">
              <div class="bg">
                <div class="main-bg">
                  <img
                    src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40"
                    alt="">
                </div>
                <div class="sub">
                  <div class="sub-bg">
                    <img
                      src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tr/trthvnkx56se9kcbf398tcu03nih1d0x-uhi28292499/0?width=1000&height=740&crop=true&q=40"
                      alt="">
                  </div>
                  <div class="sub-bg">
                    <img
                      src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/1u/1urqmvln4zd5vxwvhc9euyi43nih7at3-uhi28292564/0?width=600&height=354&crop=true&q=40"
                      alt="">
                  </div>
                </div>
              </div>
            </div>
          </a-timeline-item>


          <a-timeline-item class="pic-map" label="2017-03-10 8:20" lineType="dashed">
            <div class="mile">3 km</div>
            <div class="tour-2pic">
              <div class="bg">
                <img
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40"
                  alt="">
                <img
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tr/trthvnkx56se9kcbf398tcu03nih1d0x-uhi28292499/0?width=1000&height=740&crop=true&q=40"
                  alt="">
              </div>
            </div>
          </a-timeline-item>

        </a-timeline>
      </section>

      <!-- the section of map -->
      <section class="map">
        <div class="subtitle">
          MAP
        </div>
        <div class="map-img"></div>
      </section>

      <!-- the section of weather and profile .. and so on -->
      <section class="profile">
        <div class="subtitle">
          PROFIEL
        </div>
      </section>

      <section class="weather">
        <div class="subtitle">
          WEATHER
        </div>
      </section>
    </div>


    <div class="comments">
      <a-space size="large">
        <a-avatar :size="50"
          imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp">
        </a-avatar>
        <div class="rigion">
          <h3>Thüringer Wald planned a hike.</h3>
          <p>September 13, 2017</p>
        </div>
      </a-space>

      <div class="like">
        <a-button class="button-icon">
          <template #icon>
            <div class="icon">
              <icon-heart class="button" />
              <span>66</span>
            </div>
          </template>
        </a-button>

        <div class="follower">
          <a-space :size="32">
            <a-avatar-group :max-count="5">
              <a-avatar :style="{ backgroundColor: '#7BC616' }">A</a-avatar>
              <a-avatar :style="{ backgroundColor: '#14C9C9' }">B</a-avatar>
              <a-avatar :style="{ backgroundColor: '#168CFF' }">C</a-avatar>
              <a-avatar :style="{ backgroundColor: '#FF7D00' }">D</a-avatar>
              <a-avatar :style="{ backgroundColor: '#7BC616' }">E</a-avatar>
              <a-avatar :style="{ backgroundColor: '#14C9C9' }">F</a-avatar>
              <a-avatar :style="{ backgroundColor: '#FF7D00' }">G</a-avatar>
            </a-avatar-group>
          </a-space>
        </div>

      </div>

      <div class="subtitle comment-title">COMMENTS</div>

      <div class="comments-content" v-for="i in Array(3)" :key="i">
        <a-divider />
        <div class="flex-content">
          <div class="head-profile">
            <a-space size="large">
              <a-avatar :size="36"
                imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp">
              </a-avatar>
            </a-space>
          </div>

          <div class="content">
            <h3 class="name">George</h3>
            <p class="com-content">The Rennsteig begins at the Werraufer in Hörschel. Here, so it is custom, you should
              take a
              pebble, which you throw in the hall at the end of your tour. The first stage leads you about 19 kilometers
              almost steadily uphill. At the large Eichelberg (310 m above sea level) offers a beautiful view of the</p>
            <p class="date">August 31, 2017</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TourPage"
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type TourRecord, TourType } from '@/apis/tour'
import { getTourCollection, type TourCollection } from '@/apis/collection'
import { getTourSpotExample } from '@/apis/tour/spot'
import { exampleUserRecord } from '@/apis/user'
import DCard from '../discover/DCard.vue';

const url = import.meta.env.APP_STATIC_URL.concat("/tour")
const exam_pic = "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"

const mode = "minimal"
const testCardInfo: TourRecord = {
  id: 0,
  title: '这是一个用来展示一个行程的card',
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

// const commentArea = ref<HTMLDivElement | undefined>()
const mapWrapper = ref<HTMLDivElement | undefined>()
const picWrapper = ref<HTMLDivElement | undefined>()
// const textA = ref('')

const smallImg = ref(testCardInfo.mapCapture)
// const commentList = testCardInfo.comments

const switchStatus = ref<'map' | 'pic'>('map')

const switchClick = () => {
  switch (switchStatus.value) {
    case 'map':
      switchStatus.value = 'pic'
      if (picWrapper.value) {
        picWrapper.value.classList.add('hide')
      }
      if (mapWrapper.value) {
        mapWrapper.value.classList.remove('hide')
      }
      smallImg.value = testCardInfo.spots[0].coverUrl
      break

    case 'pic':
      switchStatus.value = 'map'
      if (picWrapper.value) {
        picWrapper.value.classList.remove('hide')
      }
      if (mapWrapper.value) {
        mapWrapper.value.classList.add('hide')
      }
      smallImg.value = testCardInfo.mapCapture
      break
  }
}

const isMinimal = ref(false)

onMounted(() => {
  if (mode === 'minimal') {
    isMinimal.value = true;
    switchStatus.value = 'map';
    switchClick();
  }
})
</script>

<style></style>
