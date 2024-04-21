<script lang="ts" setup>
import { getTourHighlightById, type TourHighlight } from '@/apis/tour/highlight';
import { computed, onMounted, ref } from 'vue';


const highlightData = ref<TourHighlight>();

// this is the len of img

onMounted(() => {
  getTourHighlightById(4)
  .then(response => {
    const highlight: TourHighlight|undefined = response.data;
    highlightData.value = highlight;
  })
  .catch(error => {
    console.error('Error fetching highlight data:', error);
  })
})

// 执行判断的逻辑 判断图片数量
const lenImg = computed(() => highlightData.value ? (highlightData.value.tourImages).length : 0)
</script>

<template>
  <div id="page-highlight">
    <div class="left-page">
      <!-- the section of bg and title in tour page -->
      <section class="highlight-title">
        <!-- the bg part -->
        <div v-if="lenImg === 1">
          <div class="bg-1">
            <img
              :src="highlightData?.tourImages[0].imageUrl"
              alt="">
          </div>
        </div>

        <div v-else-if="lenImg === 2">
          <div class="bg-2">
            <img
              :src="highlightData?.tourImages[0].imageUrl"
              alt="">
            <img
              :src="highlightData?.tourImages[1].imageUrl"
              alt="">
          </div>
        </div>

        <div v-else class="bg-3">
          <div class="main-bg">
            <img
              :src="highlightData?.tourImages[0].imageUrl"
              alt="">
          </div>
          <div class="sub">
            <div class="sub-bg">
              <img 
                :src="highlightData?.tourImages[1].imageUrl"
                alt="">
            </div>
            <div class="sub-bg">
              <img 
                :src="highlightData?.tourImages[2].imageUrl"
                alt="">
            </div>
          </div>
        </div>

        <!-- the title part -->
        <div class="title">
          <h1 class="main-title">{{highlightData?.title}}</h1>
          <h3 class="des">
            This is {{highlightData?.title}} tour. Very good fitness required. Sure-footedness, sturdy shoes and alpine
            experience required.
          </h3>
        </div>

        <!-- follow part -->
        <div class="follow">
          <a-divider />
          <a-avatar-group :size="30" :max-count="3">
            <a-avatar :style="{ backgroundColor: '#7BC616' }"
              imageUrl="https://tse2-mm.cn.bing.net/th/id/OIP-C.o9tg5_XvkferD0XD5qtAYAHaFj?rs=1&pid=ImgDetMain">
            </a-avatar>
            <a-avatar :style="{ backgroundColor: '#14C9C9' }"
              imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp">
              B
            </a-avatar>
            <a-avatar :style="{ backgroundColor: '#7BC616' }"
              imageUrl="https://tse2-mm.cn.bing.net/th/id/OIP-C.o9tg5_XvkferD0XD5qtAYAHaFj?rs=1&pid=ImgDetMain">
            </a-avatar>
            <a-avatar :style="{ backgroundColor: '#FF7D00' }">Arco</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FFC72E' }">Design</a-avatar>
          </a-avatar-group>
          <div class="recommend">Recommended by 31 cyclists</div>
        </div>
      </section>

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
            <p class="com-content">
              The Rennstei Wes sostom, you should take a pebble, which you throw in the hall at the
              end of your tour. The first stage leads you about 19 kilometers almost steadily uph=e
            </p>
            <p class="date">August 31, 2017</p>
          </div>
        </div>
      </div>
    </div>

    <div class="right-page">
      <h3 class="right-title">Top Touring Cycling Routes to The Heron Farm Shop and Cafe</h3>
      <div class="tours highlights" v-for="i in Array(3)" :key="i">
        <a-divider />
        <div class="h-title">

          <div class="left">
            <span class="category">Expert</span>
            <h1 class="main-title">Chengdu Giant Panda Base</h1>
            <div>
              <span class="time">07:10</span>
              <span class="distance">18.4km</span>
              <span class="speed">2.6km/h</span>
            </div>
          </div>

          <div class="right">
            <div class="icon">
              <svg aria-hidden="true" role="presentation" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="css-nqigl7">
                <g clip-path="url(#tour-visitors_svg__clip0_5249_547)">
                  <path
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                    fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="tour-visitors_svg__clip0_5249_547">
                    <path fill="#666666" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
              <span>11</span>
            </div>
            <div class="pic">
              <img
                src="https://tourpic-vector.maps.komoot.net/r/small/ik~%60@xonAKj@FhAe@DAd@U@QvBFrDLz@hAeAHnDEvCBtCfAdFFbAPx@BnALjAd@dA%5EbB~@o@VGFFGGWF_An@_@cBe@eAMkACoAQy@GcAgAeFCuCDwCIoDiAdAM%7B@GsDPwBTA@e@d@EGiAJk@/?width=200&height=200&crop=true&q=40&quot"
                alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebHighlight'
}
</script>

<style lang="scss" scoped>
/* 这里是你的样式 */
</style>