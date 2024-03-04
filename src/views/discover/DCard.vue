<template>
  <div>
    <a-card id="d-card">
      <template #title>
        <div class="title-wrapper">
          <div class="greeting-more">
            <h4>Intersting in your region</h4>
            <span>...</span>
          </div>
          <div class="user-wrapper">
            <div class="avatar-wrapper">
              <a-avatar>
                <img :src="props.info.user.avatar" alt="avatar" />
              </a-avatar>
            </div>
            <div class="info-wrapper">
              <span
                ><a href="#">{{ props.info.user.nickname }}</a> goes there</span
              >
              <span>n days ago</span>
            </div>
            <div class="button-wrapper">
              <a-button>Follow</a-button>
            </div>
          </div>
          <h3 class="title">
            {{ props.info.title }}
          </h3>
          <div class="picture-map">
            <div ref="picWrapper" class="picture-wrapper">
              <a-image-preview-group>
                <div class="left">
                  <a-image
                    :height="'100%'"
                    :src="props.info.pictures[0]"
                    :width="'100%'"
                    fit="cover"
                  />
                </div>
                <div class="right">
                  <div class="up right-item">
                    <a-image
                      :height="'100%'"
                      :src="props.info.pictures[1]"
                      :width="'100%'"
                      fit="cover"
                    />
                  </div>
                  <div class="down right-item">
                    <a-image
                      :height="'100%'"
                      :src="props.info.pictures[2]"
                      :width="'100%'"
                      fit="cover"
                    />
                  </div>
                </div>
              </a-image-preview-group>
            </div>
            <div ref="mapWrapper" class="map-wrapper hide">
              <img :src="props.info.map" alt="" />
            </div>
            <div class="switch">
              <button class="switch-button" @click="switchClick" >
                <div class="small-img">
                  <img :src="smallImg" alt="" />
                </div>
              </button>
            </div>
          </div>
          <div class="operation">
            <div class="buttons-wrapper">
              <div class="like">
                <a-button class="action-button" type="text">
                  <template #icon>
                    <icon-heart :size="20" />
                  </template>
                  {{ props.info.like }}
                </a-button>
              </div>
              <div class="comment">
                <a-button class="action-button" type="text" @click="commentClick">
                  <template #icon>
                    <icon-message :size="20" />
                  </template>
                  {{ props.info.comment }}
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!--      commentContainer-->
      <div class="commentContainer" v-if="showCommentList">
        <div class="detail-comment-divider">
          <span class="comment-title">全部评论</span>
          <a-divider />
        </div>

        <div class="new-comment">
          <a-row :wrap="false">
            <a-avatar style="cursor: default">
              <img
                alt="avatar"
                src="http://walcraft.wmzspace.space/static/user/default/avatar/b082833e5c59a309880eca3d525e7cae.gif"
              />
            </a-avatar>

            <a-input
              placeholder="留下你的精彩评论吧"
              class="comment-input"
              v-model:model-value.trim="newCommentContent"
              :max-length="400"
            >
              <template #suffix>
                <a-tooltip>
                  <template #content> 没有可以@的朋友 </template>
                  <img class="icon-at" src="/interaction/comment_at.svg" alt="at_friend" />
                </a-tooltip>
                <a-tooltip>
                  <template #content>发布评论</template>
                  <img
                    class="icon-send"
                    src="/interaction/send_comment.svg"
                    v-if="newCommentContent.length > 0"
                    alt="send_comment"
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
      <!--                                :src="props.info.user.avatar"-->
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
import type { cardInfo, commentInfo } from './type'
import CommentCard from '@/views/discover/CommentCard.vue'
import useLoading from '@/hooks/loading'
import { type CommentRecord, getCommentsByTourId } from '@/apis/comment'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{
  info: cardInfo
}>()

const commentArea = ref<HTMLDivElement | undefined>()
const mapWrapper = ref<HTMLDivElement | undefined>()
const picWrapper = ref<HTMLDivElement | undefined>()
const textA = ref('')

const smallImg = ref(props.info.map)
const commentList = props.info.commentList

const switchStatus = ref<'map' | 'pic'>('map')

const comments = ref<CommentRecord[]>([])
const fetchCommentLoading = useLoading()
const fetchComments = () => {
  fetchCommentLoading.setLoading(true)
  getCommentsByTourId(props.info.id).then((apiRes) => {
    if (apiRes.success) {
      comments.value = apiRes.data!
    } else {
      Message.info(apiRes.message)
    }
  })
}

const commentClick = () => {
  showCommentList.value = true
  fetchComments()
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
      smallImg.value = props.info.pictures[0]
      break

    case 'pic':
      switchStatus.value = 'map'
      if (picWrapper.value) {
        picWrapper.value.classList.remove('hide')
      }
      if (mapWrapper.value) {
        mapWrapper.value.classList.add('hide')
      }
      smallImg.value = props.info.map
      break
  }
}

const newCommentContent = ref<string>('')

const commitComment = () => {
  const temp: commentInfo = {
    author: 'aiiiieee',
    dateTime: 'now',
    content: textA.value,
    avatar: props.info.user.avatar
  }
  commentList.unshift(temp)
  textA.value = ''
}

const showCommentList = ref(false)

onMounted(() => {})
</script>

<style scoped>
#d-card :deep(.arco-card-header) {
  height: auto;
}
</style>
