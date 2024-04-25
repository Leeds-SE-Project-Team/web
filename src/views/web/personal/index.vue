<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore()

onMounted(()=> {
  console.log(userStore.curUser)
  console.log(userStore.curUser?.id)
})

const router = useRouter();

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>


<template>
    <!-- 创建 group (leader)-->
    <!-- leaderid name coverurl description... -->
    <!-- 邀请到 group: search user, -->


    <!-- 创建 group collection -->
    <!-- coverurl description name title groupid-->
    
    <!-- tour 和 tour collection -->
    <!-- get collection/tour by user -->

    <!-- vip: update user -->
    <!-- small icon -->
    <div id="personal-page">
      <a-layout class="profile-layout">
        <!-- left bar -->
        <a-layout-sider class="left-sider">
        
          <div class='pic-profile'>
            <img src="https://ts1.cn.mm.bing.net/th?id=OIP-C.xkOtrf4z_dP8Z7S3jrpnDwHaEK&w=146&h=120&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2" alt="">
          </div>

          <div class="name">
            {{userStore.curUser?.nickname}}
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
            <a-menu-item key="personalhighlights" @click="navigateTo('personalhighlights')">
              Highlights
            </a-menu-item>
            <a-menu-item key="personalcollections" @click="navigateTo('personalcollections')">
              Collections
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
