<script lang="ts" setup>
import {
  createCollection,
  getCollectionByUser,
  getTourCollectionsByCurUser,
  type TourCollection
} from '@/apis/collection'
import tourCard from './cards/tourCard.vue'
import { ref } from 'vue'
import { uploadFileFromURL } from '@/utils/file'
import { Message } from '@arco-design/web-vue'
import type { UploaderFileListItem } from 'vant'
import { useRouter } from 'vue-router'

const myCollections = ref<TourCollection[]>([])

getTourCollectionsByCurUser().then((res) => {
  myCollections.value = res.data as TourCollection[]
})

// new collection dialog -------------->
const visible = ref(false)

const handleClick = () => {
  visible.value = true
}

const handleCancel = () => {
  visible.value = false
}

// new collection -------------->
const collections = ref<TourCollection[]>([])
const router = useRouter()
const showCreate = ref(false)
const fileList = ref<UploaderFileListItem[]>([])
const collectionForm = ref({
  name: '',
  description: '',
  coverUrl: '',
  title: ''
})
const theForm = ref()

const fileValidate = () => {
  if (fileList.value.length !== 1) {
    return 'Upload one cover image'
  }
  return true
}

const toCollection = (id: number) => {
  router.push({ path: '/collection', query: { id } })
}

const beforeClose = (action: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (action === 'cancel') {
      return resolve(true)
    }
    if (!theForm.value) {
      resolve(false)
      return
    }
    theForm.value
      .validate()
      .then((res: any) => {
        if (res) {
          resolve(false)
          return
        }
        createCollection(collectionForm.value)
          .then((res) => {
            if (!res.success) {
              Message.info(res.message)
            }
            getCollections()
            return res.data?.id
          })
          .then((res) => {
            if (!res) {
              resolve(false)
              return
            }
            if (!fileList.value[0].objectUrl) {
              return resolve(false)
            }
            uploadFileFromURL(
              fileList.value[0].objectUrl,
              `/collection/${res}`,
              fileList.value[0].file?.name
            ).then((url) => {
              if (url.success) {
                resolve(true)
                return
              }
            })
          })
      })
      .catch((e: any) => {
        console.log(e)
        return resolve(false)
      })
  })

const getCollections = () => {
  getCollectionByUser().then((res) => {
    if (res.success) {
      console.log(res)
      collections.value = res.data!
    }
  })
  getTourCollectionsByCurUser().then((res) => {
    myCollections.value = res.data as TourCollection[]
  })
}

getCollections()
</script>

<template>
  <div id="personal-collections">
    <div v-for="collection in myCollections" :key="collection.id" class="my-collections">
      <span :id="collection.id.toString()" style="font-size: 20px; font-weight: bold">{{
        collection.name
      }}</span>
      <a-button
        style="float: right; margin-right: 20px; border-radius: 5px; opacity: 0.8"
        type="primary"
        @click="$router.push({ name: 'collection', query: { id: collection.id } })"
        >View Detail
      </a-button>
      <a-divider :size="4" />

      <div v-for="tour in collection.tours" :key="tour.id" class="card">
        <tourCard :info="tour"></tourCard>
      </div>

      <div v-if="!collection.tours.length" class="no">No exist planned tours</div>
    </div>
  </div>

  <a-affix class="affix">
    <a-anchor :line-less="true" :style="{ backgroundColor: 'var(--color-bg-1)' }" class="anchor">
      <a-anchor-link
        v-for="collection in myCollections"
        :key="collection.id"
        :href="'#' + collection.id.toString()"
        class="item"
      >
        {{ collection.name }}
      </a-anchor-link>
      <div class="create-btn" @click="handleClick">
        <icon-plus-circle-fill />
        CREATE
      </div>

      <a-modal
        v-model:visible="visible"
        :on-before-ok="() => beforeClose('confirm')"
        title="Modal Form"
        @cancel="handleCancel"
      >
        <a-form ref="theForm" :model="collectionForm">
          <a-form-item :rules="[{ validator: fileValidate }]" class="av" label="Cover" required>
            <van-uploader v-model="fileList" />
          </a-form-item>
          <a-form-item
            :rules="[{ required: true, message: 'need name' }]"
            field="name"
            label="Name"
            required
          >
            <a-input v-model="collectionForm.name" />
          </a-form-item>
          <a-form-item
            :rules="[{ required: true, message: 'need description' }]"
            field="description"
            label="Des"
            required
          >
            <a-textarea v-model="collectionForm.description" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-anchor>
  </a-affix>
</template>

<script lang="ts">
export default {
  name: 'personalCollections'
}
</script>

<style lang="scss">
.affix {
  position: absolute;
  margin-top: calc(40vh);
  right: 0;
  top: 0;

  .anchor {
    border-radius: 10px;
  }

  .create-btn {
    font-size: 16px;
    padding: 8px;
    margin-right: 10px;
    color: #5c8429;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
  }
}

#personal-collections {
  position: relative;
  overflow: scroll;
  height: calc(100vh - 50px);
  position: relative;
  margin-right: 100px;

  .my-collections {
    border-radius: 10px;
    margin: 40px 0;
    padding: 30px;
    background-color: #fff;

    h3 {
      font-size: 26px;
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
</style>
