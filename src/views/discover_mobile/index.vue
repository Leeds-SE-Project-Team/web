<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { getTimeDiffUntilNow } from '@/utils'
import useLoading from '@/hooks/loading'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  exampleTourCollection,
  exampleTourCollection2,
  type TourCollection
} from '@/apis/collection'
import { useUserStore } from '@/stores/user'

const currentPlayIndex = ref(0)

const loadingObject = useLoading()
const setLoadingVideo = loadingObject.setLoading
const loadingVideo = loadingObject.loading

const handlePlayPrev = () => {
  if (!canHandleSwitch.value) {
    return
  }
  if (currentPlayIndex.value > 0) {
    canHandleSwitch.value = false
    currentPlayIndex.value -= 1
    // createPlay(itemList.value[currentPlayIndex.value])
    // refreshVideoLikeAndStar()
    nextAfterLoad.value = false
    nextTick(() => {
      adjustHeight(true)
    })
  }
}

const nextAfterLoad = ref(false)
const handlePlayNext = () => {
  if (
    !canHandleSwitch.value ||
    (loadingVideo.value && currentPlayIndex.value >= itemList.value.length - 1)
  ) {
    return
  }

  canHandleSwitch.value = false
  if (currentPlayIndex.value < itemList.value.length - 1) {
    currentPlayIndex.value += 1
    // createPlay(itemList.value[currentPlayIndex.value])
    // refreshVideoLikeAndStar()
  } else {
    Message.loading({
      id: 'loadMore',
      content: '加载中...'
    })
    nextAfterLoad.value = true
    // getMoreVideos(3, false).then(() => {
    //   Message.success({
    //     id: 'loadMore',
    //     content: '更新成功'
    //   })
    //   if (nextAfterLoad.value) {
    //     handlePlayNext()
    //   }
    // })
  }
  nextTick(() => {
    adjustHeight(true)
  })
}

const canHandleSwitch = ref(false)
const handleWheel = (event: WheelEvent) => {
  if (canHandleSwitch.value) {
    const delta = Math.sign(event.deltaY)
    if (delta > 0) {
      if (!loadingVideo.value || currentPlayIndex.value < itemList.value.length - 1) {
        handlePlayNext()
      }
    } else if (delta < 0) {
      if (currentPlayIndex.value > 0) {
        handlePlayPrev()
      }
    }
  }
}

const userStore = useUserStore()

const currentVideo = computed(() => itemList.value[currentPlayIndex.value])
const isLiked = ref(false)
const isStarred = ref(false)

const videoLikeShowNum = ref(0)
const videoStarShowNum = ref(0)

const router = useRouter()
// const handleClickAvatar = (authorId: number) => {
//   console.log(authorId)
//   router.push({
//     name: 'userProfile',
//     params: { user_id: authorId }
//   })
// }

const slideList = ref()

const parentHeight = ref(0)

const adjustHeight = (animation: boolean) => {
  if (slideList.value) {
    parentHeight.value = slideList.value.offsetHeight
  }
  nextTick(() => {
    const sliderVideo = document.getElementById('sliderVideo') as HTMLElement | null
    if (sliderVideo !== null) {
      slideList.value.style['transition-duration'] = animation ? '250ms' : '0ms'
      slideList.value.style.transform = `translate3d(0px, -${sliderVideo.parentElement?.offsetTop}px, 0px)`
    }
    setTimeout(() => {
      canHandleSwitch.value = true
    }, 100)
  })
}

const resizeEventHandler = () => {
  adjustHeight(false)
}

onMounted(() => {
  resizeEventHandler()
  window.addEventListener('resize', resizeEventHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventHandler)
})

const itemList = ref<TourCollection[]>([])
itemList.value.push(exampleTourCollection)
itemList.value.push(exampleTourCollection2)

const startX = ref(0)
const startY = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  // e.preventDefault() // 阻止点击事件
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  // e.preventDefault() // 阻止点击事件
  let moveX = e.touches[0].clientX
  let moveY = e.touches[0].clientY
  if (startY.value - moveY <= -100) {
    // 下滑
    handlePlayPrev()
  } else if (startY.value - moveY >= 100) {
    // 上滑
    handlePlayNext()
  }
}
</script>

