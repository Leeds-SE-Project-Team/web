<template>
    <section id="collection-detail" >
        <van-list>
            <div
                v-for="item in collections"
                :key="item.id"
                class="collection flex-r"
                @click="toCollection(item.id)"
            >
                <van-image width="100" height="100" :src="item.coverUrl"/>
                <div class="collection-info flex-c flex-justify-c">
                    <div class="info-title">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </van-list>
    </section>
</template>

<script setup lang="ts">
import { getCollectionByUser, type TourCollection } from '@/apis/collection';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const collections = ref<TourCollection[]>([])
const router = useRouter();

const toCollection = (id: number)=>{
    router.push({path:'/collecton', query:{id}})
}

getCollectionByUser().then(res=>{
    if(res.success){
        console.log(res);
        collections.value = res.data!
    }
})
</script>