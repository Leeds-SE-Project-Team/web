<template>
    <div id="manage-group" @click="handleClick">
        <div><icon-send /></div>
    </div>

    <a-modal class="manage-model" v-model:visible="visible" title="Manage Group" @cancel="handleCancel"
        @before-ok="handleBeforeOk" :ok-text="'submit group'" :cancel-text="'cancle'"
        :width="340"
        >
        <h4>
            The group you created
        </h4>
        <a-space wrap>
            <a-tag 
                @close="console.log('close')" 
                v-for="(each, index) of allData?.groupCollections" 
                :key="each.id" 
                :color="colors[index]"
                closable
                size="large"
                >
                {{ each.name }}
            </a-tag>
        </a-space>
        <a-divider />
        <h4>Create group</h4>

        <a-form :model="form" ref="formRef" auto-label-width>

            <a-form-item field="name" label="Name" :rules="[{ required: true, message: 'name is required' }]"
                :validate-trigger="['change', 'input']">
                <a-input v-model="form.name" />
            </a-form-item>

            <a-form-item field="title" label="Title" :rules="[{ required: true, message: 'title is required' }]"
                :validate-trigger="['change', 'input']">
                <a-input v-model="form.title" />
            </a-form-item>

            <a-form-item field="description" label="des"
                :rules="[{ required: true, message: 'description is required' }]" :validate-trigger="['change', 'input']">
                <a-textarea v-model="form.description" />
            </a-form-item>

        </a-form>
    </a-modal>


    <!-- this is the group collection page  -->
    <div id="mobile-group-collection-page" class="group-page">
        <!-- the section of bg -->
        <section class="bg">
            <div class="bg-img">
                <img :src="allData?.coverUrl" alt="">
            </div>
            <div class="title">
                <h3>SPOTLIGHT</h3>
                <h2>{{ allData?.name }}, happy tour</h2>
            </div>
            <div class="bg-overlay"></div>
        </section>

        <!-- the section of profile and detail -->
        <section class="detail">
            <div class="profile">
                <a-avatar class="leader" trigger-type="mask" :size="44">
                    <img alt="avatar" :src="leader?.avatar" />
                </a-avatar>

                <div class="group-name">
                    {{ allData?.name }}
                </div>

                <a-space class="others" :size="38">
                    <a-avatar-group :max-count="2">
                        <a-avatar :size="38" trigger-type="mask" v-for="user in others" :key="user.id">
                            <img alt="avatar" :src="user.avatar" />
                        </a-avatar>
                    </a-avatar-group>
                </a-space>
            </div>

            <div class="des">
                {{ allData?.description }}
            </div>
        </section>

        <!-- the section of every tour -->
        <section v-for="(groupCollection, index1) in allData?.groupCollections" :key="groupCollection.id" class="every-tour">
            <div class="small-bar"></div>
            <div class="every-tour-title">{{ groupCollection.name }}</div>
            <!-- the tour content -->
            <div class="tour-content">
                <div class="content-img">
                    <img
                        :src="groupCollection.tours[picNum[index1]]?.mapUrl"
                        alt=""
                        @click="redirectToRoute(groupCollection.tours[picNum[index1]]?.id)"
                        >
                </div>
                <div class="content-side">
                    <div class="side-name">THE TOUR WE GET</div>
                    <div class="cover">
                        <div class="side-all" :style="{ marginTop: `${20 - 35 * picNum[index1]}%` }">
                            <div v-for="(each, index2) in groupCollection.tours" :key="each.id"
                                @click="changeHeight(index1, index2)" class="everyone">
                                <div class="img-everyone">
                                    <img :src="each.user.avatar" alt="">
                                </div>
                                <p>{{ each.user.nickname }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div style="height:400px; width:100%;margin-bottom: 1rem; padding-bottom: 1rem;position: relative;">
            <div class="controler" style="position: absolute; width: 100%; height: 100%; z-index: 2; overflow: auto">
                <div class="buttons flex-r" style="width: 100%;" >
                    <a-button 
                        type="primary"
                        @click="fixedToAll"
                    >ALL</a-button>
                    <a-button
                        v-for="(item,index) in mapRoute"
                        :key="index"
                        type="primary"
                        @click="fixedToTour(index)"
                    >
                        {{ item[0]+':'+item[2] }}
                    </a-button>
                </div>
            </div>
            <el-amap :scroll-wheel="false" ref="routeMap">
                <el-amap-control-geolocation
                :circleOptions="{
                    fillOpacity: 0,
                    strokeOpacity: 0
                }"
                />
            </el-amap>
        </div>
        
    </div>
</template>

<script lang="ts">
export default {
    name: 'groupCollection'
}
</script>

<script lang="ts" setup>
import { getCollectionById } from '@/apis/collection';
import { getAllGroups, getGroupById, type GroupRecord } from '@/apis/group';
import { createGroupCollection, type CreateGroupCollectionForm } from '@/apis/groupCollection';
import type { UserRecord } from '@/apis/user';
import router from '@/router';
import { useMapStore } from '@/stores';
import Message from '@arco-design/web-vue/es/message';
import { number } from 'echarts';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
// define all the varibles
const allData = ref<GroupRecord>()

