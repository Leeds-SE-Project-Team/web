<script lang="ts" setup>
import { getTourById, type TourRecord, type tourRecordData } from '@/apis/tour';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';
import tourCard from './cards/tourCard.vue';

const currUser = computed(()=> useUserStore().curUser)
const likeTours = ref<TourRecord[]>([])
const starTours = ref<TourRecord[]>([])

const getTour = async (id: number, type: number) => {
    await getTourById(id)
        .then(res => {
            if(res.success) {
                if(type === 0) {
                    likeTours.value.push(res.data as TourRecord)
                } else {
                    starTours.value.push(res.data as TourRecord)
                }
            }
        })
}

if (currUser.value) {
    for(let i = 0; i < currUser.value.tourLikes.length; i++) {
        getTour(currUser.value.tourLikes[i], 0)
    }
    for(let i = 0; i < currUser.value.tourStars.length; i++) {
        getTour(currUser.value.tourStars[i], 1)
    }
}


</script>

<template>
    <div id="personal-profile">
        <div class="cover">
            <div class="profile-head">
                <img src="https://file.wmzspace.space/user/default/avatar/avatar.jpg" alt="">
            </div>
            <div class="name">
                {{currUser?.nickname}}
            </div>
            <div class="profile-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores qui eaque deserunt totam eveniet labore.
            </div>


            <div class="profile-detail">
                <a-divider />
                <div class="detail">
                    <div>
                        <icon-pen-fill />
                        <div class="item">{{currUser?.gender ? currUser?.gender : "Not Given"}}</div>
                    </div>

                    <div>
                        <icon-to-right />
                        <div class="item">{{currUser?.weight ? currUser?.weight : "Not Given"}}</div>
                    </div>
                    <div>
                        <icon-to-top />
                        <div class="item">{{currUser?.height ? currUser?.height : "Not Given"}}</div>
                    </div>
                    <div>
                        <icon-thumb-up />
                        <div class="item">{{currUser?.tourLikes.length}}</div>
                    </div>
                    <div>
                        <icon-star />
                        <div class="item">{{currUser?.tourStars.length}}</div>
                    </div>
                </div>
                <a-divider />
            </div>

            <div class="tours">
                <h3>Tours I like <icon-thumb-up /> {{}}</h3>
                <a-divider :size="4" />

                <div class="card" v-for="tour in likeTours" :key="tour.id">
                    <tourCard :info="tour"></tourCard>
                </div>

                <div v-if="!likeTours?.length" class="no">
                    No exist tours you like
                </div>
            </div>

            <div class="tours">
                <h3>Tours I star <icon-star /> {{}}</h3>
                <a-divider :size="4" />

                <div class="card" v-for="tour in starTours" :key="tour.id">
                    <tourCard :info="tour"></tourCard>
                </div>

                <div v-if="!starTours?.length" class="no">
                    No exist tours you like
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
export default {
    name: 'personalProfile'
}
</script>


<style lang="scss">
#personal-profile {
    
    position: relative;
    overflow: scroll;
    height: calc(100vh - 50px);
    position: relative;

    .cover {
        background-color: #fff;
        padding-bottom: 20px;
        padding-top: 20px;
        margin-top: 40px;
        border-radius: 10px;
    }

    .profile-head {
        width: 80px;
        height: 80px;
        margin-left: calc(50% - 40px);

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #bebebc;
        }
    }

    .name {
        background-color: #fff;
        padding-top: 20px;
        width: 100%;
        text-align: center;
        color: #3b3b3b;
        font-size: 20px;
    }

    .profile-des {
        width: 100%;
        padding: 20px 20% 0 20%;
        text-align: center;
        color: #585858;
    }

    .profile-detail {
        padding: 0 10%;

        .detail {
            display: flex;
            justify-content: space-around;

            .item {
                margin-top: 5px;
            }
        }

        .detail>div {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
        }
    }

    .tours {
    margin: 40px 0;
    padding: 30px;
    background-color: #fff;

    h3 {
      font-size: 20px;
      color: rgb(66, 63, 63);
    }

    .card {
      padding: 24px 0;
      border-bottom: 1px solid #e5e5e5;
    }

    .no {
      width: 100%;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      color: #818181;
    }
  }
}
</style>
