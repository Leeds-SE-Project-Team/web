<template>
    <section class="user-info flex-r">
        <div class="user-avatar">
            <van-image
                round
                width="100"
                height="100"
                :src="user?.avatar"
            />
        </div>
        <div class="user-text flex-c">
            <div class="username">
                {{ user?.nickname }}
            </div>
            <div class="email">
                {{ user?.email }}
            </div>
        </div>
    </section>
    <section class="options">
        <van-list class="options-list">
            <van-cell @click="toDetail">
                <template #icon>
                    <van-icon :size="24" name="contact-o" />
                </template>
                <div class="flex-r list-text">
                    <span>Detail Profile</span>
                </div>
                <template #right-icon>
                    <van-icon :size="24" name="arrow" />
                </template>
            </van-cell>
            <van-cell @click="toTour">
                <template #icon>
                    <van-icon :size="24" name="orders-o" />
                </template>
                <div class="flex-r list-text">
                    <span>My Tour</span>
                </div>
                <template #right-icon>
                    <van-icon :size="24" name="arrow" />
                </template>
            </van-cell>
            <van-cell>
                <template #icon>
                    <van-icon :size="24" name="description-o" />
                </template>
                <div class="flex-r list-text">
                    <span>My Collection</span>
                </div>
                <template #right-icon>
                    <van-icon :size="24" name="arrow" />
                </template>
            </van-cell>
            <van-cell>
                <template #icon>
                    <van-icon :size="24" name="/account/vip.svg" />
                </template>
                <div class="flex-r list-text">
                    <span>Apply for VIP</span>
                </div>
                <template #right-icon>
                    <van-icon :size="24" name="arrow" />
                </template>
            </van-cell>
            <div class="flex-r flex-justify-c" style="margin: 2.5rem 0;">
                <van-button hairline type="primary" @click="authStore.handleLogout">Logout</van-button>
            </div>
        </van-list>
    </section>
</template>

<script setup lang="ts">
import type { UserRecord } from '@/apis/user';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { Message } from '@arco-design/web-vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const user = ref<UserRecord | null>(null);
const router = useRouter();
const authStore = useAuthStore();

const toDetail = ()=>{
    router.push('/personal/detail')
}
const toTour = ()=>{
    router.push('/personal/tour')
}
onMounted(()=>{
    userStore.getUserRecord().then(res=>{
        user.value = res
    }).catch(e=>{
        Message.info(e)
    })
})
</script>

<style scoped>
:deep(.van-cell::after){
    border: none;
}
:deep(.van-cell){
    margin: 0.5rem 0;
}
</style>