const groupId = useRoute().params.id as string

const picNum = ref<number[]>([0, 0, 0, 0])
const allImgNum = ref<number[]>()
const leader = ref<UserRecord>()
const others = computed(() => allData.value?.members.filter((x) => x.id !== allData.value?.leaderId))

const redirectToRoute = (id: string|number) => {
  router.push(`/tour?id=${id}`);
}

// color
const colors = [
    'red',
    'orangered',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray'
];

const getGroup = async () => {
    await getGroupById(groupId)
        .then((res) => {
            if (res.success) {
                allData.value = res.data
                console.log(allData.value)
                picNum.value = allData.value?.groupCollections.map(() => 0) as number[]
                allImgNum.value = allData.value?.groupCollections.map((x: any) => x.tours.length)
                leader.value = allData.value?.members.find((x) => x.id === allData.value?.leaderId)
            }
            else {
                console.log(res.message)
            }
        })
}

const jsonToPath = (data:any):Array<[number,number]>=> {
  const res: Array<[number,number]> = [];
  data.trackList.forEach((item:any)=>{
    res.push(item.location)
  })
  return res;
}
const routeMap = ref()
const mapRoute = ref<any[]>([])
const tourData = ref<any[]>([])

const fixedToAll = ()=>{
  const overlays:any[] = [];
  mapRoute.value.forEach(item=>{
    overlays.push(...item[1]);
  })
  if(routeMap.value){
    (routeMap.value as any).$$getInstance().clearMap();
    tourData.value.forEach(item=>{
        useMapStore().drawRoute(
            (routeMap.value as any).$$getInstance(),
            jsonToPath(item),
            item.type,{},false,true
        )
    });
    (routeMap.value as any).$$getInstance().setFitView(overlays);
  }
}

const fixedToTour = (index: number)=>{
  if(routeMap.value){
    (routeMap.value as any).$$getInstance().clearMap();
    useMapStore().drawRoute(
        (routeMap.value as any).$$getInstance(),
        jsonToPath(tourData.value[index]),
        0,{},false,true
    );
    (routeMap.value as any).$$getInstance().setFitView(mapRoute.value[index][1]);
  }
}

onMounted(async () => {
    await getGroupById(groupId)
        .then((res) => {
            if (res.success) {
                allData.value = res.data
                console.log(allData.value)
                picNum.value = allData.value?.groupCollections.map(() => 0) as number[]
                allImgNum.value = allData.value?.groupCollections.map((x: any) => x.tours.length)
                leader.value = allData.value?.members.find((x) => x.id === allData.value?.leaderId)
            }
            else {
                console.log(res.message)
            }
        })
    allData.value?.groupCollections.forEach(item=>{
        item.tours.forEach(tour=>{
            fetch(tour.completeUrl).then(res=>{
                return res.json()
            }).then(dj=>{
                tourData.value.push(dj)
                const layers = useMapStore().drawRoute(
                    (routeMap.value as any).$$getInstance(),
                    jsonToPath(dj),
                    tour.type,{},false,true
                )
                mapRoute.value.push([tour.user.nickname, layers, tour.title])
            })
        })
        fixedToAll()
    })
})

function changeHeight(index1: any, index2: any) {
    if (!picNum.value) return

    picNum.value[index1] = index2

    const imgs = document.querySelectorAll(".img-everyone")
    const everyimgs = document.querySelectorAll(".everyone")

    let count = 0
    for (let i = 0; i < picNum.value.length; i++) {
        if (!allImgNum.value) continue
        for (let j = 0; j < allImgNum.value[i]; j++) {
            if (i !== index1) {
                count++
                continue
            }
            if (index1 === i && index2 === j) {
                (imgs[count] as HTMLElement).style.padding = "4px";
                (everyimgs[count] as HTMLElement).style.opacity = "1";
            } else {
                (imgs[count] as HTMLElement).style.padding = "10px";
                (everyimgs[count] as HTMLElement).style.opacity = "0.7";
            }
            count++
        }
    }

}




// manage group ------------------------>
const visible = ref(false);

const formRef = ref();

const form = ref<CreateGroupCollectionForm>({
    groupId: groupId,
    name: '',
    title: '',
    coverUrl: '',
    description: ''
});

const handleClick = () => {
    visible.value = true;
};

const handleBeforeOk = () => {
    if (!formRef.value)
        return

    formRef.value.validate()
    .then((err: any) => {
        if (!err) {
            handleSubmit();
            getGroup()
        } else {
            // failed
            Message.warning("You need complete the form")
        }
    })
    console.log(form.value)
};

const handleSubmit = async () => {
    await createGroupCollection(form.value)
        .then((res) => {
            if (res.success) {
                Message.success(res.message)
                
            } else {
                Message.error(res.message)
            }
        })
        .catch((err) => {
            Message.error(err.message)
        })
}

const handleCancel = () => {
    visible.value = false;
}

</script>
