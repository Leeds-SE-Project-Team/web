<template>
  <section id="ASider">
    <div class="personInfo">
      <a-avatar :size="64">Arco</a-avatar>
      <div class="usernameWrapper">
        <span class="username">username</span>
      </div>
      <div class="userUltra">
        <div class="ultraItem">
          <div class="itemNumber">1</div>
          <div class="itemType">Follower</div>
        </div>
        <div class="ultraItem">
          <div class="itemNumber">1</div>
          <div class="itemType">Following</div>
        </div>
        <div class="ultraItem">
          <div class="itemNumber">1</div>
          <div class="itemType">Close Friends</div>
        </div>
      </div>
    </div>
  </section>
  <a-menu :default-open-keys="['0']" :default-selected-keys="['0_2']" id="ASideMenu">
    <hr />
    <a-sub-menu key="0">
      <template #title>
        <div class="submenuTitle">Your Profile</div>
      </template>
      <template #expand-icon-down></template>
      <a-menu-item key="0_0">Menu 1</a-menu-item>
      <a-menu-item key="0_1">Menu 2</a-menu-item>
      <a-menu-item key="0_2">Menu 3</a-menu-item>
      <a-menu-item key="0_3">Menu 4</a-menu-item>
    </a-sub-menu>
    <hr />
    <a-sub-menu key="1">
      <template #title>
        <div class="submenuTitle">Tour</div>
      </template>
      <template #expand-icon-down></template>
      <a-menu-item key="1_0">Menu 1</a-menu-item>
      <a-menu-item key="1_1">Menu 2</a-menu-item>
      <a-menu-item key="1_2">Menu 3</a-menu-item>
    </a-sub-menu>
    <hr />
    <a-sub-menu key="2">
      <template #title>
        <div class="submenuTitle">Heilights</div>
      </template>
      <template #expand-icon-down></template>
      <a-menu-item key="2_0">Menu 1</a-menu-item>
      <a-menu-item key="2_1">Menu 2</a-menu-item>
    </a-sub-menu>
    <hr />
    <a-sub-menu key="3">
      <template #title>
        <div class="submenuTitle">Collections</div>
      </template>
      <template #expand-icon-down></template>
      <a-menu-item key="3_0">Menu 1</a-menu-item>
      <a-menu-item key="3_1">Menu 2</a-menu-item>
    </a-sub-menu>
  </a-menu>
  <a-list size="medium">
    <template #header> List title </template>
    <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
    <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
    <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
    <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
    <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>
  </a-list>
</template>

<script setup lang="ts"></script>

<style scoped>
#ASideMenu :deep(.arco-menu-title) {
  width: 100%;
}
</style>
