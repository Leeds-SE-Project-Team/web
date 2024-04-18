<template>
    <section id="tour-detail">
        <van-tabs style="background-color: transparent;">
            <van-tab title="Completed">
                <van-list>
                    <div
                        v-for="item in tours"
                        :key="item.id"
                        class="completed-tour flex-r"
                        @click="toTour(item.id)"
                    >
                        <van-image width="100" height="100" :src="item.mapUrl"/>
                        <div class="tour-info flex-c flex-justify-c">
                            <div class="info-title">
                                {{ item.title }}
                            </div>
                            <div class="info-time flex-r">
                                <van-icon name="completed-o" />
                                <span style="margin-left: 0.25rem;">{{ item.createTime }}</span>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-tab>
            <van-tab title="Planned">内容 2</van-tab>
        </van-tabs>
    </section>
</template>

<script setup lang="ts">
import { getTourByUser, type TourRecord } from '@/apis/tour';
import { Message } from '@arco-design/web-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const tours = ref<TourRecord[]>([])
const router = useRouter();

const toTour = (id: number)=>{
    router.push({path: '/tour', query:{id}})
}

getTourByUser().then(res=>{
    if(res.success){
        console.log(res);
        tours.value = res.data!
    }else{
        Message.error(res.message)
    }
})
</script>

<style scoped>
:deep(.van-tabs__line){
    background: green;
}
:deep(.van-tabs__nav){
    background: transparent;
}
:deep(.van-tabs__content){
    height: calc(100vh - 44px - 88px);
    overflow: auto;
}
</style>