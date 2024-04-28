leader<script lang="ts" setup>
import type { GroupRecord } from '@/apis/group';
import { addUserToGroup, getAllUsers, type UserRecord } from '@/apis/user';
import Message from '@arco-design/web-vue/es/message';
import message from '@arco-design/web-vue/es/message';
import { computed, onMounted, ref } from 'vue';

const emit = defineEmits(["reload"])

const props = defineProps<{
  info: GroupRecord
}>()

const leader = computed(() => props.info.members.find((user) => user.id === props.info.leaderId)) 

const others = computed(() => props.info.members.filter((user) => user.id !== props.info.leaderId))

// this is the logic of add group member form
const visible = ref(false);

const handleClick = () => {
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
        Message.info("Add group member successfully!")
        emit('reload')
      } else {
        Message.warning(res.message)
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
  <div id="group-card">

    <div class="img">
      <img :src="$props.info.coverUrl" alt="">
    </div>

    <div class="cover"></div>

    <div class="profile-group">
      <a-avatar class="leader" trigger-type="mask" :size="44">
        <img alt="avatar" :src="leader?.avatar"/>
      </a-avatar>
      <a-space class="others" :size="34">
          <a-avatar-group>
              <a-avatar :size="34" trigger-type="mask" v-for="user in others" :key="user.id">
                <img alt="avatar" :src="user.avatar"/>
              </a-avatar>
          </a-avatar-group>
      </a-space>

      <!-- add more group member -->
      <a-avatar :size="34" @click="handleClick" class="add-group-member">+</a-avatar>

      <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" okText="submit" cancelText="cancle">
        <template #title>
          Search and add group member
        </template>

        <div id="search">
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
              <div class="header">
                <img :src="item.avatar" alt="">
              </div>
              <div class="name">{{item.nickname}}</div>
            </div>
          </div>
        </div>
      </a-modal>

    </div>

    <div class="content">
      <div class="group-name">
        {{$props.info.name}}
      </div>
      <div class="des">
        {{$props.info.description}}  
      </div>
    </div>
  </div>
</template>


<script lang="ts">
export default {
  name: 'groupCard'
}
</script>


<style lang="scss">
#group-card {
  width: 100%;
  aspect-ratio: 2.5;
  position: relative;
  overflow: hidden;
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.2) !important;
  .img {
    // position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // z-index: 1;             
    img {
      position: absolute;
        width: 100%;
        margin: auto;
        min-width: 100%;
    }
  }

  .cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(0, 0, 0, 0.2), transparent 104px), 
                      linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent 70%);
         
  }

  .profile-group {
    position: absolute;
    top: 30px;
    left: 30px;
    display: flex;
    align-items: flex-end;
    .others {
      margin-left: 20px;
      margin-right: 4px;
    }

    .add-group-member {
      cursor: pointer;
    }

  }
  .content {
    position: absolute;
    bottom: 0;
    padding: 30px;
    color: #fff;
    .group-name {
      font-size: 28px;
    }
    .des {
      margin-top: 5px;
      font-size: 16px;
      width: 80%;
    }
  }
}

#search {
  .content {
    height: 340px;
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
      .header {
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

