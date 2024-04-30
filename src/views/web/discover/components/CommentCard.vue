<script lang="ts" setup>
// import { useUserStore } from '@/store/user'
import { nextTick, onMounted, ref } from 'vue'
// import {
//   deleteComment,
//   getCommentLikeUsersByCommentId,
//   getCommentsByVideoIdOrParent,
//   likeCommentOrNot,
//   postComment
// } from '@/utils/comment'
import { getTimeDiffUntilNow } from '@/utils'
import { type CommentRecord } from '@/apis/comment'
import useLoading from '@/hooks/loading'

const emit = defineEmits(['refresh', 'change', 'delete'])

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

const deleteCommentLoadObj = useLoading()
const handleEmitDelete = () => {
  deleteCommentLoadObj.setLoading(true)
  emit('delete', props.comment.id)
}

//  TODO: auto focus on comment after post
// const focusCommentId = ref<number | undefined>(undefined)
// watch(focusCommentId, (value) => {
//   if (value !== undefined) {
//   } else {
//   }
// })

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
    :datetime="getTimeDiffUntilNow(props.comment.publishTime)"
    align="left"
    class="comment-item"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #author>
      <span style="cursor: pointer">
        {{ props.comment.author.nickname }}
      </span>
    </template>
    <template #avatar>
      <a-avatar
        :image-url="props.comment.author.avatar"
        :size="32"
        @load="
          () => {
            // isLoadingUser = false
          }
        "
      ></a-avatar>
    </template>
    <template #content>
      <div
        :class="{ 'show-all': commentContentShowAll }"
        class="comment-content-text-container"
        @click="commentContentShowAll = true"
      >
        {{ props.comment.content }}
      </div>
    </template>

    <template #actions>
      <span v-if="!isReplying" class="action" @click="openReply"> <IconMessage /> 回复 </span>
      <span v-else class="action" @click="isReplying = false"> <IconMessage /> 回复中 </span>
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
      <span class="action">
        <span v-if="!deleteCommentLoadObj.loading.value" @click="handleEmitDelete">
          <IconDelete /> 删除
        </span>
        <span v-else> <IconLoading /> 删除中 </span>
      </span>
    </template>

    <!--    New comment input-->
    <a-comment
      v-if="isReplying"
      align="right"
      avatar="https://file.wmzspace.space/user/default/avatar/avatar.jpg"
      class="reply-comment"
    >
      <template #content>
        <a-input
          id="reply-comment-input"
          v-model.trim="replyCommentContent"
          :max-length="400"
          :placeholder="`回复 @${props.comment.author.nickname}`"
          class="comment-input"
          @focusin="isReplying = true"
          @focusout="isReplying = false"
        >
          <!--          @pressEnter="onPostReplyComment"-->
          <template #suffix>
            <a-tooltip>
              <template #content> 没有可以@的朋友</template>
              <img alt="at friend" class="icon-at" src="/interaction/comment_at.svg" />
            </a-tooltip>
            <a-tooltip>
              <template #content>回复评论</template>
              <img
                v-if="replyCommentContent.length > 0"
                alt="reply comment"
                class="icon-send"
                src="/interaction/send_comment.svg"
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
      v-for="(comment, index) in props.comment.replies"
      v-else
      :key="index"
      :comment="comment"
      :index="index"
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
