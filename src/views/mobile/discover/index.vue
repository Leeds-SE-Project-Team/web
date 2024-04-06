<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { getTimeDiffUntilNow } from '@/utils'
import useLoading from '@/hooks/loading'
import { Message } from '@arco-design/web-vue'
import { getTourCollection, type TourCollection } from '@/apis/collection'
import { useUserStore } from '@/stores/user'
import { getTours, type TourRecord } from '@/apis/tour'
import likeSvgUrl from '/interaction/video_detail_like.svg'
import likedSvgUrl from '/interaction/video_detail_liked.svg'
import starSvgUrl from '/interaction/star.svg'
import starredSvgUrl from '/interaction/starred.svg'
import { getTourImageExample } from '@/apis/tour/spot'
import { shuffle } from 'lodash-es'

const currentPlayIndex = ref(0)

const loadingObject = useLoading()
const loadingItem = loadingObject.loading

const handlePlayPrev = () => {
  if (!canHandleSwitch.value) {
    return
  }
  if (currentPlayIndex.value > 0) {
    canHandleSwitch.value = false
    currentPlayIndex.value -= 1
    // createPlay(itemList.value[currentPlayIndex.value])
    // refreshItemLikeAndStar()
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
    (loadingItem.value && currentPlayIndex.value >= itemList.value.length - 1)
  ) {
    return
  }

  canHandleSwitch.value = false
  if (currentPlayIndex.value < itemList.value.length - 1) {
    currentPlayIndex.value += 1
    // createPlay(itemList.value[currentPlayIndex.value])
    // refreshItemLikeAndStar()
  } else {
    Message.loading({
      id: 'loadMore',
      content: '加载中...'
    })
    nextAfterLoad.value = true
    // getMoreItems(3, false).then(() => {
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
      if (!loadingItem.value || currentPlayIndex.value < itemList.value.length - 1) {
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

const currentItem = computed(() => itemList.value[currentPlayIndex.value])
const isLiked = ref(false)
const isStarred = ref(false)

const itemLikeShowNum = ref(0)
const itemStarShowNum = ref(0)

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
    const sliderItem = document.getElementById('sliderVideo') as HTMLElement | null
    if (sliderItem !== null) {
      slideList.value.style['transition-duration'] = animation ? '250ms' : '0ms'
      slideList.value.style.transform = `translate3d(0px, -${sliderItem.parentElement?.offsetTop}px, 0px)`
    }
    setTimeout(() => {
      canHandleSwitch.value = true
    }, 100)
  })
}

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
      collectionList.value = apiRes.data!
    })
    .catch((e) => {
      Message.error(e)
    })
    .finally(() => {
      getCollectionLoading.setLoading(false)
    })
}

interface DisPlayItem {
  type: 'collection' | 'tour'
  item: TourCollection | TourRecord
}

const tourList = ref<TourRecord[]>([])
const collectionList = ref<TourCollection[]>([])
const itemList = computed<DisPlayItem[]>(
  () =>
    [
      ...tourList.value.map((tour) => ({
        item: tour,
        type: 'tour'
      })),
      ...collectionList.value.map((collection) => ({
        item: collection,
        type: 'collection'
      }))
    ] as DisPlayItem[]
)

// itemList.value.push(exampleTourCollection)
// itemList.value.push(exampleTourCollection2)

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

// const onOffsetChange = (offset) => {
//   showToast(`x: ${offset.x.toFixed(0)}, y: ${offset.y.toFixed(0)}`)
// }
// const loading = ref(false)
// const onRefresh = () => {
//   loading.value = false
//   if (currentPlayIndex.value > 0) {
//     loading.value = true
//     setTimeout(() => {
//       showToast('刷新成功')
//       loading.value = false
//     }, 1000)
//   }
// }
const resizeEventHandler = () => {
  adjustHeight(false)
}

