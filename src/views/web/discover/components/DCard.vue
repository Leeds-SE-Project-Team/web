<template>
  <div>
    <a-card class="d-card" style="background: rgba(255, 255, 255, 0.8)">
      <template #title>
        <div class="title-wrapper">
          <div v-if="!isMinimal && !isTour" class="greeting-more">
            <h4>Interesting in your region</h4>
            <span>...</span>
          </div>
          <div v-if="!isMinimal && !isTour" class="user-wrapper">
            <div class="avatar-wrapper">
              <a-avatar>
                <img :src="props.tourData.user.avatar" alt="avatar" />
              </a-avatar>
            </div>
            <div class="info-wrapper">
              <span>
                <a-link href="#" style="margin: 0; padding: 0; background-color: transparent">
                  {{ props.tourData.user.nickname }}
                </a-link>
                goes there
              </span>
              <span style="color: rgba(102, 102, 102, 1) !important">{{ props.tourData.createTime }}</span>
            </div>
            <!-- <div class="button-wrapper">
              <a-button type="primary">Follow</a-button>
            </div> -->
          </div>
          <h3 style="padding: 0 15px;" v-if="!isTour" class="title" @click="emits('jump')">
            {{ props.tourData.title }}
          </h3>
          <div class="picture-map">
            <div ref="picWrapper" class="picture-wrapper">
              <a-image-preview-group>
                <div
                  class="left"
                  :style="{ width: props.tourData.tourHighlightList.length >= 2 ? '60%' : '100%' }"
                >
                  <a-image
                    :height="'100%'"
                    :src="props.tourData.tourHighlightList[0]?.tourImages[0].imageUrl"
                    :width="'100%'"
                    fit="cover"
                  />
                </div>
                <div class="right" v-if="props.tourData.tourHighlightList.length >= 2">
                  <div
                    class="up right-item"
                    :style="{height: props.tourData.tourHighlightList.length===2 ?
                      '100%' : '50%'}"
                  >
                    <a-image
                      :height="'100%'"
                      :src="props.tourData.tourHighlightList[1].tourImages[0].imageUrl"
                      :width="'100%'"
                      fit="cover"
                    />
                  </div>
                  <div class="down right-item" v-if="props.tourData.tourHighlightList.length >= 3">
                    <a-image
                      :height="'100%'"
                      :src="props.tourData.tourHighlightList[2].tourImages[0].imageUrl"
                      :width="'100%'"
                      fit="cover"
                    />
                  </div>
                </div>
              </a-image-preview-group>
            </div>
            <div ref="mapWrapper" class="map-wrapper hide">
              <a-image :width="'100%'" height="100%" :src="props.tourData.mapUrl" alt=""/>
            </div>
            <div v-if="hasHighlight" class="switch">
              <button class="switch-button" @click="switchClick">
                <div class="small-img">
                  <img :src="smallImg" alt="" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </template>

      <div v-if="!isTour" class="item-actions">
        <a-list :bordered="false" class="item-actions-left">
          <a-list-item class="like-action" @click="handleInteract(props.tourData,'like')">
            <span class="like-icon">
              <IconHeartFill v-if="isLikeTour(props.tourData).value" />
              <IconHeart v-else />
            </span>
            <span>{{ 1 }}</span>
          </a-list-item>
          <a-list-item class="star-action" @click="handleInteract(props.tourData,'star')">
            <span class="star-icon">
              <IconStarFill v-if="isStarTour(props.tourData).value" />
              <IconStar v-else />
            </span>
            <span>{{ 1 }}</span>
          </a-list-item>
          <!-- <a-list-item v-if="!isMinimal" style="cursor: pointer" @click="commentClick">
            <icon-message />
            <span>{{ comments.length > 0 ? comments.length : 'view' }}</span>
          </a-list-item> -->
        </a-list>
        <div v-if="!isMinimal" class="item-actions-right">
          <a-tag
            v-if="props.tourData.status === TourStatus.AWAIT_APPROVAL"
            :color="'arcoblue'"
            :size="'small'"
            bordered
            class="detail-video-tag"
            style="background: transparent"
            >审核中
          </a-tag>
          <a-tag
            v-else-if="props.tourData.status === TourStatus.OFFLINE"
            :color="'red'"
            :size="'small'"
            bordered
            class="detail-video-tag"
            style="background: transparent"
            >未过审
          </a-tag>

          <!-- <a-button :type="'text'" class="delete-video">
            <template #icon>
              <icon-delete />
            </template>
            <span>删除</span>
          </a-button> -->
          <div class="publish-time">
            <span>发布时间：</span>
            <span>{{ props.tourData.createTime }}</span>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CommentCard from '@/views/web/discover/components/CommentCard.vue'
