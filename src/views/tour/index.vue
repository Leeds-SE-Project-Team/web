<template>
  <div class="tour-main">
    <!-- the section of bg and title in tour page -->
    <section class="tour-title">
      <!-- the bg part -->
      <div v-if="tourRecord" class="bg flex-r">
        <div class="main-bg" :style="{width: showTow?'61.5%':'100%'}" >
          <img :src="coverImg" alt="" />
        </div>
        <div v-if="showTow" class="sub">
          <div class="sub-bg" :style="{height: showThree?'50%':'100%'}">
            <img
              alt=""
              :src="tourRecord.tourHighlightList[1]?.tourImages[0].imageUrl"
            />
          </div>
          <div v-if="showThree" class="sub-bg">
            <img
              alt=""
              :src="tourRecord.tourHighlightList[2]?.tourImages[0].imageUrl"
            />
          </div>
        </div>
      </div>

      <!-- the title part -->
      <div class="title">
        <h1 class="main-title">{{ tourRecord?.title }}</h1>
        <div class="main-info">
          <span class="category">{{
            tourRecord?.type !== undefined ? TourType[tourRecord?.type].toLowerCase() : ''
          }}</span>
          <span class="time">{{ tourRecord ? tourRecord.createTime : '' }}</span>
          <div style="margin: 10px 0">
            <span class="distance">18.4 km</span>
            <span class="speed">2.6 km/h</span>
            <span class="calorie">2.6 calories</span>
          </div>
        </div>
        <h3 class="des">
          Expert Hiking Tour. Very good fitness required. Sure-footedness, sturdy shoes and alpine
          experience required.
        </h3>
      </div>
    </section>

    <!-- the section of TOUR OVERVIEW -->
    <section class="overview">
      <div class="subtitle">TOUR OVERVIEW</div>
      <a-divider />
      <a-timeline class="timeline" labelPosition="same">
        <section class="map" style="margin-bottom: 1rem">
          <div class="subtitle">MAP</div>
          <div v-if="tourRecord" class="map-img">
            <img :src="tourRecord.mapUrl" alt="" />
          </div>
        </section>

        <a-timeline-item class="pic-map" lineType="dashed">
          <h4>Start</h4>
        </a-timeline-item>

        <a-timeline-item
          v-for="(highlight, idx) in tourRecord?.tourHighlightList"
          :key="idx"
          :label="`Tour Highlight ${idx + 1}: ${highlight.title ? highlight.title : idx + 1 + 'th highlight'}`"
          class="pic-map"
          lineType="dashed"
        >
          <DHighlight :data="highlight" @click="redirectToRoute(highlight.id)"></DHighlight>
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
      <a-avatar :imageUrl="tourRecord?.user.avatar" :size="50"></a-avatar>
      <div class="rigion">
        <h3>{{ tourRecord?.user.nickname }}</h3>
        <p>{{ tourRecord?.user.latestLoginTime }}</p>
      </div>
    </a-space>

    <div class="like">
      <div>
        <a-button class="button-icon" @click="tourRecord && handleInteract(tourRecord, 'like')">
          <template #icon>
            <div class="icon">
              <img
                :height="30"
                :src="tourRecord && isLikeTour(tourRecord).value ? likedSvgUrl : likeSvgUrl"
                :width="45"
                alt="like"
              />
              <span>{{ tourRecord?.likedBy.length }}</span>
            </div>
          </template>
        </a-button>

        <a-button class="button-icon" @click="tourRecord && handleInteract(tourRecord, 'star')">
          <template #icon>
            <div class="icon">
              <img
                :height="30"
                :src="tourRecord && isStarTour(tourRecord).value ? starredSvgUrl : starSvgUrl"
                :width="45"
                alt="like"
              />
              <span>{{ tourRecord?.starredBy.length }}</span>
            </div>
          </template>
        </a-button>

        <a-button
          class="primary-btn-dark"
          @click="router.push({ name: 'record', params: { tourId: tourId } })"
        >
          <van-icon :size="23" name="guide-o" style="display: flex"
            ><span class="btn-text" style="font-size: 16px; align-self: center"
              >Navigate</span
            ></van-icon
          >
        </a-button>

        <a-button
          class="primary-btn-dark"
          style="margin-left: 20px;"
          @click="downGPX(tourRecord?.id)">
          download
        </a-button>
      </div>

      <!-- <div class="follower">
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
      </div> -->
    </div>

    <div class="subtitle comment-title">COMMENTS</div>

    <div class="comment-container">
      <div class="new-comment">
        <a-row :wrap="false">
          <a-avatar style="cursor: default">
            <img :src="userStore.getUserAvatar" alt="avatar" />
          </a-avatar>

          <a-input
            v-model:model-value.trim="newCommentContent"
            :max-length="400"
            class="comment-input"
            placeholder="留下你的精彩评论吧"
            @pressEnter="onPostNewComment"
          >
            <template #suffix>
              <a-tooltip>
                <template #content> 没有可以@的朋友</template>
                <img alt="at_friend" class="icon-at" src="/interaction/comment_at.svg" />
              </a-tooltip>
              <a-tooltip>
                <template #content>发布评论</template>
                <img
                  v-if="newCommentContent.length > 0"
                  alt="send_comment"
                  class="icon-send"
                  src="/interaction/send_comment.svg"
                  @click="onPostNewComment"
                />
              </a-tooltip>
            </template>
          </a-input>
        </a-row>
      </div>

      <CommentCard
        v-for="(comment, idx) in tourRecord?.comments"
        :key="tourRecord?.comments[idx].id"
        :comment="comment"
        :depth="1"
        :index="idx"
        :style="tourRecord"
        :tour="tourRecord"
        @delete="handleDeleteComment"
      />
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
import { postLike, postStar, deleteLike, deleteStar } from '@/apis/tour'
import { useUserStore } from '@/stores'
import { Message } from '@arco-design/web-vue'
import { TourType } from '@/apis/tour'
import CommentCard from '@/views/web/discover/components/CommentCard.vue'
import { deleteComment, postComment } from '@/apis/comment'
import { showToast } from 'vant'
import useLoading from '@/hooks/loading'
import likeSvgUrl from '/interaction/video_detail_like.svg'
import likedSvgUrl from '/interaction/video_detail_liked.svg'
import starSvgUrl from '/interaction/star.svg'
import starredSvgUrl from '/interaction/starred.svg'
import { type ContentInteractForm, interactWithContent } from '@/apis/user'