<template>
  <!--  <div id="recommend-out-switch-btn">-->
  <!--    <div class="xgplayer-playswitch-tab">-->
  <!--      <div class="xgplayer-playswitch-prev" @click="handlePlayPrev">-->
  <!--        <a-image :preview-visible="false" src="/recommend/prev.svg"></a-image>-->
  <!--      </div>-->
  <!--      <div class="xgplayer-playswitch-next" @click="handlePlayNext">-->
  <!--        <a-image :preview-visible="false" src="/recommend/next.svg"></a-image>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <div id="slide-list" class="show-border" @wheel.passive="handleWheel">
    <div class="outer-container">
      <div ref="slideList" class="slide-list-container">
        <div
          v-for="(item, idx) in itemList"
          :key="idx"
          :style="{
            height: `${parentHeight}px`
          }"
          class="page-recommend-container border-1"
          @touchmove="handleTouchMove"
          @touchstart="handleTouchStart"
        >
          <div :id="idx === currentPlayIndex ? 'sliderVideo' : undefined" class="feed-video">
            <div class="playerContainer">
              <div class="slider-video">
                <div
                  class="basePlayerContainer"
                  :style="{
                    backgroundImage: `url(${item.coverUrl})`
                  }"
                >
                  <div class="video-info-container">
                    <div class="video-info-container-inner">
                      <div :id="idx === currentPlayIndex ? 'video-info-wrap' : undefined">
                        <div class="video-info-detail">
                          <a-row class="item-name">
                            <a-tag>{{ item.name }}</a-tag>
                          </a-row>
                          <a-row class="account">
                            <div class="account-name">
                              <span>{{ itemList[idx].user.nickname }}</span>
                            </div>
                            <div class="video-create-time">
                              <span>· {{ getTimeDiffUntilNow(itemList[idx].createTime) }}</span>
                            </div>
                          </a-row>
                          <div class="title">
                            <div class="title-container">
                              <div class="title-inner-container">
                                <div class="title-content">
                                  <span>{{ itemList[idx].title }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="video-action-holder">
                    <div class="video-action-outer-container">
                      <div class="video-action-inner-container">
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div class="video-action-avatar">
                              <a>
                                <a-avatar :image-url="item.user.avatar" :size="40"></a-avatar>
                              </a>
                            </div>
                            <template #content>
                              查看主页
                              <a-tag
                                :size="'small'"
                                style="margin: 5px; padding: 5px; border-radius: 5px"
                                >V
                              </a-tag>
                            </template>
                          </a-tooltip>
                        </div>
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div class="video-action-others">
                              <div class="video-action-icon">
                                <a-image
                                  :height="45"
                                  :preview-visible="false"
                                  :src="
                                    isLiked
                                      ? '/interaction/video_detail_liked.svg'
                                      : '/interaction/video_detail_like.svg'
                                  "
                                  :width="45"
                                ></a-image>
                              </div>
                              <div class="video-action-statistic">{{ videoLikeShowNum }}</div>
                            </div>
                            <template #content>
                              {{ isLiked ? '取消点赞' : '点赞' }}
                              <a-tag
                                :size="'small'"
                                style="margin: 5px; padding: 5px; border-radius: 5px"
                                >Z
                              </a-tag>
                            </template>
                          </a-tooltip>
                        </div>
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div class="video-action-others">
                              <div class="video-action-icon">
                                <a-image
                                  :height="45"
                                  :preview-visible="false"
                                  :src="
                                    isStarred ? '/interaction/starred.svg' : '/interaction/star.svg'
                                  "
                                  :width="45"
                                ></a-image>
                              </div>
                              <div class="video-action-statistic">{{ videoStarShowNum }}</div>
                            </div>
                            <template #content>
                              {{ isStarred ? '取消收藏' : '收藏' }}
                              <a-tag
                                :size="'small'"
                                style="margin: 5px; padding: 5px; border-radius: 5px"
                                >X
                              </a-tag>
                            </template>
                          </a-tooltip>
                        </div>
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div class="video-action-others">
                              <div class="video-action-icon">
                                <a-image
                                  :height="45"
                                  :preview-visible="false"
                                  :width="45"
                                  src="/interaction/comment.svg"
                                ></a-image>
                              </div>
                              <div class="video-action-statistic">
                                {{ 1 }}
                              </div>
                            </div>
                            <template #content>
                              评论
                              <a-tag
                                :size="'small'"
                                style="margin: 5px; padding: 5px; border-radius: 5px"
                                >C
                              </a-tag>
                            </template>
                          </a-tooltip>
                        </div>
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div class="video-action-others">
                              <div class="video-action-icon">
                                <a-image
                                  :height="45"
                                  :preview-visible="false"
                                  :width="45"
                                  src="/interaction/more.svg"
                                ></a-image>
                              </div>
                            </div>
                            <template #content>
                              更多
                              <a-tag
                                :size="'small'"
                                style="margin: 5px; padding: 5px; border-radius: 5px"
                                >C
                              </a-tag>
                            </template>
                          </a-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a-spin
          v-if="loadingVideo"
          :loading="loadingVideo"
          class="load-more"
          dot
          style="margin: auto"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DiscoverView'
}
</script>

<style lang="less" scoped></style>
