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
                        <div class="picture-wrapper">
                            <div class="left">
                                <a-image-preview-group :src-list="props.info.pictures" :default-current="0">
                                    <a-image
                                        :src="props.info.pictures[0]"
                                        fit="cover"
                                        :width="'100%'"
                                        :height="'100%'"
                                    />
                                </a-image-preview-group>
                            </div>
                            <div class="right">
                                <div class="up right-item">
                                    <a-image-preview-group :src-list="imglist" :default-current="1">
                                        <a-image
                                            :src="props.info.pictures[1]"
                                            :width="'100%'"
                                            :height="'100%'"
                                            fit="cover"
                                        />
                                    </a-image-preview-group>
                                </div>
                                <div class="down right-item">
                                    <a-image-preview-group :src-list="imglist" :default-current="2">
                                        <a-image
                                            :src="props.info.pictures[2]"
                                            :width="'100%'"
                                            :height="'100%'"
                                            fit="cover"
                                        />
                                    </a-image-preview-group>
                                </div>
                            </div>
                        </div>
                        <div class="map-wrapper">

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
const textA = ref('')

const imglist = reactive<string[]>([
    '//fp1.fghrsh.net/2021/12/24/b41bf96f8c15b7d39a911a85ace4aeca.png',
    '//fp1.fghrsh.net/2021/12/12/e6d334449c5545a34c25053aa30139b8.png',
    '//fp1.fghrsh.net/2021/05/26/5e5c7dea39a95e42f2389ebf0c3d8279.jpg'
])
const commentList = props.info.commentList;

const commentShow = ref(false)

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