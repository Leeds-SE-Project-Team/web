<script lang="ts" setup>
import { useAuthStore, useUserStore } from '@/stores'

const authStore = useAuthStore()
</script>

<template>
  <!-- the section of main header -->
  <section class="main-header">
    <!-- the left part in header -->
    <a-menu
      :default-selected-keys="[$route.name]"
      :disabledOverflow="false"
      class="header-left"
      mode="horizontal"
    >
      <!--    FIXME:  768+ width overflow-->
      <a-menu-item key="0" class="box" disabled style="cursor: default">
        <div class="logo">
          <div class="logo-pic"></div>
          <!--          <div class="logo-pic">pic</div>-->
          <!--          <div class="logo-text">Walcraft</div>-->
        </div>
      </a-menu-item>
      <a-menu-item key="discover" class="box navigation" @click="$router.push({ name: 'discover' })"
        >Discover
      </a-menu-item>
      <a-menu-item key="planner" class="box navigation" @click="$router.push({ name: 'planner' })"
        >Route planner
      </a-menu-item>
      <!--      <a-menu-item key="3" class="box">Features</a-menu-item>-->
    </a-menu>
    <!-- the right part in header -->
    <div class="header-right">
      <div class="shop" style="margin-right: 10px">Shop</div>
      <div
        v-if="authStore.isTokenValid"
        class="sign-log"
        @click="$router.push({ name: 'personal' })"
      >
        My Account
      </div>
      <div v-else class="sign-log" @click="$router.push({ name: 'login' })">Sign up or log in</div>
    </div>
  </section>
</template>
