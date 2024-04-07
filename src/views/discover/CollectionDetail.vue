<template>
  <div id="page-collection-detail">
    <div
      class="head-background"
      style="background: url('https://file.wmzspace.space//collection/6/cover.png')"
    ></div>
    <!-- 可能的面包屑 -->
    <div></div>
    <div class="header-cover">
      <div class="img-wrapper">
        <img alt="" src="https://file.wmzspace.space//collection/6/cover.jpg" />
      </div>
    </div>
    <div class="content">
      <h1 class="content-title" style="font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;">3-DAY-Chengdu Tour</h1>
      <div class="user flex-r flex-justify-c">
        <div class="info-wrapper flex-c">
          <div class="avatar-wrapper flex-r flex-justify-c">
            <a-avatar>
              <img alt="" src="//fp1.fghrsh.net/2023/05/16/b082833e5c59a309880eca3d525e7cae.gif" />
            </a-avatar>
          </div>
          <div class="specify flex-r flex-justify-c">
            <span><a href="#">Test</a></span>
          </div>
        </div>
      </div>
      <div class="content-data flex-r w-full flex-justify-c">
        <!-- <div class="data-item flex-r">
          <div class="icon"></div>
          <span>100</span>
          <span>Tours</span>
        </div>
        <div class="data-item flex-r">
          <div class="icon"></div>
          <span>100</span>
          <span>Tours</span>
        </div>
        <div class="data-item flex-r">
          <div class="icon"></div>
          <span>100</span>
          <span>Tours</span>
        </div> -->
        <div class="data-item flex-r">
          <div class="icon"></div>
          <span>3</span>
          <span>Tours</span>
        </div>
      </div>
      <div class="operation flex-r flex-justify-c">
        <div class="operation-item">
          <a-button class="operation-button">
            <template #icon>
              <icon-heart :size="28" />
            </template>
            1
          </a-button>
        </div>
        <div class="operation-item">
          <a-button class="operation-button">
            <template #icon>
              <icon-message :size="28" />
            </template>
            0
          </a-button>
        </div>
        <div class="operation-item">
          <a-button class="operation-button">
            <template #icon>
              <icon-star :size="28" />
            </template>
          </a-button>
        </div>
        <div class="operation-item">
          <a-button class="operation-button">
            <template #icon>
              <icon-share-internal :size="28" />
            </template>
          </a-button>
        </div>
      </div>
      <div class="main-content flex-r flex-justify-c">
        <p>家人们谁懂啊，成都这里真好玩！</p>
      </div>
    </div>
    <div class="divider w-full">
      <span></span>
    </div>
    <h2 class="text-center">On the Map</h2>
    <div class="map-area w-full" style="display: flex; justify-content: center;margin-top: 0;">
      <!--      <RouteMap></RouteMap>-->
      <!-- <el-amap :scroll-wheel="false" style="width: 100%; height: 100%">
        <el-amap-control-geolocation
          :circleOptions="{
            fillOpacity: 0,
            strokeOpacity: 0
          }"
        />
      </el-amap> -->
      <img  src="https://file.wmzspace.space//collection/6/map.jpg" alt="" width="80%" style="object-fit: contain; margin: 0 auto"/>
    </div>
    <div class="divider">
      <span></span>
    </div>
    <h2 class="text-center">Tours</h2>
    <div ref="scrollContainer" class="tour-scroll-container">
      <div ref="imgCollection" class="img-collection">
        <div v-for="(_, i) in testCardInfo" :key="i" class="img-wrapper">
          <img v-if="flag" :src="testCardInfo[i].tourHighlightList[0].tourImages[0].imageUrl" alt="" />
        </div>
      </div>
      <div class="tianchong"></div>
      <div ref="tourScroll" class="tour-card-wrapper w-full">
        <div v-for="(tc, i) in testCardInfo" :key="i" class="tour-card flex-c flex-justify-c">
          <DCard
            v-if="flag"
            :tour-data="testCardInfo[i]" mode="minimal"
            style="overflow: hidden"
            @jump="toTour(tc.id)"
          ></DCard>
        </div>
      </div>
    </div>
    <!-- <div>
      <a-input
              :max-length="400"
              class="comment-input"
              placeholder="留下你的精彩评论吧"
            >
              <template #suffix>
                <a-tooltip>
                  <template #content> 没有可以@的朋友</template>
                  <img alt="at_friend" class="icon-at" src="/interaction/comment_at.svg" />
                </a-tooltip>
                <a-tooltip>
                  <template #content>发布评论</template>
                  <img
                    alt="send_comment"
                    class="icon-send"
                    src="/interaction/send_comment.svg"
                  />
                </a-tooltip>
              </template>
            </a-input>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// import MapContainer from '@/components/map/MapContainer.vue';
