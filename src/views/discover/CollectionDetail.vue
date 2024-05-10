<template>
  <div id="page-collection-detail">
    <div
      class="head-background"
      :style="`background: url(${thisCollection?thisCollection.coverUrl:''})`"
    ></div>
    <!-- 可能的面包屑 -->
    <div></div>
    <div class="header-cover">
      <div class="img-wrapper">
        <img alt="" :src="thisCollection?thisCollection.coverUrl:''" />
      </div>
    </div>
    <div class="content">
      <h1 class="content-title" style="font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;">
        {{ thisCollection ? thisCollection.title : '' }}
      </h1>
      <div class="user flex-r flex-justify-c">
        <div class="info-wrapper flex-c">
          <div class="avatar-wrapper flex-r flex-justify-c">
            <a-avatar>
              <img alt="" :src="thisCollection?thisCollection.user.avatar:''" />
            </a-avatar>
          </div>
          <div class="specify flex-r flex-justify-c">
            <span><a href="#">
              {{ thisCollection?thisCollection.user.nickname:'' }}
            </a></span>
          </div>
        </div>
      </div>
      <div class="content-data flex-r w-full flex-justify-c">
        <div class="data-item flex-r">
          <div class="icon"></div>
          <span>
            {{ thisCollection ? thisCollection.tours.length : ''}}
          </span>
          <span>Tours</span>
        </div>
      </div>
      <div class="operation flex-r flex-justify-c">
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
              <icon-share-internal :size="28" />
            </template>
          </a-button>
        </div>
      </div>
      <div class="main-content flex-r flex-justify-c">
        <p>{{ thisCollection?thisCollection.title:'' }}</p>
      </div>
    </div>
    <div class="divider w-full">
      <span></span>
    </div>
    <h2 class="text-center">On the Map</h2>
    <div class="map-area w-full flex-r" style="margin-top: 0; position: relative;">
      <div class="controler" style="position: absolute; width: 100%; height: 100%;">
        <div class="buttons flex-r">
          <a-button 
            type="primary"
            shape="circle"
            @click="fixedToAll"
          >ALL</a-button>
          <a-button
            v-for="(_,index) in mapRoutes"
            :key="index"
            type="primary"
            shape="circle"
            @click="fixedToTour(index)"
          >
            {{ index+1 }}
          </a-button>
        </div>
        
      </div>
      <!--      <RouteMap></RouteMap>-->
      <el-amap :scroll-wheel="false" ref="routeMap">
        <el-amap-control-geolocation
          :circleOptions="{
            fillOpacity: 0,
            strokeOpacity: 0
          }"
        />
      </el-amap>
      <!-- <img  src="https://file.wmzspace.space//collection/6/map.jpg" alt="" width="80%" style="object-fit: contain; margin: 0 auto"/> -->
    </div>
    <div class="divider">
      <span></span>
    </div>
    <h2 class="text-center">Tours</h2>
    <div ref="scrollContainer" class="tour-scroll-container">
      <div ref="imgCollection" class="img-collection">
        <div v-for="(_, i) in cardInfos" :key="i" class="img-wrapper">
          <img v-if="flag" :src="
            cardInfos[i].tourHighlightList[0] ?
            cardInfos[i].tourHighlightList[0].tourImages[0].imageUrl :
            cardInfos[i].mapUrl
          " alt="" />
        </div>
      </div>
      <div class="tianchong"></div>
      <div ref="tourScroll" class="tour-card-wrapper w-full">
        <div v-for="(tc, i) in cardInfos" :key="i" class="tour-card flex-c flex-justify-c">
          <DCard
            v-if="flag"
            :tour-data="cardInfos[i]" mode="minimal"
            style="overflow: hidden"
            @jump="toTour(tc.id)"
          ></DCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// import MapContainer from '@/components/map/MapContainer.vue';
import DCard from '@/views/web/discover/components/DCard.vue'
import { type TourRecord } from '@/apis/tour'
import { useRoute, useRouter } from 'vue-router';
import { getCollectionById, type TourCollection } from '@/apis/collection';
import { Message } from '@arco-design/web-vue';
import { useMapStore } from '@/stores';

const tourScroll = ref<HTMLDivElement | null>(null)
const scrollContainer = ref<HTMLDivElement | null>(null)
const imgCollection = ref<HTMLDivElement | null>(null)
const routeMap = ref<AMap.Map | null>(null)
var ticking = false

const router = useRouter();
const route = useRoute();

const cardInfos = ref<TourRecord[]>([])
const mapRoutes = ref<any[]>([])
const thisCollection = ref<TourCollection>()

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

const handleCardMoving = ()=>{
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
}

const toTour = (id:string|number)=>{
  router.push({name:'tour', query:{id: id}})
}

const jsonToPath = (data:any):Array<[number,number]>=> {
  const res: Array<[number,number]> = [];
  res.push(data.result.origin);
  console.log(data)
  data.result.routes[0].steps.forEach((item:any)=>{
    item.path.forEach((route:[number,number])=>{
      res.push(route);
    })
  })
  return res;
}

const fixedToTour = (index: number)=>{
  if(routeMap.value){
    (routeMap.value as any).$$getInstance().setFitView(mapRoutes.value[index]);
  }
}

const fixedToAll = ()=>{
  const overlays:any[] = [];
  mapRoutes.value.forEach(item=>{
    overlays.push(...item);
  })
  if(routeMap.value){
    (routeMap.value as any).$$getInstance().setFitView(overlays);
  }
}

onMounted(() => {
  getCollectionById(route.query.id as string).then(res=>{
    console.log(res);
    thisCollection.value = res.data
    if(res.success){
      res.data?.tours.forEach(item=>{
        cardInfos.value.push(item);
        fetch(item.dataUrl).then(data=>{
          return data.json()
        }).then(dj=>{
          const layers = useMapStore().drawRoute(
            (routeMap.value as any).$$getInstance(),
            jsonToPath(dj),
            item.type,{},false,true
          )
          mapRoutes.value.push(layers)
        })
      })
      flag.value = true
      handleCardMoving()
    }else{
      Message.info(res.message)
    }
  })
})
</script>
<style scoped>
:deep(.arco-btn-size-medium svg){
  vertical-align: -6px;
}
.el-vue-amap-container{
  flex: 1;
}
</style>