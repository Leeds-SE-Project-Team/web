<template>
  <div>
    <a-card class="d-card" style="background: rgba(255, 255, 255, 0.8)">
      <template #title>
        <div class="title-wrapper">
          <div v-if="!isMinimal && !isTour" class="greeting-more">
            <h4>interesting in your region</h4>
            <span>...</span>
          </div>
          <div v-if="!isMinimal && !isTour" class="user-wrapper">
            <div class="avatar-wrapper">
              <a-avatar>
                <img :src="props.tourData.user.avatar" alt="avatar" />
              </a-avatar>
            </div>
            <div class="info-wrapper">
              <span
                ><a-link href="#" style="margin: 0; padding: 0; background-color: transparent">{{
                  props.tourData.user.nickname
                }}</a-link>
                goes there</span
              >
              <span style="color: rgba(102, 102, 102, 1) !important">n days ago</span>
            </div>
            <div class="button-wrapper">
              <a-button type="primary">Follow</a-button>
            </div>
          </div>
          <div v-if="!isMinimal && !isTour" class="split"></div>
          <h3 v-if="!isTour" class="title" @click="emits('jump')">
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
                  <div class="up right-item">
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
              <img :src="props.tourData.mapUrl" alt="" />
            </div>
            <div class="switch">
              <button class="switch-button" @click="switchClick">
                <div class="small-img">
                  <img :src="smallImg" alt="" />
                </div>
              </button>
            </div>
          </div>
          <!--          <div class="operation">-->
          <!--            <div class="buttons-wrapper">-->
          <!--              <div class="like">-->
          <!--                <a-button class="action-button" type="text">-->
          <!--                  <template #icon>-->
          <!--                    <icon-heart :size="20" />-->
          <!--                  </template>-->
          <!--                  {{ props.tourData.like }}-->
          <!--                </a-button>-->
          <!--              </div>-->
          <!--              <div class="comment">-->
          <!--                <a-button class="action-button" type="text" @click="commentClick">-->
          <!--                  <template #icon>-->
          <!--                    <icon-message :size="20" />-->
          <!--                  </template>-->
          <!--                  {{ props.tourData.comment }}-->
          <!--                </a-button>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </template>

      <div v-if="!isTour" class="item-actions">
        <a-list :bordered="false" class="item-actions-left">
          <a-list-item class="like-action">
            <span class="like-icon">
              <IconHeartFill v-if="false" />
              <IconHeart v-else />
            </span>
            <span>{{ 1 }}</span>
          </a-list-item>
          <a-list-item class="star-action">
            <span class="star-icon">
              <IconStarFill v-if="false" />
              <IconStar v-else />
            </span>
            <span>{{ 1 }}</span>
          </a-list-item>
          <a-list-item v-if="!isMinimal" style="cursor: pointer" @click="commentClick">
            <icon-message />
            <span>{{ comments.length > 0 ? comments.length : 'view' }}</span>
          </a-list-item>
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

          <a-button :type="'text'" class="delete-video">
            <template #icon>
              <icon-delete />
            </template>
            <span>删除</span>
          </a-button>
          <div class="publish-time">
            <span>发布时间：</span>
            <span>{{ props.tourData.createTime }}</span>
          </div>
        </div>
      </div>

      <!--      commentContainer-->
      <div v-if="showCommentList" class="commentContainer">
        <div class="detail-comment-divider">
          <span class="comment-title">全部评论</span>
          <a-divider />
        </div>

        <div class="new-comment">
          <a-row :wrap="false">
            <a-avatar style="cursor: default">
              <img alt="avatar" src="https://file.wmzspace.space/user/default/avatar/avatar.jpg" />
            </a-avatar>

            <a-input
              v-model:model-value.trim="newCommentContent"
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
                    v-if="newCommentContent.length > 0"
                    alt="send_comment"
                    class="icon-send"
                    src="/interaction/send_comment.svg"
                  />
                </a-tooltip>
              </template>
            </a-input>
          </a-row>
        </div>

        <!--        <div class="usually-search">-->
        <!--          大家都在搜：<a class="usually-search-topic"-->
        <!--            ><span class="usually-search-topic-text" :style="{ cursor: 'default' }">{{-->
        <!--              '暂无推荐'-->
        <!--            }}</span>-->
        <!--            <img-->
        <!--              class="usually-search-icon"-->
        <!--              src="/interaction/usually_search.svg"-->
        <!--              alt="usually-search"-->
        <!--            />-->
        <!--          </a>-->
        <!--        </div>-->

        <div class="comments-list">
          <CommentCard
            v-for="(comment, index) in comments"
            :key="index"
            :depth="1"
            :tour="tourData"
            :comment="comment"
            :index="index"
          >
          </CommentCard>
          <p class="comments-list-append">暂时没有更多评论</p>
        </div>
      </div>
      <!--      commentContainer-->

      <!--            <div ref="commentArea" class="comment-area hide">-->
      <!--                <div class="my-comment">-->
      <!--                    <div class="avatar">-->
      <!--                        <a-avatar>-->
      <!--                            <img-->
      <!--                                :src="props.tourData.user.avatar"-->
      <!--                                alt="avatar"-->
      <!--                            >-->
      <!--                        </a-avatar>-->
      <!--                    </div>-->
      <!--                    <div class="form">-->
      <!--                        <a-textarea v-model="textA" placeholder="Please enter something" allow-clear/>-->
      <!--                    </div>-->
      <!--                    <div class="commit">-->
      <!--                        <a-button @click="commitComment">发送</a-button>-->
      <!--                    </div>-->
      <!--                </div>-->
      <!--                <div class="other-comments">-->
      <!--                    <a-comment-->
      <!--                        v-for="(item, index) in commentList"-->
      <!--                        :key="index"-->
      <!--                        :author="item.auther"-->
      <!--                        :content="item.content"-->
      <!--                        :datetime="item.dateTime"-->
      <!--                    >-->
      <!--                        <template #actions>-->
      <!--                        <span class="action" key="heart">-->
      <!--                            <span v-if="true">-->
      <!--                            <IconHeartFill :style="{ color: '#f53f3f' }" />-->
      <!--                            </span>-->
      <!--                            <span v-else>-->
      <!--                            <IconHeart />-->
      <!--                            </span>-->
      <!--                            {{ 83 }}-->
      <!--                        </span>-->
      <!--                        &lt;!&ndash; <span class="action" key="reply">-->
      <!--                            <IconMessage /> Reply-->
      <!--                        </span> &ndash;&gt;-->
      <!--                        </template>-->
      <!--                        <template #avatar>-->
      <!--                        <a-avatar>-->
      <!--                            <img-->
      <!--                            alt="avatar"-->
      <!--                            :src="item.avatar"-->
      <!--                            />-->
      <!--                        </a-avatar>-->
      <!--                        </template>-->
      <!--                    </a-comment>-->
      <!--                </div>-->
      <!--            </div>-->
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

if (props.mode === 'minimal') {
  isMinimal.value = true
  switchStatus.value = 'map'
  // switchClick()
} else if (props.mode === 'tour') {
  isTour.value = true
  switchStatus.value = 'map'
  // switchClick()
}

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