import useLoading from '@/hooks/loading'
import { type CommentRecord, getCommentsByTourId } from '@/apis/comment'
import { Message } from '@arco-design/web-vue'
import { type TourRecord, TourStatus } from '@/apis/tour'
import tour from '@/views/tour/index.vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores'
import { interactWithContent, type ContentInteractForm } from '@/apis/user'
import { computed } from 'vue'

const props = defineProps<{
  tourData: TourRecord
  mode?: 'minimal' | 'tour'
}>()
console.log(props.tourData)
const emits = defineEmits(['jump'])

// const commentArea = ref<HTMLDivElement | undefined>()
const mapWrapper = ref<HTMLDivElement | undefined>()
const picWrapper = ref<HTMLDivElement | undefined>()
// const textA = ref('')

const smallImg = ref(props.tourData.mapUrl)
// const commentList = props.tourData.comments

const switchStatus = ref<'map' | 'pic'>('map')

const comments = ref<CommentRecord[]>([])
const fetchCommentLoading = useLoading()
const fetchComments = () => {
  fetchCommentLoading.setLoading(true)
  getCommentsByTourId(props.tourData.id).then((apiRes) => {
    if (apiRes.success) {
      comments.value = apiRes.data!
    } else {
      Message.info(apiRes.message)
    }
  })
}

const commentClick = () => {
  showCommentList.value = !showCommentList.value
  if (showCommentList.value) {
    fetchComments()
  }
  // commentShow.value = !commentShow.value
  // if (!commentArea.value) {
  //   return
  // }
  //
  //
  // if (commentShow.value) {
  //   commentArea.value.classList.remove('hide')
  // } else {
  //   commentArea.value.classList.add('hide')
  // }
}

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
      smallImg.value = props.tourData.tourHighlightList[0]?.tourImages[0].imageUrl
      break

    case 'pic':
      switchStatus.value = 'map'
      if (picWrapper.value) {
        picWrapper.value.classList.remove('hide')
      }
      if (mapWrapper.value) {
        mapWrapper.value.classList.add('hide')
      }
      smallImg.value = props.tourData.mapUrl
      break
  }
}

const newCommentContent = ref<string>('')

// const commitComment = () => {
//   const temp: CommentRecord = {
//     author: 'aiiiieee',
//     dateTime: 'now',
//     content: textA.value,
//     avatar: props.tourData.user.avatar
//   }
//   commentList.unshift(temp)
//   textA.value = ''
// }

const showCommentList = ref(false)
const isMinimal = ref(false)
const isTour = ref(false)
const hasHighlight = ref(true)
const isLikeTour = (tour: TourRecord) =>
  computed(() => userStore.curUser?.tourLikes.includes(tour.id))
const isStarTour = (tour: TourRecord) =>
  computed(() => userStore.curUser?.tourStars.includes(tour.id))

if (props.mode === 'minimal') {
  isMinimal.value = true
  switchStatus.value = 'map'
  // switchClick()
} else if (props.mode === 'tour') {
  isTour.value = true
  switchStatus.value = 'map'
  // switchClick()
}
const userStore = useUserStore()
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

onMounted(() => {
  if(props.tourData.tourHighlightList.length<=0){
    switchClick()
    hasHighlight.value = false
  }
})
</script>

<style scoped>
.d-card :deep(.arco-card-header) {
  height: auto;
}

.split {
  height: 1rem;
}
</style>