import DCard from './DCard.vue'
import { type TourRecord, TourType, getTourById } from '@/apis/tour'
import { useRouter } from 'vue-router';

const tourScroll = ref<HTMLDivElement | null>(null)
const scrollContainer = ref<HTMLDivElement | null>(null)
const imgCollection = ref<HTMLDivElement | null>(null)
var ticking = false

const router = useRouter()

const testCardInfo = ref<TourRecord[]>([])

function switching(
  imgs: HTMLCollectionOf<HTMLDivElement>,
  cards: HTMLCollectionOf<HTMLDivElement>,
  vh: number
) {
  if (!tourScroll.value) {
    return
  }
  let offsetTop = tourScroll.value.getBoundingClientRect().top
  // 如果卡片未抵达或超出视窗范围则什么都不干
  if (offsetTop > vh * 0.5 - 350 || offsetTop + imgs.length * 700 < vh) {
    return
  }
  // 画个图推导一下就大概能明白的当前图片的序号以及
  // 卡片中心相对于屏幕中心的偏移值的计算公式
  let curCardIndex = Math.floor((vh * 0.5 - offsetTop) / 700)
  let curOffset = vh * 0.5 - (offsetTop + curCardIndex * 700 + 350)
  // 渐变阈值：正向偏移150像素
  if (curOffset > 150) {
    if (curCardIndex >= imgs.length - 1) {
      return
    }
    imgs[curCardIndex].setAttribute('style', `opacity: ${1 - (curOffset - 150) / 200}`)
    imgs[curCardIndex + 1].setAttribute('style', `opacity: ${(curOffset - 150) / 200}`)
    cards[curCardIndex].style.opacity = `${1 - (curOffset - 150) / 200}`
    cards[curCardIndex + 1].style.opacity = `${(curOffset - 150) / 200}`
  } else {
    // 处理从底部滑出时的结束状态，不处理下一张卡片和图
    if (curCardIndex >= imgs.length - 1) {
      imgs[curCardIndex].setAttribute('style', `opacity: 1`)
      cards[curCardIndex].style.opacity = '1'
      cards[curCardIndex - 1].style.opacity = '0'
      return
    }
    // 处理从顶部滑出时的结束状态，不处理上一张卡片和图
    if (curCardIndex - 1 < 0) {
      imgs[curCardIndex].setAttribute('style', `opacity: 1`)
      imgs[curCardIndex + 1].setAttribute('style', `opacity: 0`)
      cards[curCardIndex].style.opacity = '1'
      cards[curCardIndex + 1].style.opacity = '0'
      return
    }
    // 其余范围内的状态
    imgs[curCardIndex].setAttribute('style', `opacity: 1`)
    imgs[curCardIndex + 1].setAttribute('style', `opacity: 0`)
    cards[curCardIndex].style.opacity = '1'
    cards[curCardIndex + 1].style.opacity = '0'
    cards[curCardIndex - 1].style.opacity = '0'
  }
}

const flag = ref(false)
getTourById(18).then((res)=>{
  if(res.success){
    testCardInfo.value.push(res.data!)
  }
  return getTourById(20)
}).then((res)=>{
  if(res.success){
    testCardInfo.value.push(res.data!)
  }
  return getTourById(21)
}).then((res)=>{
  if(res.success){
    testCardInfo.value.push(res.data!)
  }
  return getTourById(22)
}).then((res)=>{
  if(res.success){
    testCardInfo.value.push(res.data!)
    flag.value = true
  }
  console.log(testCardInfo.value)
})

const toTour = (id:string|number)=>{
  router.push({name:'tour', query:{id: id}})
}

onMounted(() => {
  if (tourScroll.value && scrollContainer.value) {
    const imgs = scrollContainer.value.getElementsByClassName(
      'img-wrapper'
    ) as HTMLCollectionOf<HTMLDivElement>
    const cards = tourScroll.value.getElementsByClassName(
      'tour-card'
    ) as HTMLCollectionOf<HTMLDivElement>
    const vh = document.body.clientHeight
    window.addEventListener('scroll', function () {
      if (!ticking) {
        // 节流
        // 每一帧根据滑动距离计算图片透明度
        window.requestAnimationFrame(() => {
          switching(imgs, cards, vh)
          ticking = false
        })
        ticking = true
      }
    })
  }
})
</script>
<style scoped>
:deep(.arco-btn-size-medium svg){
  vertical-align: -6px;
}
</style>