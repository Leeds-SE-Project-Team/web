<template>
  <div class="tour-main">
    <!-- the section of bg and title in tour page -->
    <section class="tour-title">
      <!-- the bg part -->
      <div v-if="tourRecord" class="bg flex-r">
        <div class="main-bg">
          <img
            alt=""
            :src="coverImg"
          />
        </div>
        <div class="sub">
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
        </div>
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
        
        <a-timeline-item
          v-for="(highlight, idx) in tourRecord?.tourHighlightList"
          :key="idx"
          :label="`Tour Highlight ${idx + 1}: ${highlight.title ? highlight.title : idx+1 + 'th highlight'}`"
          class="pic-map"
          lineType="dashed"
        >
          <DHighlight @jump="toTour" :data="highlight"></DHighlight>
        </a-timeline-item>
        
        <a-timeline-item class="pic-map" lineType="dashed">
          <h4>End</h4>
        </a-timeline-item>
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
    </section>

    <section class="weather">
      <div class="subtitle">
        WEATHER
      </div>
    </section> -->
  </div>

  <div v-if="true" class="comments">
    <a-space size="large">
      <a-avatar
        :size="50"
        :imageUrl="tourRecord?.user.avatar"
      >
      </a-avatar>
      <div class="rigion">
        <h3>{{tourRecord?.user.nickname}}</h3>
        <p>{{tourRecord?.user.latestLoginTime}}</p>
      </div>
    </a-space>

    <div class="like">
      <div>
        <a-button class="button-icon" @click="like_btn()">
          <template #icon>
            <div class="icon">
              <icon-heart class="button" />
              <span>{{tourRecord?.likedBy.length}}</span>
            </div>
          </template>
        </a-button>
      
        <a-button class="button-icon" @click="star_btn()">
          <template #icon>
            <div class="icon">
              <icon-star-fill class="button" />
              <span>{{tourRecord?.likedBy.length}}</span>
            </div>
          </template>
        </a-button>
      </div>
      
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
import DHighlight from '@/views/mobile/discover/DHighlight.vue'
import { computed } from 'vue'
import { getUserById } from '@/apis/user'
import { postLike, postStar, deleteLike, deleteStar } from '@/apis/tour'
import { useUserStore } from '@/stores'
import { number } from 'echarts'

const url = import.meta.env.APP_STATIC_URL.concat('/tour')
const exam_pic =
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp'

const route = useRoute()
const router = useRouter()
const tourRecord = ref<TourRecord>()

const toTour = ()=>{
  router.push({name:'anotherHighlight'})
}

const coverImg = computed(()=>{
  if(!tourRecord.value){
    return '';
  }else if(!tourRecord.value.tourHighlightList[0]){
    return tourRecord.value.mapUrl;
  }
  // tourRecord.value.tourHighlightList[0].tourImages[0]?.imageUrl;
  return ""
})


const userStore = useUserStore()
const curUser = computed(()=>userStore.curUser)
const is_like = ref(false)
const is_star = ref(false)

const tourId = route.query.id as string

onMounted(() => {
  getTour()
})

const getTour = async() => {
  await getTourById(route.query.id as string)
  .then((res) => {
    if (res.success) {
      tourRecord.value = res.data
      console.log(tourRecord.value)
      if(tourRecord.value?.likedBy.includes(curUser.value?.id as number)) {
        is_like.value = true
      } else {
        is_like.value = false
      }
      if(tourRecord.value?.starredBy.includes(curUser.value?.id as number)) {
        is_star.value = true
      } else {
        is_star.value = false
      }
      // console.log("user", curUser.value?.id)
      // console.log("yes", is_like.value, is_star.value)
    }
  })
}

const like_btn = () => {
  if(is_like.value) {
    delLike(tourId)
    console.log("delete, like")
    getTour()
  } else {
    like(tourId)
    getTour()
  }
}

const star_btn = () => {
  if(is_star.value) {
    delStar(tourId)
    console.log("delete, star")
    getTour()
  } else {
    star(tourId)
    getTour()
  }
}

const like = (tourId: string) =>  {
  postLike(tourId).then((res)=>{
    if(!res.success){
      console.log("error", res)
    }
  })
}

const delLike = (tourId: string) => {
  deleteLike(tourId).then((res)=>{
    if(!res.success){
      console.log("error", res)
    }
  })
}

const star = (tourId: string) =>  {
  postStar(tourId).then((res)=>{
    if(!res.success){
      console.log("error", res)
    }
  })
}

const delStar = (tourId: string) => {
  deleteStar(tourId).then((res)=>{
    if(!res.success){
      console.log("error", res)
    }
  })
}

</script>

<style></style>
