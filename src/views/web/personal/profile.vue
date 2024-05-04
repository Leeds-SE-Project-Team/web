<script lang="ts" setup>
import { getTourById, type TourRecord } from '@/apis/tour';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';
import tourCard from './cards/tourCard.vue';
import { Message } from '@arco-design/web-vue';
import { upgradeUser, type UserRecord } from '@/apis/user';

const currUser = computed(() => useUserStore().curUser)
const likeTours = ref<TourRecord[]>([])
const starTours = ref<TourRecord[]>([])

const getTour = async (id: number, type: number) => {
    await getTourById(id)
        .then(res => {
            if (res.success) {
                if (type === 0) {
                    likeTours.value.push(res.data as TourRecord)
                } else {
                    starTours.value.push(res.data as TourRecord)
                }
            }
        })
}

if (currUser.value) {
    // console.log(currUser.value.tourLikes)
    for (let i = 0; i < currUser.value.tourLikes.length; i++) {
        getTour(currUser.value.tourLikes[i], 0)
    }
    for (let i = 0; i < currUser.value.tourStars.length; i++) {
        getTour(currUser.value.tourStars[i], 1)
    }
    // console.log("1111", likeTours.value, starTours.value)
}



// vip -------->
const visible = ref(false);

const handleClick = () => {
    visible.value = true;
};
const handleOk = () => {
    visible.value = false;
};
const handleCancel = () => {
    visible.value = false;
}

const userStore = useUserStore()
const user = ref<UserRecord | null>(null)

const clickVIP = (): Promise<void> =>
    new Promise((resolve) => {
        const form = user.value!
        form.type = 1
        upgradeUser(form).then(res => {
            if (res.success) {
                Message.success("Congratulations! You are VIP now!")
                resolve()
            } else {
                Message.info(res.message)
            }
        })
    })

userStore
    .getUserRecord()
    .then((res) => {
        console.log(res)
        user.value = res;
    })
    .catch((e) => {
        Message.info(e)
    })

</script>

<template>
    <div id="personal-profile">
        <div class="cover">
            <div class="profile-head">
                <img src="https://file.wmzspace.space/user/default/avatar/avatar.jpg" alt="">
            </div>

            <div class="name">
                <div>
                    {{ currUser?.nickname }}
                </div>
                <div>
                    <a-popover position="rb">
                        <a-button v-if="user?.type" class="vip-button">
                            <van-icon :size="20" name="/account/vip.svg" />
                        </a-button>
                        <template #content>
                            <p>You are vip and you can:</p>
                            <p>Lorem ipsum doio qui. export ab dolor officiis cum vero?</p>
                            <p>Lorem ipratiossimus dolores similique.</p>
                        </template>
                    </a-popover>

                    <a-button v-if="!user?.type" class="buy-button vip-button" @click="handleClick">
                        vip
                    </a-button>

                    <a-modal class="info" v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" :on-before-ok="clickVIP">
                        <template #title>
                            VIP for Walcraft
                        </template>

                        <div class="vip-info">

                            <div class="price">
                                <div class="time">1 Month</div>
                                <div class="money">$6</div>
                            </div>

                            
                            <div class="price">
                                <div class="time">3 Month</div>
                                <div class="money">$16</div>
                            </div>

                            
                            <div class="price">
                                <div class="time">1 Year</div>
                                <div class="money">$60</div>
                            </div>

                        </div>

                    </a-modal>

                </div>
            </div>

            <div class="profile-des">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores qui eaque deserunt totam eveniet
                labore.
            </div>

            <div class="profile-detail">
                <a-divider />
                <div class="detail">
                    <div>
                        <icon-pen-fill />
                        <div class="item">{{ currUser?.gender ? currUser?.gender : "Not Given" }}</div>
                    </div>

                    <div>
                        <icon-to-right />
                        <div class="item">{{ currUser?.weight ? currUser?.weight : "Not Given" }}</div>
                    </div>
                    <div>
                        <icon-to-top />
                        <div class="item">{{ currUser?.height ? currUser?.height : "Not Given" }}</div>
                    </div>
                    <div>
                        <icon-thumb-up />
                        <div class="item">{{ currUser?.tourLikes.length }}</div>
                    </div>
                    <div>
                        <icon-star />
                        <div class="item">{{ currUser?.tourStars.length }}</div>
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
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .vip-button {
            padding: 0;
            margin: 0;
            background-color: #fff;
        }
        
        .buy-button {
            height: 24px;
            padding: 0 4px;
            text-align: center;
            line-height: 20px;
            display: block;
            color: #fff;
            border-radius: 4px;
            background-color: #6e6e6e;
        }

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


.vip-info {
    display: flex;
    justify-content: space-evenly;
    .price {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 20px;
        padding: 20px;
        transition: 0.5s;
        border-radius: 20px;
    }

    .price:hover {
        background-color: #9cbdf9;
    }
}
</style>
