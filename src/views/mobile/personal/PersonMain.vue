<template>
  <section class="user-info flex-r">
    <div class="user-avatar">
      <van-image :src="user?.avatar" height="100" round width="100" fit="cover" />
    </div>
    <div class="user-text flex-c">
      <div class="username flex-r">
        <span style="margin-right: 0.5rem">{{ user?.nickname }}</span>
        <div v-if="user?.type==1" class="flex-c flex-justify-c" >
          <van-icon :size="20" name="/account/vip.svg" />
        </div>
      </div>
      <div class="email">
        {{ user?.email }}
      </div>
      <div class="vip-time" v-if="user?.vipExpireTime">
        VIP expire at {{ user.vipExpireTime }}
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
      <van-cell @click="toCollection">
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
          <van-icon :size="24" name="friends-o" />
        </template>
        <div class="flex-r list-text">
          <span>My Group</span>
        </div>
        <template #right-icon>
          <van-icon @click="toGroup" v-if="user?.type==1" :size="24" name="arrow" />
          <van-icon v-else :size="24" name="credit-pay" />
        </template>
      </van-cell>
      <van-cell v-if="user?.type==0" @click="payVIP = true" >
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
      <div class="flex-r flex-justify-c" style="margin: 2.5rem 0">
        <van-button hairline type="primary" @click="authStore.handleLogout">Logout</van-button>
      </div>
    </van-list>
    <van-dialog v-model:show="payVIP" :show-confirm-button="false">
      <template #title>
        <div class="flex-r" style="justify-content: end;padding: 0.5rem;"  >
          <van-icon @click="payVIP=false" :size="23" name="cross" />
        </div>
        <div>
          Pay for VIP
        </div>
      </template>
      <van-grid>
        <van-grid-item style="flex: 1;" >
          <button ref="vipB1" class="vip-choice chosen" @click="setChoose(VIPType.MONTHLY)" >
            <div class="price flex-c flex-justify-c">
              <div class="time">Monthly</div>
              <div class="money">$6</div>
            </div>
          </button>
        </van-grid-item>
        <van-grid-item style="flex: 1;">
          <button ref="vipB2" class="vip-choice" @click="setChoose(VIPType.QUARTERLY)" >
            <div class="price flex-c flex-justify-c">
              <div class="time">Quaterly</div>
              <div class="money">$16</div>
            </div>
          </button>
        </van-grid-item>
        <van-grid-item style="flex: 1;">
          <button ref="vipB3" class="vip-choice" @click="setChoose(VIPType.YEARLY)">
            <div class="price flex-c flex-justify-c">
              <div class="time">Yearly</div>
              <div class="money">$60</div>
            </div>
          </button>
        </van-grid-item>
        <van-grid-item style="flex: 1;">
          <button ref="vipB4" class="vip-choice" @click="setChoose(VIPType.FOREVER)">
            <div class="price flex-c flex-justify-c">
              <div class="time">Forever</div>
              <div class="money">$160</div>
            </div>
          </button>
        </van-grid-item>
      </van-grid>
      <div class="pay flex-r flex-justify-c" style="position: relative;height: 50px"  >
        <grace-button :callback="clickVIP" ></grace-button>
      </div>
    </van-dialog>
  </section>
</template>

<script lang="ts" setup>
import { buy_vip, type UserRecord, VIPType } from '@/apis/user'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import GraceButton from '@/components/graceButton/GraceButton.vue'


const userStore = useUserStore()
const user = ref<UserRecord | null>(null)
const router = useRouter()
const authStore = useAuthStore()
const payVIP = ref(false)
const vipB1 = ref()
const vipB2 = ref()
const vipB3 = ref()
const vipB4 = ref()
const vipType = ref(0)

const toDetail = () => {
  router.push('/personal/detail')
}
const toTour = () => {
  router.push('/personal/tour')
}
const toCollection = ()=>{
  router.push('/personal/collection')
}
const toGroup = ()=>{
  router.push('/personal/group')
}
const clickVIP = ():Promise<void> =>
  new Promise((resolve)=>{
    buy_vip(vipType.value).then(res=>{
      if(res.success){
        showSuccessToast("VIP!")
        resolve()
      }else{
        Message.info(res.message)
      }
    })
  })
const setChoose = (id:number)=>{
  if(!(vipB1.value&&vipB2.value&&vipB3.value)){
    return;
  }
  const buttons = [
    vipB1.value as HTMLButtonElement,
    vipB2.value as HTMLButtonElement,
    vipB3.value as HTMLButtonElement,
    vipB4.value as HTMLButtonElement
  ]
  buttons.forEach((item,index)=>{
    if(index===id){
      item.classList.add("chosen")
    }else{
      item.classList.remove('chosen');
    }
  })
  vipType.value = id
}

userStore
  .getUserRecord()
  .then((res) => {
    console.log(res)
    user.value = res;
  })
  .catch((e) => {
    Message.info(e)
  })
onMounted(() => {
  
})
</script>

<style scoped>
:deep(.van-cell::after) {
  border: none;
}

:deep(.van-cell) {
  margin: 0.5rem 0;
}
:deep(.van-dialog__header){
  padding:0;
}

.vip-choice{
  background-color: white;
  border: rgba(187, 187, 187,0.5) 0.5px solid;
  width: 100%;
  height: 80px;
  border-radius: 10px;
}

.chosen{
  border: 3px solid;
  border-image: linear-gradient(purple,blue) 30;
}
</style>
