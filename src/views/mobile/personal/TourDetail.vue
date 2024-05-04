<template>
    <section id="tour-detail">
        <van-tabs style="background-color: transparent;">
            <van-tab title="Completed">
                <van-list>
                    <div
                        v-for="item in completeTours"
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
                    <van-empty v-if="completeTours.length===0" description="Empty" />
                </van-list>
            </van-tab>
            <van-tab title="Planned">
                <div
                    v-for="item in plannedTours"
                    :key="item.id"
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
                <van-empty v-if="plannedTours.length===0" description="Empty" />
            </van-tab>
            <van-tab title="Star">
                <div
                    v-for="item in starTours"
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

const toTour = (id: number)=>{
    router.push({path: '/tour', query:{id}});
}
const toRecord = (id: number)=>{
    router.push({name:'record', params:{'tourId':id}})
}

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