const route = useRoute()
const router = useRouter()
const tourRecord = ref<TourRecord>()

const redirectToRoute = (id: string|number) => {
  router.push(`/highlight/${id}`);
}

const coverImg = computed(() => {
  if (!tourRecord.value) {
    return ''
  } else if (!tourRecord.value.tourHighlightList[0]) {
    return tourRecord.value.mapUrl
  }
  return tourRecord.value.tourHighlightList[0].tourImages[0]?.imageUrl;
})

const showTow = computed(()=>{
  if(tourRecord.value && tourRecord.value.tourHighlightList.length>=2){
    return true;
  }
  return false
})

const showThree = computed(()=>{
  if(tourRecord.value && tourRecord.value.tourHighlightList.length>=3){
    return true;
  }
  return false
})

const downGPX = (id:number|undefined)=>{
    const link = document.createElement('a')
    if(!id) {
      return
    }
    link.href = `${import.meta.env.APP_STATIC_URL}/tour/${id}/map.gpx`
    link.download = `${id}.gpx`
    link.click()
}

const userStore = useUserStore()
const curUser = computed(() => userStore.curUser)
const is_like = ref(false)
const is_star = ref(false)

const tourId = route.query.id as string

onMounted(() => {
  getTour()
})

// this logic to like and star
const like_btn = () => {
  console.log('click like')
  if (is_like.value) {
    delLike(tourId)
  } else {
    like(tourId)
  }
}
const star_btn = () => {
  console.log('click star')
  if (is_star.value) {
    delStar(tourId)
  } else {
    star(tourId)
  }
}
const like = (tourId: string) => {
  postLike(tourId).then((res) => {
    if (!res.success) {
      Message.warning(res.message)
    }
    getTour()
  })
}
const delLike = (tourId: string) => {
  deleteLike(tourId).then((res) => {
    if (!res.success) {
      Message.warning(res.message)
    }
    getTour()
  })
}
const star = (tourId: string) => {
  postStar(tourId).then((res) => {
    if (!res.success) {
      Message.warning(res.message)
    }
    getTour()
  })
}

const delStar = (tourId: string) => {
  deleteStar(tourId).then((res) => {
    if (!res.success) {
      Message.warning(res.message)
    }
    getTour()
  })
}

// function to refresh data
const getTour = async () => {
  await getTourById(route.query.id as string).then((res) => {
    if (res.success) {
      tourRecord.value = res.data
      console.log(tourRecord.value)
      if (tourRecord.value?.likedBy.includes(curUser.value?.id as number)) {
        is_like.value = true
      } else {
        is_like.value = false
      }
      if (tourRecord.value?.starredBy.includes(curUser.value?.id as number)) {
        is_star.value = true
      } else {
        is_star.value = false
      }
    }
  })
}

const newCommentContent = ref('')
const sendCommentLoadObj = useLoading()
const onPostNewComment = () => {
  if (newCommentContent.value.length <= 0 || !tourRecord.value) {
    // Message.info('评论内容异常')
    return
  }

  if (sendCommentLoadObj.loading.value) {
    // 调用太频繁
    return
  }

  const tour = tourRecord.value as TourRecord
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
}

const handleDeleteComment = (commentId: number) => {
  if (!tourRecord.value) {
    return
  }

  deleteComment(commentId).then((apiRes) => {
    if (apiRes.success) {
      if (tourRecord.value === undefined) {
        return
      }
      Message.success(apiRes.message)
      tourRecord.value.comments = tourRecord.value.comments.filter((c) => c.id !== commentId)
    } else {
      Message.error(apiRes.message)
    }
  })
}

const currentUser = computed(() => userStore.curUser)

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
      .then((apiRes: any) => {
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
</script>

<style></style>
