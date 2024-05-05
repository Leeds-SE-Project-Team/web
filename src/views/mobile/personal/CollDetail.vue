<template>
    <section id="collection-detail" >
        <van-list>
            <div
                v-for="item in collections"
                :key="item.id"
                class="collection flex-r"
                @click="toCollection(item.id)"
            >
                <van-image width="100" height="100" :src="item.coverUrl"/>
                <div class="collection-info flex-c flex-justify-c">
                    <div class="info-title">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </van-list>
        <div class="flex-r flex-justify-c" style="padding: 1rem;">
            <van-button round type="success" @click="showCreate = true">New Collection</van-button>
        </div>
        <van-dialog v-model:show="showCreate" title="New Collection" show-cancel-button :beforeClose="beforeClose">
            <van-form ref="theForm" >
                <van-field
                    label="Cover"
                    class="avatar"
                    required
                    :rules="[{validator: fileValidate}]"
                >
                    <template #input>
                        <van-uploader v-model="fileList"/>
                    </template>
                </van-field>
                <van-field
                    label="Name"
                    placeholder="请输入组名"
                    required
                    :rules="[{required:true, message: 'need name'}]"
                    v-model="collectionForm.name"
                />
                <van-field
                    label="Description"
                    placeholder="请输入描述"
                    autosize
                    required
                    :rules="[{required: true, message: 'need description'}]"
                    v-model="collectionForm.description"
                />
            </van-form>
        </van-dialog>
    </section>
</template>

<script setup lang="ts">
import type { ApiResponse } from '@/apis';
import { createCollection, getCollectionByUser, type TourCollection } from '@/apis/collection';
import { uploadFileFromURL } from '@/utils/file';
import { Message } from '@arco-design/web-vue';
import type { UploaderFileListItem } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const collections = ref<TourCollection[]>([])
const router = useRouter();
const showCreate = ref(false);
const fileList = ref<UploaderFileListItem[]>([])
const collectionForm = ref({
    name: '',
    description: '',
    coverUrl: '',
    title: ''
})
const theForm = ref()

const fileValidate = ()=>{
    if(fileList.value.length!==1){
        return "Upload one cover image"
    }
    return true;
}
const toCollection = (id: number)=>{
    router.push({path:'/collection', query:{id}})
}

const beforeClose = (action: string):Promise<boolean>=>
  new Promise((resolve)=>{
    if(action === "cancel"){
        return resolve(true);
    }
    if(!theForm.value){
        resolve(false);
        return;
    }
    theForm.value.validate().then((res:any)=>{
        createCollection(collectionForm.value).then(res=>{
            if(!res.success){
                Message.info(res.message);
            }
            console.log(res)
            return res.data?.id
        }).then((res) =>{
            if(!res){resolve(false);return;}
            if(!fileList.value[0].objectUrl){
                return resolve(false);
            }
            uploadFileFromURL(
                fileList.value[0].objectUrl,
                `/collection/${res}`,
                fileList.value[0].file?.name
            ).then(url=>{
                if(url.success){
                    resolve(true)
                    return;
                }
            })
        })
    }).catch((e:any)=>{
        console.log(e)
        return resolve(false)
        
    })
  })

getCollectionByUser().then(res=>{
    if(res.success){
        console.log(res);
        collections.value = res.data!
    }
})
</script>