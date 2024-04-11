<template>
  <div>
    <a-card class="d-article" hoverable style="width: 100%">
      <template #cover>
        <div class="cover-wrapper">
          <div class="cover-info">
            <div class="info-user">
              <a-popover>
                <a-avatar id="user-avatar">
                  <img :src="props.info.user.avatar" alt="avatar" />
                </a-avatar>
                <template #content>
                  <!-- TODO: following and follower -->
                  <DHover
                    :username="props.info.user.nickname"
                    :user-avatar="props.info.user.avatar"
                    :user-follower="$props.info.user.id"
                    :user-following="$props.info.user.id"
                  ></DHover>
                </template>
              </a-popover>
              <a-popover>
                <div class="user">
                  <p class="user-name">
                    {{ props.info.user.nickname }}
                  </p>
                  <p class="user-follow">{{ props.info.user.id }} Follower</p>
                </div>
                <template #content>
                  <DHover
                    :username="props.info.user.nickname"
                    :user-avatar="props.info.user.avatar"
                    :user-follower="$props.info.user.id"
                    :user-following="$props.info.user.id"
                  ></DHover>
                </template>
              </a-popover>

              <a-button id="follow-button" type="primary">Follow</a-button>
            </div>
            <div class="info-content">
              <div class="classify">
                <p>
                  {{ props.info.title }}
                </p>
              </div>
              <div class="title">
                <h3>
                  {{ props.info.title }}
                </h3>
              </div>
              <div class="specify">
                <p>
                  {{ props.info.title }}
                </p>
              </div>
            </div>
          </div>
          <a class="cover-jump" :href="`/collection?id=${props.info.id}`"></a>
          <div :style="{backgroundImage: `url(${props.info.coverUrl})`}" class="cover-bg"></div>
        </div>
      </template>
      <div class="article-content">
        <div class="introduction">
          <p>
            {{ props.info.description }}
            <a href="#"> read more </a>
          </p>
        </div>
      </div>
      <a-divider class="divider" />
      <div class="article-action">
        <a-button class="action-button" type="text">
          <template #icon>
            <icon-heart :size="20" />
          </template>
          {{ props.info.id }}
        </a-button>
        <a-button class="action-button" type="text">
          <template #icon>
            <icon-message :size="20" />
          </template>
          {{ props.info.id }}
        </a-button>
        <a-button class="action-button" type="text">
          <template #icon>
            <icon-bookmark :size="20" />
          </template>
          Bookmark
        </a-button>
        <a-button class="action-button" type="text">
          <template #icon>
            <icon-share-internal :size="20" />
          </template>
          Share
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { type TourCollection } from '@/apis/collection/index'
import DHover from './DHover.vue'
import { computed } from 'vue';

const props = defineProps<{
  info: TourCollection
}>()

console.log(props.info.coverUrl)
const bgUrl = computed(()=>{
  return {backgroundImage: props.info.coverUrl}
})
</script>