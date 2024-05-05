<script lang="ts" setup>
import type { GroupRecord } from '@/apis/group';
import { addUserToGroup, getAllUsers, type UserRecord } from '@/apis/user';
import message from '@arco-design/web-vue/es/message';
import { showToast } from 'vant';
import { computed, onMounted, ref } from 'vue';

const emit = defineEmits(["reload"])

const props = defineProps<{
  info: GroupRecord,
}>()

const show = ref(false)

const leader = computed(() => props.info.members.find((user) => user.id === props.info.leaderId)) 

const others = computed(() => props.info.members.filter((user) => user.id !== props.info.leaderId))

// this is the logic of add group member form
const visible = ref(false);

const handleClick = (event: MouseEvent) => {
  event.stopPropagation();
  console.log("leader and gourp_id", props.info.leaderId, props.info.id)
  visible.value = true;
};

const choosedId = ref<number>()

const handleOk = () => {
  if(!choosedId.value) {
    message.warning('Add failed, you did not choose group member')
    return
  }

  addUserToGroup(choosedId.value, props.info.id)
    .then(res => {
      if(res.success) {      
        showToast(res.message)
        emit('reload')
      } else {
        showToast(res.message)
      }
    })
  visible.value = false;
};


const handleCancel = () => {
  visible.value = false;
}

// inputName
// const token = useAuthStore().accessToken
const inputName = ref("")

// users
const users = ref<UserRecord[]>()
onMounted(async()=>{
  await getAllUsers()
    .then((res) => {
      users.value = res.data
    })
})

const filteredUsers = computed(()=>{
  if (!inputName.value) {
    return users.value?.filter((user) => {
      for(let i=0 ; i < props.info.members.length; i++) {
        if (props.info.members[i].id === user.id) {
          return false
        }
      }
      return true
    });
  } else {
    return users.value?.filter((user) => {
      for(let i=0 ; i < props.info.members.length; i++) {
        if (props.info.members[i].id === user.id) {
          return false
        }
      }
      return user.nickname.includes(inputName.value);
    });
  }
})
</script>

<template>
    <a-button 
      type="primary" 
      style="background-color: #bacd9e; margin-right: 10px;" 
      @click = '(event: MouseEvent) => { 
        show = true
        event.stopPropagation()
        }'>
        <template #icon>
          <icon-plus />
        </template>
    </a-button>

    <van-dialog 
      v-model:show="show" 
      title="members" 
      show-cancel-button 
      @confirm="handleOk"
      @click = '(event: MouseEvent) => {
        event.stopPropagation()
        }'>
      <div style="padding: 10px;">
        <a-divider/>
        <div style="margin: 0 0 10px; width: 100%; align-self: center;">Exist member:</div>
        <div>
          <a-avatar class="leader" trigger-type="mask" :size="44">
            <!-- <van-image :src="leader?.avatar" height="100" round width="100" fit="cover" /> -->
            <img alt="avatar" :src="leader?.avatar"/>
          </a-avatar>
          <a-space class="others" :size="34">
              <a-avatar-group>
                  <a-avatar :size="34" trigger-type="mask" v-for="user in others" :key="user.id">
                    <img alt="avatar" :src="user.avatar"/>
                  </a-avatar>
              </a-avatar-group>
          </a-space>
        </div>
        <a-divider/>

        <!-- add more group member -->
        <div class="search-member">
          <a-form-item field="post" label="Search">
            <a-input v-model="inputName" placeholder="please enter member name..." />
          </a-form-item>

          <a-divider solid />
          
          <div class="content">
            <div 
              class="add-users" 
              v-for="(item) in filteredUsers" 
              :key="item.id" 
              @click="() => {
                choosedId=item.id
              }"
              :style="{'background-color': item.id===choosedId ? '#e5e6eb':'#fff'}"
              >
              <div class="header-member">
                <!-- <img :src="item.avatar" alt=""> -->
                <van-image :src="item.avatar" fit="cover" />
              </div>
              <div class="name">{{item.nickname}}</div>
            </div>
          </div>
        </div>
      </div>
    </van-dialog>
</template>

<script lang="ts">
export default {
    name: 'dialogMember'
}
</script>

<style lang="scss">

.search-member {
  .content {
    height: 200px;
    overflow: auto;
    .add-users {
      display: flex;
      padding: 10px 10px;
      align-items: center;
      border-radius: 10px;
      transition: 0.3s;
      cursor: pointer;
      margin-bottom: 10px;
      gap: 30px;
      .header-member {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 10px;
        img {
          width: 100%;
          min-height: 100%;
        }
      }
    }
  }
}

</style>