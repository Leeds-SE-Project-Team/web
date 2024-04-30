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
import { type CommentRecord, deleteComment, postComment } from '@/apis/comment'
import useLoading from '@/hooks/loading'
import { interactWithContent } from '@/apis/user'
import { showToast } from 'vant'
import { useAuthStore, useUserStore } from '@/stores'
import type { TourRecord } from '@/apis/tour'

const emit = defineEmits(['refresh', 'change', 'delete'])

const props = defineProps<{
  comment: CommentRecord
  index: any
  depth: number
  tour?: TourRecord
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
const userStore = useUserStore()
const isLiked = ref(false)
// const isLiked = computed(
//   () => userStore.curUser && props.comment.likedBy.map((u) => u.id).includes(userStore.curUser?.id)
// )

const replyCommentLoadObj = useLoading()
const handleReplyComment = () => {
  if (!props.tour) {
    return
  }

  if (replyCommentLoadObj.loading.value) {
    showToast('Too frequent operations')
    return
  }
  replyCommentLoadObj.setLoading(true)
  postComment({
    content: replyCommentContent.value,
    tourId: props.tour.id,
    parentId: props.comment.id
  })
    .then((apiRes) => {
      if (apiRes.success) {
        // tour.comments.push(apiRes.data!)
        const newComment = apiRes.data!
        const commentList = props.comment
        const tour = props.tour!
        commentList.replies.unshift(newComment)
        tour.comments.unshift(newComment)
        replyCommentContent.value = ''
        isReplying.value = false
        showToast(apiRes.message)
      }
    })
    .finally(() => {
      replyCommentLoadObj.setLoading(false)
    })
}

const interactCommentLoadObj = useLoading()
const handleInteractComment = () => {
  if (interactCommentLoadObj.loading.value) {
    showToast('Too frequent operations')
    return
  }
  interactCommentLoadObj.setLoading(true)

  isLiked.value = !isLiked.value
  commentLikeShowNum.value += isLiked.value ? 1 : -1
  // if (isLiked.value) {
  // props.comment.likedBy = props.comment.likedBy.filter((c) => c.id !== user.id)
  // }

  interactWithContent({
    interaction: 'like',
    contentId: props.comment.id,
    contentType: 'comments',
    value: isLiked.value
  })
    .then((apiRes) => {
      if (apiRes.success) {
        showToast({
          message: apiRes.message
        })
      } else {
        showToast({
          type: 'fail',
          message: apiRes.message
        })
      }
    })
    .finally(() => {
      interactCommentLoadObj.setLoading(false)
    })
}

const handleDeleteComment = (commentId: number) => {
  deleteComment(commentId).then((apiRes) => {
    if (apiRes.success) {
      showToast({
        message: apiRes.message
      })
      const commentList = props.comment
      commentList.replies = commentList.replies.filter((r) => r.id !== commentId)
      // currentTourComments.value = currentTourComments.value.filter((c) => c.id !== commentId)
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
  <a-comment
    v-show="!isDeleted"
    :datetime="getTimeDiffUntilNow(props.comment.publishTime)"
    align="left"
    class="comment-item"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #author>
      <span style="cursor: pointer; font-weight: bold">
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
        class="comment-content-text-container van-multi-ellipsis--l3"
        @click="commentContentShowAll = true"
      >
        {{ props.comment.content }}
      </div>
    </template>

    <template #actions>
      <span v-if="!isReplying" class="action" @click="openReply"> <IconMessage /> 回复 </span>
      <span v-else class="action" @click="isReplying = false"> <IconMessage /> 回复中 </span>
      <span class="action" @click="handleInteractComment">
        <span :class="{ active: isLiked }" class="like-icon"
          ><IconHeartFill v-if="isLiked" /><IconHeart v-else
        /></span>
        <span>{{ commentLikeShowNum }}</span>
      </span>
      <!--        v-if="-->
      <!--          userStore.isAdmin ||-->
      <!--          (userStore.getCurrentUser &&-->
      <!--            (props.comment.author.id === userStore.getCurrentUser.id ||-->
      <!--              props.video?.authorId === userStore.getCurrentUser.id))-->
      <!--        "-->
      <span
        v-if="useAuthStore().isAdmin || userStore.curUser?.id === props.comment.author.id"
        class="action"
      >
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
          style="margin-bottom: 20px; border-radius: 10px; border: thin solid rgba(0, 0, 0, 0.3)"
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
                @click="handleReplyComment"
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
      :key="comment.id"
      :comment="comment"
      :depth="props.depth + 1"
      :index="index"
      :tour="props.tour"
      @change="
        () => {
          emit('change')
        }
      "
      @delete="handleDeleteComment"
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