onMounted(() => {
  resizeEventHandler()
  window.addEventListener('resize', resizeEventHandler)
  fetchTourList()
  fetchCollection()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventHandler)
})
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
  <van-floating-bubble
    :offset="{
      x: 315,
      y: 70
    }"
    axis="xy"
    magnetic="x"
  >
    <template #default>
      <van-icon :size="23" name="guide-o" />
    </template>
  </van-floating-bubble>
  <div id="slide-list" @wheel.passive="handleWheel">
    <div class="outer-container">
      <div ref="slideList" class="slide-list-container">
        <div
          v-for="(item, idx) in shuffle(itemList)"
          :key="idx"
          :style="{
            height: `${parentHeight}px`
          }"
          class="page-recommend-container border-1"
          @click="$router.push({ name: item.type, query: { id: item.item.id } })"
          @touchmove="handleTouchMove"
          @touchstart="handleTouchStart"
        >
          <div :id="idx === currentPlayIndex ? 'sliderVideo' : undefined" class="feed-video">
            <div class="playerContainer">
              <div class="slider-video">
                <div
                  :style="{
                    backgroundImage: `url(${
                      item.type === 'collection'
                        ? (item.item as unknown as TourCollection).coverUrl
                        : (() => {
                            const highlightList = (item.item as unknown as TourRecord)
                              .tourHighlightList
                            if (highlightList.length > 0) {
                              return highlightList[0].tourImages[0].imageUrl
                            } else {
                              // TODO: 改为截图
                              return getTourImageExample(1).imageUrl
                            }
                          })()
                    })`
                  }"
                  class="basePlayerContainer"
                >
                  <div class="video-info-container">
                    <div class="video-info-container-inner">
                      <div :id="idx === currentPlayIndex ? 'video-info-wrap' : undefined">
                        <div class="video-info-detail">
                          <a-row class="item-name">
                            <a-tag
                              >{{
                                item.type === 'collection'
                                  ? (item.item as unknown as TourCollection).name
                                  : (item.item as unknown as TourRecord).type + ' Tour'
                              }}
                            </a-tag>
                          </a-row>
                          <a-row class="account">
                            <div class="account-name">
                              <span>{{
                                itemList[idx].type === 'collection'
                                  ? (itemList[idx].item as unknown as TourCollection).user.nickname
                                  : (itemList[idx].item as unknown as TourRecord).user.nickname
                              }}</span>
                            </div>
                            <div class="video-create-time">
                              <span
                                >·
                                {{
                                  getTimeDiffUntilNow(
                                    itemList[idx].type === 'collection'
                                      ? (itemList[idx].item as unknown as TourCollection).createTime
                                      : (itemList[idx].item as unknown as TourRecord).createTime
                                  )
                                }}</span
                              >
                            </div>
                          </a-row>
                          <div class="title">
                            <div class="title-container">
                              <div class="title-inner-container">
                                <div class="title-content">
                                  <span>{{
                                    itemList[idx].type === 'collection'
                                      ? (itemList[idx].item as unknown as TourCollection).title
                                      : (itemList[idx].item as unknown as TourRecord).title
                                  }}</span>
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
                                <a-avatar
                                  :image-url="
                                    item.type === 'collection'
                                      ? (item.item as unknown as TourCollection).user.avatar
                                      : (item.item as unknown as TourRecord).user.avatar
                                  "
                                  :size="40"
                                ></a-avatar>
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
                                <img
                                  :height="45"
                                  :src="isLiked ? likedSvgUrl : likeSvgUrl"
                                  :width="45"
                                  alt="like"
                                />
                              </div>
                              <div class="video-action-statistic">{{ itemLikeShowNum }}</div>
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
                                <img
                                  :height="45"
                                  :src="isStarred ? starredSvgUrl : starSvgUrl"
                                  :width="45"
                                  alt="star"
                                />
                              </div>
                              <div class="video-action-statistic">{{ itemStarShowNum }}</div>
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
                                <img
                                  :height="45"
                                  :width="45"
                                  alt="comment"
                                  src="/interaction/comment.svg"
                                />
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
                                <img
                                  :height="45"
                                  :width="45"
                                  alt="more"
                                  src="/interaction/more.svg"
                                />
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

                <div
                  :style="{
                    backgroundImage: `url(${
                      item.type === 'collection'
                        ? (item.item as unknown as TourCollection).coverUrl
                        : (() => {
                            const highlightList = (item.item as unknown as TourRecord)
                              .tourHighlightList
                            if (highlightList.length > 0) {
                              return highlightList[0].tourImages[0].imageUrl
                            } else {
                              // TODO: 改为截图
                              return getTourImageExample(1).imageUrl
                            }
                          })()
                    })`
                  }"
                  class="blurImageContainer"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <a-spin
          v-if="loadingItem"
          :loading="loadingItem"
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
