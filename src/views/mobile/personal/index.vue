<template>
    <div id="personal-page" class="flex-c">
        <header class="header flex-r">
            <van-icon :size="32" name="arrow-left" @click="back"/>
            <div style="font-size: 1.5rem;">{{ $route.meta.title }}</div>
            <van-icon :size="32" name="envelop-o" />
        </header>
        <RouterView/>
    </div>
</template>

<script lang="ts">
export default {
    name: "PersonalIndex"
}
</script>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();


const back = ()=>{
    router.back();
}
</script>