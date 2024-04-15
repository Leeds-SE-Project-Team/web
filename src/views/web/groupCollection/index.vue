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
                <h2>{{collectionName}}</h2>
            </div>
            <div class="bg-overlay"></div>
        </section>

        <!-- the section of profile and detail -->
        <section class="detail">
            <div class="profile">
            </div>
            <div class="des">
                {{des}}
            </div>
        </section>

        <!-- the section of every tour -->
        <section v-for="(tour, index1) in groupTour" :key="tour.name" class="every-tour">
            <div class="small-bar"></div>
            <div class="every-tour-title">{{tour.name}}</div>
            <!-- the tour content -->
            <div class="tour-content">
                <div class="content-img">
                    <img :src="allImgData[index1].content[picNum[index1]].imgUrl" alt="">
                </div>
                <div class="content-side">
                    <div class="side-name">THE TOUR WE GET</div>
                    <div class="cover">
                        <div class="side-all" :style="{marginTop: `${20 - 35*picNum[index1]}%`}">
                            <div v-for="(each, index2) in tour.content" :key="each.userName"  @click="changeHeight(index1, index2)" class="everyone">
                                <div class="img-everyone">
                                    <img :src="each.header" alt="">
                                </div>
                                <p>{{each.userName}}</p>
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
import axios from 'axios';
import { ref, onMounted } from 'vue';
// define all the varibles
const allImgData = ref<any>({})
const allImgNum = ref<any>({})

const bgImg = ref('')
const collectionName = ref('')
const des = ref('')
const groupTour = ref<any>([])
const picNum = ref<any>([])


// onMounted is here
onMounted(async () => {
    await axios.get("./src/views/web/groupCollection/tours.json")
               .then((res)=>{
                console.log(res.data.data)
                allImgData.value = res.data.data
                allImgNum.value = res.data.data.map((x:any) => x.content.length)
                collectionName.value = res.data.collectionName
                groupTour.value = res.data.data
                des.value = res.data.des
                bgImg.value = res.data.imgUrl
                picNum.value = res.data.data.map(() => 0)
                console.log(allImgNum.value)
                console.log(picNum.value[0])
               })
})

function changeHeight(index1: any, index2: any) {
    picNum.value[index1] = index2

    const imgs = document.querySelectorAll(".img-everyone")
    const everyimgs = document.querySelectorAll(".everyone")
    let count = 0
    console.log(imgs)
    for(let i = 0; i < picNum.value.length; i++) {
        for (let j = 0; j < allImgNum.value[i]; j++) {
            if (i !== index1) {
                count++
                continue
            }
            if(index1 === i && index2 ===j) {
                imgs[count].style.padding = "0px";
                everyimgs[count].style.opacity = 1;
            } else {
                imgs[count].style.padding = "20px";
                everyimgs[count].style.opacity = 0.7;
            }
            count++
        }
    }

}


</script>
