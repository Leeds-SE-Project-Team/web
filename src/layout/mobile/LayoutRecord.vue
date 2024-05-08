<script lang="ts" setup>
import AHeader from '@/components/header/AHeader.vue'
import RecordFooter from '@/components/mobile/footer/RecordFooter.vue'
import CreateHighlightModal from '@/views/mobile/record/components/CreateHighlightModal.vue'
import { provide, ref } from 'vue'
import { type CreateTourHighlightForm } from '@/apis/tour/highlight'
import { buy_vip, VIPType } from '@/apis/user'
import GraceButton from '@/components/graceButton/GraceButton.vue'
import { showSuccessToast } from 'vant'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/stores'

const imageUrl = ref('')

const handleShowCreateHighlight = (url: string) => {
  createHighlightRef.value.show = true
  imageUrl.value = url
}
const handleSaveTour = () => {
  recordMapRef.value.handleSaveTour()
}
const createHighlightRef = ref()
const recordMapRef = ref()
const handleConfirm = (tourHighlightForm: CreateTourHighlightForm) => {
  recordMapRef.value.handleCreateHighlight(tourHighlightForm)
}

const tourId = ref(-1)
const pauseTour = ref(false)
provide('tourId', tourId)
provide('pauseTour', pauseTour)

const showVIPModal = ref(false)
const vipB1 = ref()
const vipB2 = ref()
const vipB3 = ref()
const vipB4 = ref()
const vipType = ref(0)
const setChoose = (id: number) => {
  if (!(vipB1.value && vipB2.value && vipB3.value)) {
    return
  }
  const buttons = [
    vipB1.value as HTMLButtonElement,
    vipB2.value as HTMLButtonElement,
    vipB3.value as HTMLButtonElement,
    vipB4.value as HTMLButtonElement
  ]
  buttons.forEach((item, index) => {
    if (index === id) {
      item.classList.add('chosen')
    } else {
      item.classList.remove('chosen')
    }
  })
  vipType.value = id
}

const userStore = useUserStore()

const clickVIP = (): Promise<void> =>
  new Promise((resolve) => {
    buy_vip(vipType.value).then((res) => {
      if (res.success) {
        showSuccessToast('VIP!')
        userStore.curUser = res.data
        showVIPModal.value = false
        resolve()
      } else {
        Message.info(res.message)
      }
    })
  })
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header id="layout-a-header" class="border-1">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-content id="layout-b-content" class="border-1">
        <RouterView v-slot="{ Component }">
          <component :is="Component" ref="recordMapRef" />
        </RouterView>
      </a-layout-content>
    </a-layout>
    <a-layout-footer id="record-layout-footer">
      <RecordFooter
        @create-highlight="handleShowCreateHighlight"
        @save-tour="handleSaveTour"
        @clickVIP="showVIPModal = true"
      />
    </a-layout-footer>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
  <CreateHighlightModal ref="createHighlightRef" :image-url="imageUrl" @confirm="handleConfirm" />
  <van-dialog v-model:show="showVIPModal" :show-confirm-button="false">
    <template #title>
      <div class="flex-r" style="justify-content: end; padding: 0.5rem">
        <van-icon @click="showVIPModal = false" :size="23" name="cross" />
      </div>
      <div>Pay for VIP</div>
    </template>
    <van-grid>
      <van-grid-item style="flex: 1">
        <button ref="vipB1" class="vip-choice chosen" @click="setChoose(VIPType.MONTHLY)">
          <div class="price flex-c flex-justify-c">
            <div class="time">Monthly</div>
            <div class="money">$6</div>
          </div>
        </button>
      </van-grid-item>
      <van-grid-item style="flex: 1">
        <button ref="vipB2" class="vip-choice" @click="setChoose(VIPType.QUARTERLY)">
          <div class="price flex-c flex-justify-c">
            <div class="time">Quaterly</div>
            <div class="money">$16</div>
          </div>
        </button>
      </van-grid-item>
      <van-grid-item style="flex: 1">
        <button ref="vipB3" class="vip-choice" @click="setChoose(VIPType.YEARLY)">
          <div class="price flex-c flex-justify-c">
            <div class="time">Yearly</div>
            <div class="money">$60</div>
          </div>
        </button>
      </van-grid-item>
      <van-grid-item style="flex: 1">
        <button ref="vipB4" class="vip-choice" @click="setChoose(VIPType.FOREVER)">
          <div class="price flex-c flex-justify-c">
            <div class="time">Forever</div>
            <div class="money">$160</div>
          </div>
        </button>
      </van-grid-item>
    </van-grid>
    <div class="pay flex-r flex-justify-c" style="position: relative; height: 50px">
      <grace-button :callback="clickVIP"></grace-button>
    </div>
  </van-dialog>
</template>

<style scoped>
.vip-choice {
  background-color: white;
  border: rgba(187, 187, 187, 0.5) 0.5px solid;
  width: 100%;
  height: 80px;
  border-radius: 10px;
}

.chosen {
  border: 3px solid;
  border-image: linear-gradient(purple, blue) 30;
}
</style>
