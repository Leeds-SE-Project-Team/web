<template>
  <div class="tour-main">
    <!-- the section of bg and title in tour page -->
    <section class="tour-title">
      <!-- the bg part -->
      <div v-if="tourRecord" class="bg flex-r">
        <div class="main-bg">
          <img
            alt=""
            :src="tourRecord.tourHighlightList[0].tourImages[0].imageUrl"
          />
        </div>
        <!-- <div class="sub">
          <div class="sub-bg">
            <img
              alt=""
              src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tr/trthvnkx56se9kcbf398tcu03nih1d0x-uhi28292499/0?width=1000&height=740&crop=true&q=40"
            />
          </div>
          <div class="sub-bg">
            <img
              alt=""
              src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/1u/1urqmvln4zd5vxwvhc9euyi43nih7at3-uhi28292564/0?width=600&height=354&crop=true&q=40"
            />
          </div>
        </div> -->
      </div>

      <!-- the title part -->
      <div class="title">
        <h1 class="main-title">{{ tourRecord?.title }}</h1>
        <div class="main-info">
          <span class="category">{{ tourRecord?.type }}</span>
          <span class="time">{{ tourRecord ? tourRecord.createTime : '' }}</span>
          <div style="margin: 10px 0">
            <span class="distance" style="margin: 0">18.4</span>km
            <span class="speed">2.6</span>km/h
          </div>
        </div>
        <!--        <h3 class="des">-->
        <!--          Expert Hiking Tour. Very good fitness required. Sure-footedness, sturdy shoes and alpine-->
        <!--          experience required.-->
        <!--        </h3>-->
      </div>
    </section>

    <!-- the section of TOUR OVERVIEW -->
    <section class="overview">
      <div class="subtitle">TOUR OVERVIEW</div>
      <a-divider />
      <a-timeline class="timeline" labelPosition="same">
        <!-- <a-timeline-item class="pic-map" label="开始" lineType="dashed">
          <div class="mile">3 km</div>
          <div class="tour-pic">
            <div class="pic-container flex-r">
              <div class="pic">
                <img
                  alt=""
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40"
                />
              </div>
            </div>
          </div>
        </a-timeline-item> -->

        <section class="map" style="margin-bottom: 1rem">
          <div class="subtitle">
            MAP
          </div>
          <div v-if="tourRecord" class="map-img">
            <img :src="tourRecord.mapUrl" alt="">
          </div>
        </section>

        <a-timeline-item class="pic-map" lineType="dashed">
          <h4>Start</h4>
        </a-timeline-item>
        <a-timeline-item v-if="fakeSpots.length">
          <div class="tour-pic">
            <div class="pic-container flex-r">
              <div v-for="(spots,i) in fakeSpots" :key="i" class="pic">
                <img alt=""
                  :src="spots" />
              </div>
            </div>
          </div>
        </a-timeline-item>
        <a-timeline-item
          v-for="(highlight, idx) in tourRecord?.tourHighlightList"
          :key="idx"
          :label="`Tour Highlight ${idx + 1}`"
          class="pic-map"
          lineType="dashed"
        >
          <DHighlight @jump="toTour" :data="highlight"></DHighlight>
        </a-timeline-item>
        <a-timeline-item class="pic-map" lineType="dashed">
          <h4>End</h4>
        </a-timeline-item>
        <!--
        <a-timeline-item class="pic-map" label="2017-03-10 8:20" lineType="dashed">
          <div class="mile">3 m</div>
          <div class="tour-pic">
            <div class="pic-container flex-r">
              <div class="pic">
                <img alt=""
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tr/trthvnkx56se9kcbf398tcu03nih1d0x-uhi28292499/0?width=1000&height=740&crop=true&q=40" />
              </div>
              <div class="pic">
                <img alt=""
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40" />
              </div>
              <div class="pic">
                <img alt=""
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/1u/1urqmvln4zd5vxwvhc9euyi43nih7at3-uhi28292564/0?width=600&height=354&crop=true&q=40" />
              </div>
            </div>
          </div>
        </a-timeline-item> -->

        <!-- <a-timeline-item class="pic-map" label="2017-03-10 8:20" lineType="dashed">
          <div class="mile">3 km</div>
          <div class="tour-pic">
            <div class="pic-container flex-r">
              <div class="pic">
                <img
                  alt=""
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tr/trthvnkx56se9kcbf398tcu03nih1d0x-uhi28292499/0?width=1000&height=740&crop=true&q=40"
                />
              </div>
              <div class="pic">
                <img
                  alt=""
                  src="https://d2exd72xrrp1s7.cloudfront.net/www/000/1k5/tj/tjg6zittau7y7yt2j21g2dlc3nihg66r-uhi28292624/0?width=1000&height=620&crop=true&q=40"
                />
              </div>
            </div>
          </div>
        </a-timeline-item> -->
      </a-timeline>
    </section>

    <!-- the section of map -->
    <!-- <section class="map">
      <div class="subtitle">
        MAP
      </div>
      <div class="map-img"></div>
    </section> -->

    <!-- the section of weather and profile .. and so on -->
    <!-- <section class="profile">
      <div class="subtitle">
        PROFIEL
      </div>
    </section> -->

    <!-- <section class="weather">
      <div class="subtitle">
        WEATHER
      </div>
    </section> -->
  </div>

  <div v-if="false" class="comments">
    <a-space size="large">
      <a-avatar
        :size="50"
        imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
      >
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

    <div v-for="i in Array(3)" :key="i" class="comments-content">
      <a-divider />
      <div class="flex-content">
        <div class="head-profile">
          <a-space size="large">
            <a-avatar
              :size="36"
              imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            >
            </a-avatar>
          </a-space>
        </div>

        <div class="content">
          <h3 class="name">George</h3>
          <p class="com-content">
            The Rennsteig begins at the Werraufer in Hörschel. Here, so it is custom, you should
            take a pebble, which you throw in the hall at the end of your tour. The first stage
            leads you about 19 kilometers almost steadily uphill. At the large Eichelberg (310 m
            above sea level) offers a beautiful view of the
          </p>
          <p class="date">August 31, 2017</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TourPage'
}
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type TourRecord, getTourById } from '@/apis/tour'
import { useRoute, useRouter } from 'vue-router'
import DHighlight from '@/views/discover/DHighlight.vue'

