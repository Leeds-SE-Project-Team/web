<script setup lang="ts">
// import { useUserStore } from '@/store/user'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
// import {
//   deleteComment,
//   getCommentLikeUsersByCommentId,
//   getCommentsByVideoIdOrParent,
//   likeCommentOrNot,
//   postComment
// } from '@/utils/comment'
import { getTimeDiffUntilNow } from '@/utils'
import { Message } from '@arco-design/web-vue'
import type { CommentRecord } from '@/apis/comment'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['refresh', 'change'])

const userStore = useUserStore()
const props = defineProps<{
  comment: CommentRecord
  index: any
}>()

const openReply = () => {
  isReplying.value = true
  nextTick(() => {
    document.getElementById('reply-comment-input')?.getElementsByTagName('input')[0]?.focus()
  })
}
const isReplying = ref(false)
// const author = ref<UserRecord | undefined>(undefined)
// const isLoadingUser = ref(true)
// const isLoadingUser = ref(false)
// const refreshUserInfo = () => {
//   userStore
//     .getUserInfoById(props.comment.authorId)
//     .then((user) => {
//       author.value = user
//     })
//     .catch(() => {
//       emitRefresh(true)
//     })
// }

const isLiked = ref(false)
const commentLikeShowNum = ref(0)

const commentContentShowAll = ref(false)
const replyCommentContent = ref('')

//  TODO: auto focus on comment after post
// const focusCommentId = ref<number | undefined>(undefined)
// watch(focusCommentId, (value) => {
//   if (value !== undefined) {
//   } else {
//   }
// })

const isProcessReplyComment = ref(false)

const processDeleteComment = ref(false)

onMounted(() => {
  // refreshUserInfo()
  // refreshChildrenComments()
})

const emitRefresh = (refreshAll: boolean) => {
  emit('refresh', refreshAll)
}

const isDeleted = ref(false)
</script>

<template>
  <a-comment
    v-show="!isDeleted"
    class="comment-item"
    align="left"
    :datetime="getTimeDiffUntilNow(props.comment.publishTime)"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #author>
      <span style="cursor: pointer">
        {{ props.comment.author.nickname }}
      </span>
    </template>
    <template #avatar>
      <a-avatar
        :size="32"
        :image-url="props.comment.author.avatar"
        @load="
          () => {
            // isLoadingUser = false
          }
        "
      ></a-avatar>
    </template>
    <template #content>
      <div
        class="comment-content-text-container"
        :class="{ 'show-all': commentContentShowAll }"
        @click="commentContentShowAll = true"
      >
        {{ props.comment.content }}
      </div>
    </template>

    <template #actions>
      <span class="action" @click="openReply" v-if="!isReplying"> <IconMessage /> 回复 </span>
      <span class="action" @click="isReplying = false" v-else> <IconMessage /> 回复中 </span>
      <span class="action">
        <span class="like-icon"><IconHeartFill v-if="isLiked" /><IconHeart v-else /></span>
        <span>{{ commentLikeShowNum }}</span>
      </span>
      <!--        v-if="-->
      <!--          userStore.isAdmin ||-->
      <!--          (userStore.getCurrentUser &&-->
      <!--            (props.comment.author.id === userStore.getCurrentUser.id ||-->
      <!--              props.video?.authorId === userStore.getCurrentUser.id))-->
      <!--        "-->
      <span class="action"> <IconDelete /> 删除 </span>
    </template>

    <!--    New comment input-->
    <a-comment
      align="right"
      avatar="http://walcraft.wmzspace.space/static/user/default/avatar/b082833e5c59a309880eca3d525e7cae.gif"
      class="reply-comment"
      v-if="isReplying"
    >
      <template #content>
        <a-input
          :placeholder="`回复 @${props.comment.author.nickname}`"
          class="comment-input"
          id="reply-comment-input"
          v-model.trim="replyCommentContent"
          :max-length="400"
          @focusin="isReplying = true"
          @focusout="isReplying = false"
        >
          <!--          @pressEnter="onPostReplyComment"-->
          <template #suffix>
            <a-tooltip>
              <template #content> 没有可以@的朋友 </template>
              <img class="icon-at" src="/interaction/comment_at.svg" alt="at friend" />
            </a-tooltip>
            <a-tooltip>
              <template #content>回复评论</template>
              <img
                class="icon-send"
                src="/interaction/send_comment.svg"
                v-if="replyCommentContent.length > 0"
                alt="reply comment"
              />
            </a-tooltip>
          </template>
        </a-input>
      </template>
    </a-comment>
    <!--    New comment input-->

    <!--    Children Comment-->
    <!--    <a-spin class="load-more" dot v-if="isLoadingComment" :loading="isLoadingComment" />-->
    <CommentCard
      v-else
      v-for="(comment, index) in props.comment.replies"
      :index="index"
      :comment="comment"
      :key="index"
      @change="
        () => {
          emit('change')
        }
      "
      @refresh="
        (refreshAll) => {
          if (refreshAll) {
            emitRefresh(true)
          } else {
            // refreshChildrenComments()
          }
        }
      "
    />
    <!--    Children Comment-->
  </a-comment>
</template>

<style scoped></style>
