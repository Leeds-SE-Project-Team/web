<template>
    <div class="discover-hover">
        <div class="hover-content">
            <div class="user-avatar">
                <a-avatar :size="60" id="user-avatar">
                    <img 
                        :src="props.userAvatar"
                        alt="avatar"
                    >
                </a-avatar>
            </div>
            <div class="user-name">
                <h3><a href="#">{{ props.username }}</a></h3>
            </div>
            <div class="user-follow">
                <div class="followering">
                    <span>{{ props.userFollower }}</span>
                    <p>Followers</p>
                </div>
                <div class="followering">
                    <span>{{ props.userFollowing }}</span>
                    <p>Following</p>
                </div>
            </div>
            <div class="follow-button">
                <a-button id="f-button" type="primary">Follow</a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type hoverInfo } from '@/views/discover/type';

const props = defineProps<hoverInfo>();
</script>