const url = import.meta.env.APP_STATIC_URL.concat('/tour')
const exam_pic =
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp'

const route = useRoute()
const router = useRouter()
const mode = 'minimal'
const tourRecord = ref<TourRecord>()

const toTour = ()=>{
  router.push({name:'highlight'})
}

// const testCardInfo = reactive<TourRecord>({
//   id: 0,
//   title: '这是一个用来展示一个行程的card',
//   user: {
//     id: 0,
//     email: '234',
//     nickname: 'test user',
//     avatar: '//fp1.fghrsh.net/2023/05/16/b082833e5c59a309880eca3d525e7cae.gif',
//     registerTime: '234',
//     latestLoginTime: '25'
//   },
//   tourSpotList: [],
//   tourHighlightList:[],
//   mapUrl: getStaticRes(`/tour/${route.query.id}/map_screenshot.jpg`),
//   // map: '//fp1.fghrsh.net/2020/01/12/b51236a90d69167c8f4b5af47ab57861.jpg',
//   // like: 100,
//   // comment: 3,
//   comments: [
//     {
//       id: 1,
//       tourId: 1,
//       author: exampleUserRecord,
//       content: 'this is a sample content',
//       publishTime: '2024-3-4 00:00:00',
//       replies: []
//     },
//     {
//       id: 2,
//       tourId: 1,
//       author: exampleUserRecord,
//       content: 'this is a sample content',
//       publishTime: '2024-3-4 00:00:00',
//       replies: []
//     },
//     {
//       id: 3,
//       tourId: 1,
//       author: exampleUserRecord,
//       content: 'this is a sample content',
//       publishTime: '2024-3-4 00:00:00',
//       replies: []
//     }
//   ],
//   startLocation: '',
//   endLocation: '',
//   createTime: '2024-3-4 00:00:00',
//   type: TourType.WALK,
//   pons: [],
//   status: 'awaitApproval',
//   tourCollectionId: 1
// })

// const commentArea = ref<HTMLDivElement | undefined>()
// const mapWrapper = ref<HTMLDivElement | undefined>()
// const picWrapper = ref<HTMLDivElement | undefined>()
// const textA = ref('')

// const smallImg = ref(testCardInfo.mapUrl)
// const commentList = testCardInfo.comments

const switchStatus = ref<'map' | 'pic'>('map')

// const switchClick = () => {
//   switch (switchStatus.value) {
//     case 'map':
//       switchStatus.value = 'pic'
//       if (picWrapper.value) {
//         picWrapper.value.classList.add('hide')
//       }
//       if (mapWrapper.value) {
//         mapWrapper.value.classList.remove('hide')
//       }
//       smallImg.value = testCardInfo.spots[0].coverUrl
//       break

//     case 'pic':
//       switchStatus.value = 'map'
//       if (picWrapper.value) {
//         picWrapper.value.classList.remove('hide')
//       }
//       if (mapWrapper.value) {
//         mapWrapper.value.classList.add('hide')
//       }
//       smallImg.value = testCardInfo.mapUrl
//       break
//   }
// }

const isMinimal = ref(false)

// 这里是假数据
const fakeSpots = ref<string[]>([])
if(route.query.id === '20'){
  fakeSpots.value.push('https://api.wmzspace.space/tour/20/spots/p1.jpg')
  fakeSpots.value.push('https://api.wmzspace.space/tour/20/spots/p2.jpg')
  fakeSpots.value.push('https://api.wmzspace.space/tour/20/spots/p3.jpg')
  fakeSpots.value.push('https://api.wmzspace.space/tour/20/spots/p4.jpg')
}else if(route.query.id === '21'){
  fakeSpots.value.push('https://api.wmzspace.space/tour/21/spots/baby.jpeg')
  fakeSpots.value.push('https://api.wmzspace.space/tour/21/spots/huahua.jpg')
  fakeSpots.value.push('https://api.wmzspace.space/tour/21/spots/panda.jpg')
  fakeSpots.value.push('https://api.wmzspace.space/tour/21/spots/pandas.jpg')
}

if (mode === 'minimal') {
  isMinimal.value = true
  switchStatus.value = 'map'
  // switchClick()
}

onMounted(() => {
  getTourById(route.query.id as string).then((res) => {
    if (res.success) {
      tourRecord.value = res.data
      console.log(tourRecord.value)
    }
  })
})
</script>

<style></style>
