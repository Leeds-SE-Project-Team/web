<script lang="ts" setup>
import { getAllUsers, type UserRecord } from '@/apis/user';
import { useAuthStore } from '@/stores/auth';
import message from '@arco-design/web-vue/es/message';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  info: string
}>()

const profile1 = "https://ts1.cn.mm.bing.net/th/id/R-C.fd81516a06ce33c15b194494272fa6e9?rik=XAfnJ6A9NFvAyA&riu=http%3a%2f%2fimg.touxiangwu.com%2fuploads%2fallimg%2f2022053117%2fivhiashhpu1.jpg&ehk=Yi2aDhWvd0rnBKl1xloJy8F1RfGd8%2bcC75k4ff8dVXk%3d&risl=&pid=ImgRaw&r=0"
const profile2 = "https://ts1.cn.mm.bing.net/th/id/R-C.79b0f0a50f0027cca441b67ed950e853?rik=kPgxfrXLzOAq2A&riu=http%3a%2f%2fimg.touxiangwu.com%2fuploads%2fallimg%2f2022053118%2ff1pe3chclkt.jpg&ehk=f8VCRu%2bXHjFSD%2biAxDALRgZR%2b7kBFqdthB5IjIXEXNE%3d&risl=&pid=ImgRaw&r=0"
const profile3 = "https://tupian.qqw21.com/article/UploadPic/2020-3/20203231746425555.jpg"
const imgUrl = "https://img95.699pic.com/photo/50018/0915.jpg_wh860.jpg"

console.log(props.info)

// this is the logic of add group member form
const visible = ref(false);

const handleClick = () => {
  visible.value = true;
};

const handleOk = () => {
  if(!choosedId.value) {
    message.warning('Add failed, you did not choose group member')
    return 
  }

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
    return users.value; // 如果输入字段为空，则返回完整的用户列表
    // return ''
  } else {
    // 使用 filter 方法过滤用户列表
    return users.value?.filter((user) => {
      return user.nickname.includes(inputName.value);
    });
  }
})

const choosedId = ref<number>()

</script>


<template>
  <div id="group-card">

    <div class="img">
      <img :src="imgUrl" alt="">
    </div>

    <div class="cover"></div>

    <div class="profile-group">
      <a-avatar class="leader" trigger-type="mask" :size="44">
        <img alt="avatar" :src="profile1"/>
      </a-avatar>
      <a-space class="others" :size="34">
          <a-avatar-group>
              <a-avatar :size="34" trigger-type="mask" v-for="user in Array(2)" :key="user">
                <img alt="avatar" :src="profile2"/>
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
                console.log(item.id)
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
        We Are BTM Group
      </div>
      <div class="des">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus eos alias culpa commodi fugiat repudiandae corporis explicabo neque magni molestias consequatur suscipit, obcaecati inventore, quod aspernatur debitis perspiciatis exercitationem provident?
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
        }
      }
    }
  }
}

</style>

