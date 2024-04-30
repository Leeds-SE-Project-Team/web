<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { getTimeDiffUntilNow } from '@/utils'
import useLoading from '@/hooks/loading'
import { Message } from '@arco-design/web-vue'
import { getTourCollection, type TourCollection } from '@/apis/collection'
import { getTours, type TourRecord, TourStatus } from '@/apis/tour'
import likeSvgUrl from '/interaction/video_detail_like.svg'
import likedSvgUrl from '/interaction/video_detail_liked.svg'
import starSvgUrl from '/interaction/star.svg'
import starredSvgUrl from '/interaction/starred.svg'
import { shuffle } from 'lodash-es'
import { gsap } from 'gsap'
import { type ContentInteractForm, interactWithContent } from '@/apis/user'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import CommentCard from '@/views/web/discover/components/CommentCard.vue'
import commentAtSvg from '/interaction/comment_at.svg'
import sendCommentSvg from '/interaction/send_comment.svg'
import { type CommentRecord, deleteComment, postComment } from '@/apis/comment'

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

// const currentItem = computed(() => itemList.value[currentPlayIndex.value])
// const isLiked = ref(false)
// const isStarred = ref(false)

// const itemLikeShowNum = ref(0)
// const itemStarShowNum = ref(0)

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
      tourList.value = apiRes.data!.filter((t) => t.status === TourStatus.ONLINE)
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
      collectionList.value = apiRes.data!.filter(
        (c) => c.tours.length > 0 && c.name !== 'Default Collection'
      )
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
const itemList = computed<DisPlayItem[]>(() =>
  shuffle([
    ...tourList.value.map((tour) => ({
      item: tour,
      type: 'tour'
    })),
    ...collectionList.value.map((collection) => ({
      item: collection,
      type: 'collection'
    }))
  ] as DisPlayItem[])
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

const showCommentList = ref(false)
const showCommentAnimComplete = ref(true)
const showCommentInput = ref(false)

const handleClickComment = () => {
  showCommentList.value = true
  showCommentInput.value = true
  nextTick(() => {
    showCommentAnimComplete.value &&
      gsap.to('#discover-comment-overlay .comment-wrapper', {
        duration: 0.3,
        // height: 1000,
        yPercent: -60,
        ease: 'power3.out',
        onStart: () => {
          showCommentAnimComplete.value = false
        },
        onComplete: () => {
          showCommentAnimComplete.value = true
        }
      })
  })
}

const handleCloseCommentList = () => {
  showCommentAnimComplete.value &&
    gsap.to('#discover-comment-overlay .comment-wrapper', {
      duration: 0.3,
      yPercent: 60,
      ease: 'power3.out',
      onStart: () => {
        showCommentInput.value = false
        showCommentAnimComplete.value = false
      },
      onComplete: () => {
        showCommentList.value = false
        showCommentAnimComplete.value = true
      }
    })
}

const isLikeTour = (tour: TourRecord) =>
  computed(() => currentUser.value?.tourLikes.includes(tour.id))
const isStarTour = (tour: TourRecord) =>
  computed(() => currentUser.value?.tourStars.includes(tour.id))

const interactLoadObj = useLoading()
const handleInteract = (tour: TourRecord, interaction: 'like' | 'star') => {
  if (interactLoadObj.loading.value) {
    showToast('Too frequent operations')
    return
  }

  userStore.getUserRecord().then((user) => {
    interactLoadObj.setLoading(true)

    const form: ContentInteractForm = {
      contentType: 'tours',
      interaction: interaction,
      value: interaction === 'like' ? !isLikeTour(tour).value : !isStarTour(tour).value,
      contentId: tour.id
    }

    const refreshData = () => {
      if (interaction === 'like') {
        user.tourLikes = form.value
          ? [...new Set([...user.tourLikes, tour.id])]
          : user.tourLikes.filter((tId) => tId !== tour.id)
        tour.likedBy = form.value
          ? [...new Set([...tour.likedBy, user.id])]
          : tour.likedBy.filter((uId) => uId !== user.id)
      } else if (interaction === 'star') {
        user.tourStars = form.value
          ? [...new Set([...user.tourStars, tour.id])]
          : user.tourStars.filter((tId) => tId !== tour.id)
        tour.starredBy = form.value
          ? [...new Set([...tour.starredBy, user.id])]
          : tour.starredBy.filter((uId) => uId !== user.id)
      }
    }

    refreshData()
    interactWithContent<TourRecord>(form)
      .then((apiRes) => {
        if (apiRes.success) {
          refreshData()
          Object.assign(tour, apiRes.data!)
          showToast({
            message: apiRes.message,
            duration: 1000
          })
        } else {
          showToast({
            type: 'fail',
            message: apiRes.message
          })
        }
      })
      .finally(() => {
        interactLoadObj.setLoading(false)
      })
  })
}

const recommendPlace = (item: DisPlayItem) =>
  computed(() => {
    return 1
  })

onMounted(() => {
  // gsap.to('#discover-comment-overlay', { duration: 0.5, yPercent: 40 })
})

const userStore = useUserStore()
const currentUser = computed(() => userStore.curUser)

const currentTourComments = computed({
  get: () => (itemList.value[currentPlayIndex.value].item as TourRecord).comments ?? [],
  set: (value) => {
    const curItem = itemList.value[currentPlayIndex.value]
    if (curItem.type === 'tour') {
      ;(curItem.item as TourRecord).comments = value
    }
  }
})
const newCommentContent = ref('')
const sendCommentLoadObj = useLoading()
const tourCommentNum = computed(() => {
  const countCommentsNum = (comments: CommentRecord[]) => {
    let result = 0
    comments.forEach((comment) => {
      result += 1 + countCommentsNum(comment.replies)
    })

    return result
  }

  return countCommentsNum(currentTourComments.value.filter((c) => c.parentId === null))
})
const onPostNewComment = () => {
  if (newCommentContent.value.length <= 0) {
    // Message.info('评论内容异常')
    return
  }
  const tour = itemList.value[currentPlayIndex.value].item as TourRecord
  sendCommentLoadObj.setLoading(true)
  postComment({
    content: newCommentContent.value,
    tourId: tour.id,
    parentId: undefined
  })
    .then((apiRes) => {
      console.log(tour)
      if (apiRes.success) {
        tour.comments.push(apiRes.data!)
        newCommentContent.value = ''
        showToast(apiRes.message)
      }
    })
    .finally(() => {
      sendCommentLoadObj.setLoading(false)
    })
  // postComment(user.id, newCommentContent.value, video.value.videoId, undefined).then(() => {
  //   newCommentContent.value = ''
  //   refreshRootCommentList()
  // })
}

const handleDeleteComment = (commentId: number) => {
  deleteComment(commentId).then((apiRes) => {
    if (apiRes.success) {
      showToast({
        message: apiRes.message
      })
      currentTourComments.value = currentTourComments.value.filter((c) => c.id !== commentId)
    } else {
      showToast({
        type: 'fail',
        message: apiRes.message
      })
    }
  })
}
</script>

<template>
  <div id="slide-list" @wheel.passive="handleWheel">
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
                  :style="{
                    backgroundImage: `url(${
                      item.type === 'collection'
                        ? (item.item as unknown as TourCollection).coverUrl
                        : (() => {
                            const tour = item.item as unknown as TourRecord
                            const highlightList = tour.tourHighlightList
                            if (highlightList.length > 0) {
                              return highlightList[0].tourImages[0].imageUrl
                            } else {
                              return tour.mapUrl
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
                      <div v-if="item.type === 'tour'" class="video-action-inner-container">
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div class="video-action-avatar">
                              <a>
                                <a-avatar
                                  :image-url="(item.item as unknown as TourRecord).user.avatar"
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
                          <!--                          <a-tooltip :position="'left'">-->
                          <div
                            class="video-action-others"
                            @click="handleInteract(item.item as TourRecord, 'like')"
                          >
                            <div class="video-action-icon">
                              <img
                                :height="45"
                                :src="
                                  isLikeTour(item.item as TourRecord).value
                                    ? likedSvgUrl
                                    : likeSvgUrl
                                "
                                :width="45"
                                alt="like"
                              />
                            </div>
                            <div class="video-action-statistic">
                              {{ (item.item as unknown as TourRecord).likedBy.length }}
                            </div>
                          </div>
                          <!--                            <template #content>-->
                          <!--                              {{ isLiked ? '取消点赞' : '点赞' }}-->
                          <!--                              <a-tag-->
                          <!--                                :size="'small'"-->
                          <!--                                style="margin: 5px; padding: 5px; border-radius: 5px"-->
                          <!--                                >Z-->
                          <!--                              </a-tag>-->
                          <!--                            </template>-->
                          <!--                          </a-tooltip>-->
                        </div>
                        <div class="video-action-item">
                          <!--                          <a-tooltip :position="'left'">-->
                          <div
                            class="video-action-others"
                            @click="handleInteract(item.item as TourRecord, 'star')"
                          >
                            <div class="video-action-icon">
                              <img
                                :height="45"
                                :src="
                                  isStarTour(item.item as TourRecord).value
                                    ? starredSvgUrl
                                    : starSvgUrl
                                "
                                :width="45"
                                alt="star"
                              />
                            </div>
                            <div class="video-action-statistic">
                              {{ (item.item as unknown as TourRecord).starredBy.length }}
                            </div>
                          </div>
                          <!--                            <template #content>-->
                          <!--                              {{ isStarred ? '取消收藏' : '收藏' }}-->
                          <!--                              <a-tag-->
                          <!--                                :size="'small'"-->
                          <!--                                style="margin: 5px; padding: 5px; border-radius: 5px"-->
                          <!--                                >X-->
                          <!--                              </a-tag>-->
                          <!--                            </template>-->
                          <!--                          </a-tooltip>-->
                        </div>
                        <div class="video-action-item">
                          <!--                          <a-tooltip :position="'left'">-->
                          <div class="video-action-others" @click.stop="handleClickComment">
                            <div class="video-action-icon">
                              <img
                                :height="45"
                                :width="45"
                                alt="comment"
                                src="/interaction/comment.svg"
                              />
                            </div>
                            <div class="video-action-statistic">
                              {{ tourCommentNum }}
                            </div>
                          </div>
                          <!--                            <template #content>-->
                          <!--                              评论-->
                          <!--                              <a-tag-->
                          <!--                                :size="'small'"-->
                          <!--                                style="margin: 5px; padding: 5px; border-radius: 5px"-->
                          <!--                                >C-->
                          <!--                              </a-tag>-->
                          <!--                            </template>-->
                          <!--                          </a-tooltip>-->
                        </div>
                        <div class="video-action-item">
                          <a-tooltip :position="'left'">
                            <div
                              class="video-action-others"
                              @click="
                                $router.push({ name: item.type, query: { id: item.item.id } })
                              "
                            >
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
                            const tour = item.item as unknown as TourRecord
                            const highlightList = tour.tourHighlightList
                            if (highlightList.length > 0) {
                              return highlightList[0].tourImages[0].imageUrl
                            } else {
                              return tour.mapUrl
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
  <van-overlay
    v-if="itemList[currentPlayIndex]?.type === 'tour'"
    id="discover-comment-overlay"
    :duration="0"
    :lock-scroll="false"
    :show="showCommentList"
    @click.self="handleCloseCommentList"
  >
    <div class="comment-wrapper">
      <!--            <div class="usually-search">-->
      <!--              大家都在搜：<a class="usually-search-topic"-->
      <!--                ><span-->
      <!--                  :style="{-->
      <!--                    cursor: recommendPlace(item) ? 'pointer' : 'default'-->
      <!--                  }"-->
      <!--                  class="usually-search-topic-text"-->
      <!--                  @click="-->
      <!--                    () => {-->
      <!--                      if (recommendPlace(item)) {-->
      <!--                        // handleSearch(recommendPlace)-->
      <!--                      }-->
      <!--                    }-->
      <!--                  "-->
      <!--                  >{{ recommendPlace(item) ? recommendPlace(item) : '暂无推荐' }}</span-->
      <!--                >-->
      <!--                <img-->
      <!--                  v-if="recommendPlace(item)"-->
      <!--                  alt="usually-search"-->
      <!--                  class="usually-search-icon"-->
      <!--                  src="/interaction/usually_search.svg"-->
      <!--                />-->
      <!--              </a>-->
      <!--            </div>-->
      <div class="comment-header">{{ tourCommentNum }} comments in total</div>
      <CommentCard
        v-for="(comment, idx) in currentTourComments.filter((c) => c.parentId === null)"
        :key="comment.id"
        :comment="comment"
        :depth="1"
        :index="idx"
        :tour="itemList[currentPlayIndex].item as TourRecord"
        @delete="handleDeleteComment"
      />
      <a-empty
        v-if="tourCommentNum === 0"
        style="height: 150px; display: flex; flex-direction: column; justify-content: center"
      >
        Leave a first comment
      </a-empty>
    </div>
    <div v-if="showCommentInput" class="input-wrapper-static">
      <a-row :wrap="false">
        <a-input
          v-model:model-value.trim="newCommentContent"
          :max-length="400"
          class="input-wrapper-static-ele"
          placeholder="Leave your own comment..."
          @pressEnter="onPostNewComment"
        >
          <template #suffix>
            <div v-if="!sendCommentLoadObj.loading.value">
              <a-tooltip>
                <template #content> No friends</template>
                <img :src="commentAtSvg" alt="at_friend" class="icon-at" />
              </a-tooltip>
              <a-tooltip>
                <template #content>Post comment</template>
                <img
                  v-if="newCommentContent.length > 0"
                  :src="sendCommentSvg"
                  alt="send_comment"
                  class="icon-send"
                  @click="onPostNewComment"
                />
              </a-tooltip>
            </div>
            <van-loading v-else />
          </template>
        </a-input>
      </a-row>
    </div>

    <!--    <div class="input-wrapper-static">-->
    <!--      <a-input class="input-wrapper-static-ele" placeholder="Enter your comment..." allow-clear>-->
    <!--        <template #suffix>-->
    <!--          <span class="input-icon"><icon-camera /></span>-->
    <!--          <span class="input-icon"><icon-at /></span>-->
    <!--        </template>-->
    <!--      </a-input>-->
    <!--    </div>-->
  </van-overlay>

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
  <!--  <van-floating-bubble-->
  <!--    :offset="{-->
  <!--      x: 315,-->
  <!--      y: 70-->
  <!--    }"-->
  <!--    axis="xy"-->
  <!--    magnetic="x"-->
  <!--  >-->
  <!--    <template #default>-->
  <!--      <van-icon :size="23" name="guide-o" />-->
  <!--    </template>-->
  <!--  </van-floating-bubble>-->
</template>

<script lang="ts">
export default {
  name: 'DiscoverView'
}
</script>

<style lang="less" scoped></style>
