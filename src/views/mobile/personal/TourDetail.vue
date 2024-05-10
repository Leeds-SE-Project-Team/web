<template>
    <section id="tour-detail">
        <van-tabs style="background-color: transparent;">
            <van-tab title="Completed">
                <div v-if="!finishTourLoad">
                    <van-skeleton>
                        <template #template>
                            <div :style="{ display: 'flex', width: '100%' }">
                            <van-skeleton-image style="background:#b9b9b9;" />
                            <div :style="{ flex: 1, marginLeft: '16px' }">
                                <van-skeleton-paragraph row-width="60%" style="background:#b9b9b9;"/>
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                            </div>
                            </div>
                        </template>
                    </van-skeleton>
                </div>
                <van-list>
                    <van-swipe-cell
                        v-for="item in completeTours"
                        :key="item.id"
                    >
                        <div
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
                        <template #right>
                            <van-button
                                square text="Download"
                                type="primary"
                                style="height: 100%;"
                                @click="downGPX(item.id)"
                            />
                        </template>
                    </van-swipe-cell>
                    <van-empty v-if="completeTours.length===0" description="Empty" />
                </van-list>
            </van-tab>
            <van-tab title="Planned">
                <div v-if="!finishTourLoad">
                    <van-skeleton>
                        <template #template>
                            <div :style="{ display: 'flex', width: '100%' }">
                            <van-skeleton-image style="background:#b9b9b9;" />
                            <div :style="{ flex: 1, marginLeft: '16px' }">
                                <van-skeleton-paragraph row-width="60%" style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                            </div>
                            </div>
                        </template>
                    </van-skeleton>
                </div>
                <van-swipe-cell
                    v-for="item in plannedTours"
                    :key="item.id"
                >
                    <div
                        class="completed-tour flex-r"
                        @click="toRecord(item.id)"
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
                    <template #right>
                        <van-button
                            square text="Download"
                            type="primary"
                            style="height: 100%;"
                            @click="downGPX(item.id)"
                        />
                    </template>
                </van-swipe-cell>
                
                <van-empty v-if="plannedTours.length===0" description="Empty" />
            </van-tab>
            <van-tab title="Star">
                <div v-if="!finishTourLoad">
                    <van-skeleton>
                        <template #template>
                            <div :style="{ display: 'flex', width: '100%' }">
                            <van-skeleton-image style="background:#b9b9b9;" />
                            <div :style="{ flex: 1, marginLeft: '16px' }">
                                <van-skeleton-paragraph row-width="60%" style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                                <van-skeleton-paragraph style="background:#b9b9b9;" />
                            </div>
                            </div>
                        </template>
                    </van-skeleton>
                </div>
                <van-swipe-cell
                    v-for="item in starTours"
                    :key="item.id"
                >
                <div
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
                <template #right>
                        <van-button
                            square text="Download"
                            type="primary"
                            style="height: 100%;"
                            @click="downGPX(item.id)"
                        />
                    </template>
                </van-swipe-cell>
                <van-empty v-if="starTours.length===0" description="Empty" />
            </van-tab>
        </van-tabs>
    </section>
</template>

<script setup lang="ts">
import { getTourById, getTourByUser, type TourRecord } from '@/apis/tour';
import { useUserStore } from '@/stores';
import { Message } from '@arco-design/web-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const completeTours = ref<TourRecord[]>([]);
const plannedTours = ref<TourRecord[]>([]);
const starTours = ref<TourRecord[]>([]);
const router = useRouter();
const userStore = useUserStore();
const userTours = userStore.curUser?.tours
console.log(userStore.curUser)

const toTour = (id: number)=>{
    router.push({path: '/tour', query:{id}});
}
const toRecord = (id: number)=>{
    router.push({name:'record', params:{'tourId':id}})
}
const finishTourLoad = ref(false)

getTourByUser().then(res=>{
    if(res.success){
        // console.log(res);
        res.data!.forEach(item=>{
            if(item.state==2){
                completeTours.value.push(item);
            }else{
                plannedTours.value.push(item);
            }
        })
        finishTourLoad.value = true
    }else{
        Message.error(res.message)
    }
})

userStore.curUser?.tourStars.forEach(id=>{
    getTourById(id).then(res=>{
        if(res.success){
            console.log(id,res)
            starTours.value.push(res.data!)
        }
        else{
            Message.error(res.message)
        }
    })
})

const downGPX = (id:number)=>{
    const link = document.createElement('a')
    link.href = `${import.meta.env.APP_STATIC_URL}/tour/${id}/map.gpx`
    link.download = `${id}.gpx`
    link.click()
}
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
:deep(.van-icon-completed-o:before){
    font-size: 25px;
}
</style>