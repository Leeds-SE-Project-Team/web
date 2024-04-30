<template>
    <!-- this is the group collection page  -->
    <div id="group-collection-page" class="group-page">
        <!-- the section of bg -->
        <section class="bg">
            <div class="bg-img">
                <img :src="bgImg" alt="">
            </div>
            <div class="title">
                <h3>SPOTLIGHT</h3>
                <h2>{{ collectionName }}</h2>
            </div>
            <div class="bg-overlay"></div>
        </section>

        <!-- the section of profile and detail -->
        <section class="detail">
            <div class="profile">
                <a-avatar class="leader" trigger-type="mask" :size="90">
                    <img alt="avatar" :src="userData[0]?.header" />
                </a-avatar>

                <div class="group-name">
                    {{ groupName }}
                </div>

                <a-space class="others" :size="48">
                    <a-avatar-group>
                        <a-avatar :size="48" trigger-type="mask" v-for="user in userData.slice(1)" :key="user.userName">
                            <img alt="avatar" :src="user.header" />
                        </a-avatar>
                    </a-avatar-group>
                </a-space>
            </div>
            <div class="des">
                {{ des }}
            </div>
        </section>

        <!-- the section of every tour -->
        <section v-for="(tour, index1) in groupTour" :key="tour.name" class="every-tour">
            <div class="small-bar"></div>
            <div class="every-tour-title">{{ tour.name }}</div>
            <!-- the tour content -->
            <div class="tour-content">
                <div class="content-img">
                    <img :src="allImgData[index1].content[picNum[index1]].imgUrl" alt="">
                </div>
                <div class="content-side">
                    <div class="side-name">THE TOUR WE GET</div>
                    <div class="cover">
                        <div class="side-all" :style="{ marginTop: `${20 - 35 * picNum[index1]}%` }">
                            <div v-for="(each, index2) in tour.content" :key="each.userName"
                                @click="changeHeight(index1, index2)" class="everyone">
                                <div class="img-everyone">
                                    <img :src="each.header" alt="">
                                </div>
                                <p>{{ each.userName }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
export default {
    name: 'groupCollection'
}
</script>

<script lang="ts" setup>
import { getCollectionById } from '@/apis/collection';
import { getGroupById } from '@/apis/group';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// define all the varibles

// big bg img at first and some des
const collectionName = ref<string>('')
const bgImg = ref<string>('')
const des = ref<string>('')
const groupName = ref<string>('')

// user data
interface userInfo {
    userName: string
    header: string
}
const userData = ref<userInfo[]>([])

// about BGIMAG of every tour
const allImgData = ref<any>({})
const picNum = ref<any>([])
const allImgNum = ref<any>({})

// tour content
const groupTour = ref<any>([])

// onMounted is here

const groupId = useRoute().params.id as string

console.log(groupId)

onMounted(async () => {
    await axios.get("../src/views/web/groupCollection/tours.json")
        .then((res) => {
            // console.log(res.data.data)
            allImgData.value = res.data.data
            allImgNum.value = res.data.data.map((x: any) => x.content.length)
            collectionName.value = res.data.collectionName
            groupTour.value = res.data.data
            des.value = res.data.des
            bgImg.value = res.data.imgUrl
            picNum.value = res.data.data.map(() => 0)
            userData.value = res.data.everyOne
            groupName.value = res.data.groupName
        })
        .catch((error) => {
            console.log(error)
        })
})


onMounted(async () => {
    await getGroupById(groupId)
        .then((res) => {
            if (res.success) {
                const allData = res.data
                console.log(allData)
                groupName.value = allData?.name as string
                bgImg.value = allData?.coverUrl as string
                des.value = allData?.description as string
            }
        })
})



function changeHeight(index1: any, index2: any) {
    picNum.value[index1] = index2

    const imgs = document.querySelectorAll(".img-everyone")
    const everyimgs = document.querySelectorAll(".everyone")

    let count = 0
    for (let i = 0; i < picNum.value.length; i++) {
        for (let j = 0; j < allImgNum.value[i]; j++) {
            if (i !== index1) {
                count++
                continue
            }
            if (index1 === i && index2 === j) {
                (imgs[count] as HTMLElement).style.padding = "10px";
                (everyimgs[count] as HTMLElement).style.opacity = "1";
            } else {
                (imgs[count] as HTMLElement).style.padding = "20px";
                (everyimgs[count] as HTMLElement).style.opacity = "0.7";
            }
            count++
        }
    }

}


</script>
