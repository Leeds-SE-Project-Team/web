<template>
    <div id="layout-a">
        <div id="layout-a-header">
            <AHeader></AHeader>
        </div>
        <div id="page-discover">
            <div class="content-wrapper">
                <!-- 最上方搜索卡片 -->
                <a-card id="search-card" hoverable style="width: 100%;">
                    <!-- 卡片封面 -->
                    <template #cover>
                        <div class="card-cover" style="height: 240px; width: 100%; display: flex;">
                            <div class="cover-shadow">
                                <h2>Discover</h2>
                            </div>
                        </div>
                    </template>
                    <!-- 卡片内容 -->
                    <div class="card-content">
                        <div class="search-wrapper">
                            <div class="search-type">
                                <span class="type-lable">Sport Type</span>
                                <div class="select-wrapper">
                                    <div class="selector">
                                        <a-select
                                            :style="{minWidth:'150px'}"
                                            placeholder="Select"
                                            :trigger-props="{ autoFitPopupMinWidth: true }">
                                            <a-option>Hiking</a-option>
                                            <a-option>Biking</a-option>
                                            <a-option><icon-search />Runing</a-option>
                                        </a-select>
                                    </div>
                                </div>
                            </div>
                            <div class="search-content">
                                <span class="type-lable">Where</span>
                                <div class="input-wrapper">
                                    <div class="inputer">
                                        <a-input
                                            :style="{width:'100%'}" 
                                            placeholder="Please enter something"
                                            allow-clear
                                        >
                                            <template #prefix>
                                                <icon-search />
                                            </template>
                                        </a-input>
                                    </div>
                                </div>
                            </div>
                            <div class="search-button">
                                <div class="button-wrapper">
                                    <a-button type="primary">Primary</a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-card>
                <p style="text-align: center; font-size: 14px; margin-top: 1.5rem;">
                    Not sure where you want to go?
                    <a href="">Browse routes and topics</a>
                </p>
                <!-- 发现内容 -->
                <div id="content-discover">
                    <div class="discover-title">
                        <h3>Get Inspired</h3>
                    </div>
                    <a-divider class="discover-divider"/>
                    <ul class="content-list">
                        <li>
                            <DArticle :info="testInfo"></DArticle>
                        </li>
                        <li>
                            <DArticle :info="testInfo"></DArticle>
                        </li>
                        <li>
                            <DArticle :info="testInfo"></DArticle>
                        </li>
                        <li>
                            <DArticle :info="testInfo"></DArticle>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import AHeader from '@/components/header/AHeader.vue';
import DArticle from '@/views/discover/DArticle.vue';
import type { articleInfo } from './type';

const testInfo: articleInfo = {
    username: '测试用户',
    userFollow: 10000,
    userAvatar: 'https://i1.hdslb.com/bfs/face/fd48028dbb3d3fca850ca47f3dd2a6bcd1fbab8b.jpg \
                    @240w_240h_1c_1s_!web-avatar-space-header.avif',
    backgroundUrl: '//fp1.fghrsh.net/2020/01/12/1e8c4232da6be35942f6ecd630797f60.jpg',
    collection: 'hiking',
    title: '随便写点',
    specify: '12334235',
    introduction: '我不会再退缩 \
                    送给你纯白色的花,塞西莉亚,塞西莉亚,盛开在起风的地方,沐浴九月的骄阳,\
                    偷偷放在你的身上,替我传达,我不敢说的话,在流浪的路上,你是我唯一牵挂,\
                    无尽海上的星光,所以别让我担心啊',
    like: 123345,
    comment: 234234
}

</script>

<script lang="ts">
export default {
    name: 'DiscoverView'
}
</script>

<style scoped>
#search-card :deep(.arco-card-body) {
    padding: 0;
}

.selector :deep(.arco-select-view-single){
    background-color: transparent;
    border: 1px #CCCCCC solid;
    border-radius: 10px;
    height: 40px;
}

.inputer :deep(.arco-input-wrapper .arco-input){
    height: 40px;
}

.inputer :deep(.arco-input-wrapper){
    border-radius: 10px;
}

.button-wrapper :deep(.arco-btn-primary){
    height: 40px;
    border-radius: 10px;
}

#content-discover :deep(.arco-divider-horizontal){
    border-bottom: 1px solid #CCCCCC;
}
</style>