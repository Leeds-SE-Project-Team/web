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
                                <img 
                                    :src="props.info.user.avatar"
                                    alt="avatar"
                                >
                            </a-avatar>
                        </div>
                        <div class="info-wrapper">
                            <span><a href="#">{{ props.info.user.nickname }}</a> goes there</span>
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
                                        :src="props.info.pictures[0]"
                                        fit="cover"
                                        :width="'100%'"
                                        :height="'100%'"
                                    />
                                </div>
                                <div class="right">
                                    <div class="up right-item">
                                        <a-image
                                            :src="props.info.pictures[1]"
                                            :width="'100%'"
                                            :height="'100%'"
                                            fit="cover"
                                        />
                                    </div>
                                    <div class="down right-item">
                                        <a-image
                                            :src="props.info.pictures[2]"
                                            :width="'100%'"
                                            :height="'100%'"
                                            fit="cover"
                                        />
                                    </div>
                                </div>
                            </a-image-preview-group>
                        </div>
                        <div ref="mapWrapper" class="map-wrapper hide">
                            <img :src="props.info.map" alt="">
                        </div>
                        <div class="switch">
                            <button class="switch-button" @click="switchClick">
                                <div class="small-img">
                                    <img :src="smallImg" alt="">
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
            <div ref="commentArea" class="comment-area hide">
                <div class="my-comment">
                    <div class="avatar">
                        <a-avatar>
                            <img
                                :src="props.info.user.avatar"
                                alt="avatar"
                            >
                        </a-avatar>
                    </div>
                    <div class="form">
                        <a-textarea v-model="textA" placeholder="Please enter something" allow-clear/>
                    </div>
                    <div class="commit">
                        <a-button @click="commitComment">发送</a-button>
                    </div>
                </div>
                <div class="other-comments">
                    <a-comment
                        v-for="(item, index) in commentList"
                        :key="index"
                        :author="item.auther"
                        :content="item.content"
                        :datetime="item.dateTime"
                    >
                        <template #actions>
                        <span class="action" key="heart">
                            <span v-if="true">
                            <IconHeartFill :style="{ color: '#f53f3f' }" />
                            </span>
                            <span v-else>
                            <IconHeart />
                            </span>
                            {{ 83 }}
                        </span>
                        <!-- <span class="action" key="reply">
                            <IconMessage /> Reply
                        </span> -->
                        </template>
                        <template #avatar>
                        <a-avatar>
                            <img
                            alt="avatar"
                            :src="item.avatar"
                            />
                        </a-avatar>
                        </template>
                    </a-comment>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import type { commentInfo, cardInfo } from './type';

const props = defineProps<{
    info: cardInfo
}>()

const commentArea = ref<HTMLDivElement | undefined>()
const mapWrapper = ref<HTMLDivElement | undefined>()
const picWrapper = ref<HTMLDivElement | undefined>()
const textA = ref('')

const smallImg = ref(props.info.map);
const commentList = props.info.commentList;

const commentShow = ref(false)
const swichStatus= ref<'map'|'pic'>('map');

const commentClick = ()=>{
    commentShow.value = !commentShow.value
    if(!commentArea.value){
        return;
    }
    if(commentShow.value){
        commentArea.value.classList.remove('hide');
    }else{
        commentArea.value.classList.add('hide');
    }
}

const switchClick = ()=>{
    switch (swichStatus.value) {
        case 'map':
            swichStatus.value = 'pic'
            if(picWrapper.value){
                picWrapper.value.classList.add('hide')
            }
            if(mapWrapper.value){
                mapWrapper.value.classList.remove('hide')
            }
            smallImg.value = props.info.pictures[0];
            break;
    
        case 'pic':
            swichStatus.value = 'map'
            if(picWrapper.value){
                picWrapper.value.classList.remove('hide')
            }
            if(mapWrapper.value){
                mapWrapper.value.classList.add('hide')
            }
            smallImg.value = props.info.map;
            break;
    }
}

const commitComment = ()=>{
    const temp: commentInfo = {
        auther: 'aiiiieee',
        dateTime: 'now',
        content: textA.value,
        avatar: props.info.user.avatar,
    }
    commentList.unshift(temp);
    textA.value = '';
}

onMounted(()=>{
    
})

</script>

<style scoped>
#d-card :deep(.arco-card-header){
    height: auto;
}
</style>