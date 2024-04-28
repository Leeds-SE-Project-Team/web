<script lang="ts" setup>
import { ref } from 'vue';
import groupCard from './cards/groupCard.vue';
import { createGroup, getAllCreatedGroupsByUser, getAllJoinedGroupsByUser, type CreateGroupForm, type GroupRecord } from '@/apis/group';
import { Message, type RequestOption } from '@arco-design/web-vue';
import { uploadFileFromURL } from '@/utils/file';

const createdGroups = ref<GroupRecord[]>()
const jointGroups = ref<GroupRecord[]>()

const getCreatedGroup = () => {
  getAllCreatedGroupsByUser()
    .then((res => {
      if (res.success) {
        createdGroups.value = res.data
        console.log("created", createdGroups.value)
      }
    }))
}

const getJointGroup = () => {
  getAllJoinedGroupsByUser()
    .then((res => {
      if (res.success) {
        jointGroups.value = res.data
        console.log("join", jointGroups.value)
      }
    }))
}

getCreatedGroup()
getJointGroup()

const isCreate = ref(false)

const form = ref<CreateGroupForm>({
  name: '',
  description: '',
  coverUrl: ''
})

const submitForm = async () => {
  if (!form.value.name || !form.value.description) {
    Message.warning("please enter all the form data")
    return
  }

  await createGroup(form.value)
    .then((res) => {
      if (res.success) {
        Message.success(res.message)
        isCreate.value = false
        form.value = {
          name: '',
          description: '',
          coverUrl: ''
        }
      } else {
        Message.warning("create group failed, please create later")
      }
    })
}

const customRequest = (option: RequestOption) => {
  console.log(option)
  if (option.fileItem.url) {
    uploadFileFromURL(option.fileItem.url, `/group/test`, "cover.png").then(res=>{
      console.log(res)
    }).catch(e=>{
      Message.error(e)
    })
  }
  return {}
  // const { onProgress, onError, onSuccess, fileItem, name } = option
  // const xhr = new XMLHttpRequest();
  // if (xhr.upload) {
  //   xhr.upload.onprogress = function (event) {
  //     let percent:any;
  //     if (event.total > 0) {
  //       // 0 ~ 1
  //       percent = event.loaded / event.total;
  //     }
  //     onProgress(percent, event);
  //   };
  // }
  // xhr.onerror = function error(e) {
  //   onError(e);
  // };
  // xhr.onload = function onload() {
  //   if (xhr.status < 200 || xhr.status >= 300) {
  //     return onError(xhr.responseText);
  //   }
  //   onSuccess(xhr.response);
  // };

  // const formData = new FormData();
  // formData.append(name || 'file', fileItem.file);
  // xhr.open('post', '//upload-z2.qbox.me/', true);
  // xhr.send(formData);

  // return {
  //   abort() {
  //     xhr.abort()
  //   }
  // }
};
</script>


<script lang="ts">
export default {
  name: 'personalGroup'
}
</script>

<template>
  <div id="personal-group">
    <!-- planned tours -->
    <div class="my-group">
      <div class="create">
        <h3>My Group</h3>
        <div class="create-btn" @click="isCreate = true">
          <icon-plus-circle-fill />CREATE
        </div>
      </div>
      <a-divider :size="4" />

      <div v-if="isCreate" class="form-part">

        <div class="title">
          create my group
        </div>

        <a-form :model="form">
          <a-form-item field="name" label="Name">
            <a-input v-model="form.name" />
          </a-form-item>
          <a-form-item field="des" label="Description">
            <a-textarea v-model="form.description" placeholder="Please enter something" allow-clear />
          </a-form-item>

          <a-form-item field="url" label="Background url" class="bg-item">
            <a-upload :limit="1" action="" :custom-request="customRequest">
              <template #upload-button>
                <div class="upload-box">
                  <div>
                    <span style="color: #3370FF"> Click to upload</span>
                  </div>
                </div>
              </template>
            </a-upload>
          </a-form-item>
        </a-form>

        <div class="btns">
          <a-button size="large" @click="isCreate = false">cancle</a-button>
          <a-button size="large" @click="submitForm()">submit</a-button>
        </div>
      </div>

      <div class="card" v-for="group in createdGroups" :key="group.id">
        <groupCard @reload="() => {
          console.log('reload created')
          getCreatedGroup()
        }" :info="group"></groupCard>
      </div>
    </div>

    <div class="join-group">
      <h3>Group I joined</h3>
      <a-divider :size="4" />

      <div class="card" v-for="group in jointGroups" :key="group.id">
        <groupCard @reload="() => {
          console.log('reload joint')
          getJointGroup()
        }" :info="group"></groupCard>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
#personal-group {
  position: relative;
  overflow: scroll;
  height: calc(100vh - 50px);

  .my-group,
  .join-group {
    margin: 40px 0;
    padding: 30px;
    background-color: #fff;

    .form-part {
      position: relative;
      width: 100%;
      aspect-ratio: 2.5;
      padding: 12px 12vw 0 4vw;
      border-bottom: 1px solid #e5e5e5;
      box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.2) !important;

      .title {
        width: 100%;
        text-align: center;
        font-size: 24px;
        font-weight: 500;
        color: #505968;
        margin-bottom: 10px;
      }

      .btns {
        position: absolute;
        right: 8vw;
        bottom: 40px;
        display: flex;
        gap: 20px;
      }

      .bg-item {
        margin-top: 0px;
        margin-bottom: 100px;

        .upload-box {
          margin-top: -5px;
          background-color: var(--color-fill-2);
          color: var(--color-text-1);
          border: 1px solid var(--color-fill-4);
          height: 40px;
          width: 120px;
          border-radius: 2;
          line-height: 40px;
          text-align: center;
        }
      }

    }

    .create {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .create-btn {
        font-size: 16px;
        padding: 8px;
        background-color: #ecefe5;
        color: #5c8429;
        border-radius: 8px;
        cursor: pointer;
      }
    }

    h3 {
      font-size: 26px;
    }

    .card {
      padding: 24px 0;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}
</style>
