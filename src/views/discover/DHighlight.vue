<template>
  <div>
    <a-card class="d-card" style="background: rgba(255, 255, 255, 0.8)">
      <template #title>
        <div class="title-wrapper">
          <div class="picture-map">
            <div ref="picWrapper" class="picture-wrapper">
              <a-image-preview-group>
                <div
                  class="left"
                  :style="{ width: props.data.tourImages.length >= 2 ? '60%' : '100%' }"
                >
                  <a-image
                    :height="'100%'"
                    :src="props.data.tourImages[0].imageUrl"
                    :width="'100%'"
                    fit="cover"
                  />
                </div>
                <div class="right" v-if="props.data.tourImages.length >= 2">
                  <div class="up right-item">
                    <a-image
                      :height="'100%'"
                      :src="props.data.tourImages[1].imageUrl"
                      :width="'100%'"
                      fit="cover"
                    />
                  </div>
                  <div class="down right-item" v-if="props.data.tourImages.length >= 3">
                    <a-image
                      :height="'100%'"
                      :src="props.data.tourImages[2].imageUrl"
                      :width="'100%'"
                      fit="cover"
                    />
                  </div>
                </div>
              </a-image-preview-group>
            </div>
            <div ref="mapWrapper" class="map-wrapper hide">
              <img :src="highlightMapUrl" alt="" />
            </div>
            <div class="switch">
              <button class="switch-button" @click="switchClick">
                <div class="small-img">
                  <img :src="smallImg" alt="" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import useLoading from '@/hooks/loading'
import { type CommentRecord, getCommentsByTourId } from '@/apis/comment'
import { Message } from '@arco-design/web-vue'
import type { TourHighlight } from '@/apis/tour/highlight'

const props = defineProps<{
  data: TourHighlight
}>()

const highlightMapUrl = 'https://file.wmzspace.space/resource/highlight.png'

// const commentArea = ref<HTMLDivElement | undefined>()
const mapWrapper = ref<HTMLDivElement | undefined>()
const picWrapper = ref<HTMLDivElement | undefined>()
// const textA = ref('')

const smallImg = ref(highlightMapUrl)
// const commentList = props.data.comments

const switchStatus = ref<'map' | 'pic'>('map')

const comments = ref<CommentRecord[]>([])
const fetchCommentLoading = useLoading()
const fetchComments = () => {
  fetchCommentLoading.setLoading(true)
  getCommentsByTourId(props.data.id).then((apiRes) => {
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
      smallImg.value = props.data.tourImages[0].imageUrl
      break

    case 'pic':
      switchStatus.value = 'map'
      if (picWrapper.value) {
        picWrapper.value.classList.remove('hide')
      }
      if (mapWrapper.value) {
        mapWrapper.value.classList.add('hide')
      }
      smallImg.value = highlightMapUrl
      break
  }
}

const newCommentContent = ref<string>('')

// const commitComment = () => {
//   const temp: CommentRecord = {
//     author: 'aiiiieee',
//     dateTime: 'now',
//     content: textA.value,
//     avatar: props.data.user.avatar
//   }
//   commentList.unshift(temp)
//   textA.value = ''
// }

const showCommentList = ref(false)
const isMinimal = ref(false)
const isTour = ref(false)

// if (props.mode === 'minimal') {
//   isMinimal.value = true
//   switchStatus.value = 'map'
//   // switchClick()
// } else if (props.mode === 'tour') {
//   isTour.value = true
//   switchStatus.value = 'map'
//   // switchClick()
// }

onMounted(() => {
  // if (props.mode === 'minimal') {
  //   isMinimal.value = true
  //   switchStatus.value = 'map'
  //   switchClick()
  // } else if (props.mode === 'tour') {
  //   isTour.value = true
  //   switchStatus.value = 'map'
  //   switchClick()
  // }
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
