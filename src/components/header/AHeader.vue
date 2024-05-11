<script lang="ts" setup>
import { buy_vip, upgradeUser, type UserRecord } from '@/apis/user';
import { useAuthStore, useUserStore } from '@/stores'
import { Message } from '@arco-design/web-vue';
import { showSuccessToast } from 'vant';
import { computed } from 'vue';
import { ref } from 'vue';

const authStore = useAuthStore()

const visible = ref(false)
const chosedvip = ref<number>(0)

const handleClick = () => {
  visible.value = true
}
const handleOk = () => {
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}

const userStore = useUserStore()
const user = ref<UserRecord | null>(null)
const isVIP = computed(()=>{
  return userStore.curUser?.type===1;
})

const clickVIP = (): Promise<void> =>
  new Promise((resolve) => {
    console.log(chosedvip.value)
    buy_vip(chosedvip.value).then((res) => {
      if (res.success) {
        showSuccessToast('VIP!')
        userStore.curUser = res.data
        user.value = res.data!
        resolve()
      } else {
        Message.info(res.message)
      }
    })
  })
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
      <div v-if="!isVIP" class="shop" style="margin-right: 10px" @click="handleClick">Shop</div>
      <div
        v-if="authStore.isTokenValid"
        class="sign-log"
        @click="$router.push({ name: 'personal' })"
      >
        My Account
      </div>
      <div v-else class="sign-log" @click="$router.push({ name: 'login' })">Sign up or log in</div>
    </div>
    <a-modal
      v-model:visible="visible"
      :on-before-ok="clickVIP"
      class="info"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <template #title> VIP for Walcraft</template>
      <a-radio-group v-model="chosedvip" size="large" type="button">
        <a-radio value="0">
          <div class="price">
            <div class="time">1 Month</div>
            <div class="money">$6</div>
          </div>
        </a-radio>
        <a-radio value="1">
          <div class="price">
            <div class="time">3 Month</div>
            <div class="money">$16</div>
          </div>
        </a-radio>
        <a-radio value="2">
          <div class="price">
            <div class="time">1 Year</div>
            <div class="money">$60</div>
          </div>
        </a-radio>
        <a-radio value="3">
          <div class="price">
            <div class="time">
              <strong>Forever</strong>
              <img
                alt="vip"
                src="@/assets/vip.svg"
                style="margin-left: 2px; width: 12px; height: 12px"
              />
            </div>
            <div class="money"><strong>$160</strong></div>
          </div>
        </a-radio>
      </a-radio-group>
    </a-modal>
  </section>
</template>
