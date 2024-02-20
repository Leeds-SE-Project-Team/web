<template>
    <div>
        <a-card id="d-article" hoverable style="width: 100%;">
            <template #cover>
                <div class="cover-wrapper">
                    <div class="cover-info">
                        <div class="info-user">
                            <a-avatar id="user-avatar">
                                <img 
                                    :src="props.info.userAvatar"
                                    alt="avatar"
                                >
                            </a-avatar>
                            <div class="user">
                                <p class="user-name">
                                    {{ props.info.username }}
                                </p>
                                <p class="user-follow">
                                    {{ props.info.userFollow }} Follower
                                </p>
                            </div>
                            <a-button id="follow-button" type="primary">Follow</a-button>
                        </div>
                        <div class="info-content">
                            <div class="classify">
                                <p>
                                    {{ props.info.collection }}
                                </p>
                            </div>
                            <div class="title">
                                <h3>
                                    {{ props.info.title }}
                                </h3>
                            </div>
                            <div class="specify">
                                <p>
                                    {{ props.info.specify }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <a class="cover-jump" href="#"></a>
                    <div :style="bgUrl" class="cover-bg"></div>
                </div>
            </template>
            <div class="article-content">
                <div class="introduction">
                    <p>
                        {{ props.info.introduction }}
                        <a href="#">
                            read more
                        </a>
                    </p>
                </div>
            </div>
            <a-divider class="divider"/>
            <div class="article-action">
                <a-button class="action-button" type="text">
                    <template #icon>
                        <icon-heart :size="20"/>
                    </template>
                    {{ props.info.like }}
                </a-button>
                <a-button class="action-button" type="text">
                    <template #icon>
                        <icon-message :size="20"/>
                    </template>
                    {{ props.info.comment }}
                </a-button>
                <a-button class="action-button" type="text">
                    <template #icon>
                        <icon-bookmark :size="20"/>
                    </template>
                    Bookmark
                </a-button>
                <a-button class="action-button" type="text">
                    <template #icon>
                        <icon-share-internal :size="20"/>
                    </template>
                    Share
                </a-button>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { type articleInfo } from './type';

const props = defineProps<{
    info: articleInfo
}>()

const bgUrl = {
    backgroundImage: props.info.backgroundUrl
}
</script>