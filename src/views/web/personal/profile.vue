<script lang="ts" setup>
import { getTourById, getTourByUser, type TourRecord } from '@/apis/tour'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, reactive, ref } from 'vue'
import tourCard from './cards/tourCard.vue'
import { Message } from '@arco-design/web-vue'
import { upgradeUser, type UserRecord } from '@/apis/user'
import { updateUser } from '@/apis/user/index'
import { uploadFileFromURL } from '@/utils/file'
import { showToast, type UploaderFileListItem } from 'vant'
import router from '@/router'

const currUser = computed(() => useUserStore().curUser)
const likeTours = ref<TourRecord[]>([])
const starTours = ref<TourRecord[]>([])

const getTour = async (id: number, type: number) => {
  await getTourById(id).then((res) => {
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

const clickVIP = (): Promise<void> =>
  new Promise((resolve) => {
    const form = user.value!
    form.type = 1
    upgradeUser(form).then((res) => {
      if (res.success) {
        Message.success('Congratulations! You are VIP now!')
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
    user.value = res
  })
  .catch((e) => {
    Message.info(e)
  })

// profile data ---------->
const tours = ref<TourRecord[] | undefined>([])

const totalCalories = ref<number>()
const totalMiles = ref<number>()
const tourNumber = ref<number>(0)

getTourByUser().then((res) => {
  if (res.success) {
    tours.value = res.data
    totalCalories.value =
      tours.value?.reduce((total, tour) => total + (tour.tourRecordData?.calorie || 0), 0) || 0
    totalMiles.value =
      tours.value?.reduce((total, tour) => total + (tour.tourRecordData?.totalDistance || 0), 0) ||
      0
    tourNumber.value = tours.value ? tours.value.length : 0
  }
})

// form ------------->
const visibleU = ref(false)

const handleClickU = () => {
  visibleU.value = true
}
const handleOkU = () => {
  visibleU.value = false
}
const handleCancelU = () => {
  visibleU.value = false
}

const file = ref<UploaderFileListItem[]>([])
const theForm = ref()
const statusArray = ref<boolean[]>(new Array(10).fill(false))
const pwdStruct = reactive({
  old: '',
  new: '',
  renew: ''
})

const pwdValidate = () => {
  if (pwdStruct.old == '' && pwdStruct.new != '') {
    return '请输入旧密码'
  } else if (pwdStruct.new == '') {
    return true
  } else if (pwdStruct.renew != pwdStruct.new) {
    return '请输入相同密码'
  }
  return true
}

const formSubmit = () => {
  theForm.value
    .validate()
    .then(() => {
      if (!user.value) {
        return
      }
      const form = {
        ...user.value,
        oldPassword: pwdStruct.old === '' ? null : pwdStruct.old,
        newPassword: pwdStruct.new === '' ? null : pwdStruct.new
      }
      console.log(form)
      if (file.value.length == 1) {
        uploadFileFromURL(file.value[0].objectUrl as string, `/user/${user.value.id}/avatar`)
          .then((res) => {
            if (res.success) {
              return res.data as string
            } else {
              Message.info(res.message)
              return 'no'
            }
          })
          .then((res) => {
            if (res === 'no') {
              return
            }
            form.avatar = import.meta.env.APP_STATIC_URL + res
            console.log(res)
            updateUser(form).then((res) => {
              if (res.success) {
                Message.info(res.message)
                userStore.curUser = res.data!
                router.replace({ path: '/personal', query: { status: 'refresh' } })
              } else {
                Message.info(res.message)
              }
            })
          })
          .catch((e) => {
            Message.error(e)
          })
      }
      updateUser(form)
        .then((res) => {
          if (res.success) {
            Message.info(res.message)
          } else {
            Message.info(res.message)
          }
          visibleU.value = false
        })
        .catch((e) => {
          Message.error(e)
          visibleU.value = false
        })
    })
    .catch((e: any) => {
      console.log(e)
    })
}

const changeInput = (i: number) => {
  statusArray.value[i] = !statusArray.value[i]
}
onMounted(() => {
  userStore
    .getUserRecord()
    .then((res) => {
      console.log(res)
      user.value = res
    })
    .catch((e) => {
      Message.info(e)
    })
})
</script>

<template>
  <div id="personal-profile">
    <div class="cover">
      <div class="profile-head">
        <img :src="currUser?.avatar" alt="" />
      </div>

      <div class="name">
        <span style="cursor: pointer" @click="handleClickU">
          <icon-pen />
        </span>

        <a-modal
          v-model:visible="visibleU"
          :on-before-ok="formSubmit"
          @cancel="handleCancelU"
          @ok="handleOkU"
        >
          <template #title> Change you detail</template>
          <van-form ref="theForm">
            <van-cell-group v-if="user" class="flex-c" inset style="background-color: transparent">
              <van-field class="avatar" label="头像" @click="console.log(file)">
                <template #input>
                  <van-uploader v-model="file" />
                </template>
              </van-field>
              <van-field
                v-model="user.nickname"
                :readonly="!statusArray[0]"
                :right-icon="statusArray[0] ? 'sign' : 'edit'"
                :rules="[{ required: true, message: '请输入用户名' }]"
                label="用户名"
                placeholder="请输入用户名"
                @click-right-icon="changeInput(0)"
              />
              <van-field
                v-model="pwdStruct.old"
                label="旧密码"
                placeholder="请输入旧密码"
                type="password"
              />
              <van-field v-model="pwdStruct.new" label="新密码" placeholder="请输入新密码" />
              <van-field
                v-model="pwdStruct.renew"
                :rules="[{ validator: pwdValidate }]"
                label="确认新密码"
                placeholder="请输入确认新密码"
              />
              <van-field
                v-model="user.email"
                :readonly="!statusArray[1]"
                :right-icon="statusArray[1] ? 'sign' : 'edit'"
                :rules="[{ required: true, message: '请输入邮箱' }]"
                label="邮箱"
                placeholder="请输入邮箱"
                @click-right-icon="changeInput(1)"
              />
              <van-field
                v-model="user.age"
                :readonly="!statusArray[2]"
                :right-icon="statusArray[2] ? 'sign' : 'edit'"
                label="Age"
                placeholder="Enter Age"
                @click-right-icon="changeInput(2)"
              />
              <van-field label="Gender" placeholder="Enter Gender">
                <template #input>
                  <van-radio-group v-model="user.gender" direction="horizontal">
                    <van-radio name="Male">Male</van-radio>
                    <van-radio name="Famale">Famale</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
              <van-field
                v-model="user.height"
                :readonly="!statusArray[4]"
                :right-icon="statusArray[4] ? 'sign' : 'edit'"
                label="Height"
                placeholder="Enter Height"
                @click-right-icon="changeInput(4)"
              />
              <van-field
                v-model="user.weight"
                :readonly="!statusArray[5]"
                :right-icon="statusArray[5] ? 'sign' : 'edit'"
                label="Weight"
                placeholder="Enter Weight"
                @click-right-icon="changeInput(5)"
              />
              <!-- <van-button @click="formSubmit">submit</van-button> -->
            </van-cell-group>
          </van-form>
        </a-modal>

        <div>
          {{ currUser?.nickname }}
        </div>
        <div>
          <a-popover position="rb">
            <a-button v-if="user?.type" class="vip-button">
              <img alt="email" src="@/assets/vip.svg" @click="showToast('Already VIP')" />
              <!--              <van-icon :size="20" name="/account/vip.svg" />-->
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

          <a-modal
            v-model:visible="visible"
            :on-before-ok="clickVIP"
            class="info"
            @cancel="handleCancel"
            @ok="handleOk"
          >
            <template #title> VIP for Walcraft</template>
            <a-radio-group v-model="chosedvip" size="large" type="button">
              <a-radio value="Beijing">
                <div class="price">
                  <div class="time">1 Month</div>
                  <div class="money">$6</div>
                </div>
              </a-radio>
              <a-radio value="Shanghai">
                <div class="price">
                  <div class="time">3 Month</div>
                  <div class="money">$16</div>
                </div>
              </a-radio>
              <a-radio value="Guangzhou">
                <div class="price">
                  <div class="time">1 Year</div>
                  <div class="money">$60</div>
                </div>
              </a-radio>
              <a-radio value="Guanou">
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
        </div>
      </div>

      <div class="profile-des">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores qui eaque deserunt totam
        eveniet labore.
      </div>

      <div class="profile-detail">
        <a-divider />
        <div class="detail">
          <div>
            <span>
              <icon-pen-fill />
            </span>
            <div class="item">{{ tourNumber + ' tours' }}</div>
          </div>

          <div>
            <icon-double-right />
            <div class="item">
              {{ totalMiles !== undefined ? totalMiles.toFixed(2) + ' km' : 'calculating...' }}
            </div>
          </div>
          <div>
            <icon-fire />
            <div class="item">
              {{
                totalCalories !== undefined
                  ? totalCalories.toFixed(2) + ' calories'
                  : 'calculating...'
              }}
            </div>
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
        <h3>
          Tours I like
          <icon-thumb-up />
          {{}}
        </h3>
        <a-divider :size="4" />

        <div v-for="(_, i) in currUser?.tourLikes.length" :key="i" class="card">
          <tourCard v-if="likeTours[i]" :info="likeTours[i]"></tourCard>
          <a-skeleton
            v-else
            animation
            loading
            style="display: flex; justify-content: center; align-items: center"
          >
            <a-skeleton-shape size="large" style="width: 96px; height: 96px; padding: 10px" />
            <div style="width: 100%; padding: 0 30px">
              <a-skeleton-line :rows="3" />
            </div>
          </a-skeleton>
        </div>
        <div v-if="!currUser?.tourLikes.length" class="no">No exist tours you like</div>
      </div>

      <div class="tours">
        <h3>
          Tours I star
          <icon-star />
          {{}}
        </h3>
        <a-divider :size="4" />

        <div v-for="(_, i) in currUser?.tourStars.length" :key="i" class="card">
          <tourCard v-if="starTours[i]" :info="starTours[i]"></tourCard>
          <a-skeleton
            v-else
            animation
            loading
            style="display: flex; justify-content: center; align-items: center"
          >
            <a-skeleton-shape size="large" style="width: 96px; height: 96px; padding: 10px" />
            <div style="width: 100%; padding: 0 30px">
              <a-skeleton-line :rows="3" />
            </div>
          </a-skeleton>
        </div>
        <div v-if="!currUser?.tourStars.length" class="no">No exist tours you like</div>
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
    border-radius: 50%;
    border: 2px solid #bebebc;
    overflow: hidden;

    img {
      min-width: 100%;
      height: 100%;
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

    .detail > div {
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

.price {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  padding: 20px;
  transition: 0.5s;
  border-radius: 20px;
  font-size: 14px;
}
</style>
