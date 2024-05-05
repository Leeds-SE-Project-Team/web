<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { computed, onMounted } from 'vue';

const curr = computed(() => useUserStore().curUser)

onMounted(()=> {
  console.log(curr)
  console.log(curr.value?.id)
})

const router = useRouter();

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>


<template>
    <div id="personal-page">
      <a-layout class="profile-layout">
        <!-- left bar -->
        <a-layout-sider class="left-sider">
        
          <div class='pic-profile'>
            <img :src="curr?.avatar" alt="">
          </div>

          <div class="name">
            {{curr?.nickname}}
            
            <span v-if="curr?.type" class="vip-button">
              <van-icon :size="20" name="/account/vip.svg" />
            </span>

          </div>

          <div class="banner">
            <div>
              <div class="num-b">21</div> Followers
            </div>
            <div>
              <div class="num-b">12</div> Following
            </div>
            <div>
              <div class="num-b">2</div> Colse friends
            </div>
          </div>
          
          <a-menu class="menu" :default-selected-keys="[$route.meta.title]">
            <a-menu-item key="personalprofile" @click="navigateTo('personalprofile')">
              Your Profile
            </a-menu-item>
            <a-menu-item key="personaltours" @click="navigateTo('personaltours')">
              Tours
            </a-menu-item>
            <!-- <a-menu-item key="personalhighlights" @click="navigateTo('personalhighlights')">
              Highlights
            </a-menu-item> -->
            <a-menu-item key="personalcollections" @click="navigateTo('personalcollections')">
              My Collections
            </a-menu-item>
            <a-menu-item key="personalgroup" @click="navigateTo('personalgroup')">
              Groups
            </a-menu-item>
          </a-menu>
        
        </a-layout-sider>


        <!-- right one -->
        <a-layout>
          <a-layout-content class="right-content">
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
</template>

<script lang="ts">
export default {
  name: 'personalPage'
}
</script>
