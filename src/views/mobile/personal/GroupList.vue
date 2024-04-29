<template>
    <section id="personal-group" class="flex-c">
        <van-search placeholder="请输入搜索关键词" @focus="showSearch=true" @blur="showSearch=false" />
        <van-list>
            <van-cell @click="createGroupM" >
                <div class="flex-r list-text">
                    <span>Create Group</span>
                </div>
                <template #right-icon>
                    <van-icon :size="24" name="arrow" />
                </template>
            </van-cell>
        </van-list>
        <van-collapse v-if="!showSearch" v-model="activeNames">
            <van-collapse-item title="My Created" name="1">
                <van-list>
                    <div
                        class="list-group flex-r"
                        v-for="item in myGroup"
                        :key="item.id"
                        style="margin: 0.5rem 0;"
                    >
                        <van-image style="flex: 1; max-height: 100px;" :src="item.coverUrl" fit="cover"/>
                        <div class="group-info flex-c flex-justify-c" >
                            <div class="info-title" >
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-collapse-item>
            <van-collapse-item title="My Joined" name="2">
                <van-list>
                    <div
                        class="list-group flex-r"
                        v-for="item in joinedGroup"
                        :key="item.id"
                        style="margin: 0.5rem 0;"
                    >
                        <van-image style="flex: 1; max-height: 100px;" :src="item.coverUrl" fit="cover"/>
                        <div class="group-info flex-c flex-justify-c" >
                            <div class="info-title" >
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-collapse-item>
        </van-collapse>
        <van-dialog v-model:show="showCreate" title="New Group" show-cancel-button :beforeClose="beforeClose">
            <van-form ref="groupForm" >
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
                    v-model="groupUpload.name"
                />
                <van-field
                    label="Description"
                    placeholder="请输入描述"
                    autosize
                    required
                    :rules="[{required: true, message: 'need description'}]"
                    v-model="groupUpload.description"
                />
            </van-form>
        </van-dialog>
    </section>

</template>

<script setup lang="ts">
import { getAllCreatedGroupsByUser, updateGroup, type GroupRecord, getAllJoinedGroupsByUser } from '@/apis/group';
import { createGroup, type CreateGroupForm } from '@/apis/group';
import { uploadFileFromURL } from '@/utils/file';
import { Message } from '@arco-design/web-vue';
import type { UploaderFileListItem } from 'vant';
import type { Interceptor } from 'vant/lib/utils';
import { ref } from 'vue';

const activeNames = ref([])
const showSearch = ref(false);
const showCreate = ref(false);
const fileList = ref<UploaderFileListItem[]>([])
const groupForm = ref()
const myGroup = ref<GroupRecord[]>([])
const joinedGroup = ref<GroupRecord[]>([])
const groupUpload = ref<CreateGroupForm>({
    name: '',
    description: '',
    coverUrl: ''
})
const fileValidate = ()=>{
    if(fileList.value.length!==1){
        return "Upload one cover image"
    }
    return true;
}
const createGroupM = ()=>{
    showCreate.value = true;
}

getAllCreatedGroupsByUser().then(res=>{
    if(res.success){
        myGroup.value = res.data!
    }
})

getAllJoinedGroupsByUser().then(res=>{
    if(res.success){
        joinedGroup.value = res.data!
    }
})

const beforeClose: Interceptor = async (action:string)=>{
    let flag = false;
    if(action==='cancel'){
        groupForm.value.resetValidation()
        return true;
    }
    try {
        await groupForm.value.validate()
        const groupDTO = await createGroup(groupUpload.value)
        if(!groupDTO.success){Message.info(groupDTO.message); throw groupDTO.message;}
        const upFileRes = await uploadFileFromURL(
            fileList.value[0].objectUrl as string,
            `/group/${groupDTO.data?.id}`
        )
        if(!upFileRes.success){Message.info(upFileRes.message); throw upFileRes.message;}
        const thisGroup = groupDTO.data!
        console.log(groupDTO.data)
        const end = await updateGroup({
            groupId: thisGroup.id,
            name: thisGroup.name,
            coverUrl: import.meta.env.APP_STATIC_URL+upFileRes.data!,
            leaderId: thisGroup.leaderId,
            description: thisGroup.description
        })
        if(!end.success){Message.info(end.message); throw end.message;}
        Message.success("Create Success")
    } catch (error) {
        console.log(error)
        flag = true;
    }
    if(flag){return false;}
    // createGroup(groupUpload.value).then(res=>{
    //     if(!res.success){
    //         Message.info(res.message)
    //     }
    //     uploadFileFromURL(
    //         fileList.value[0].objectUrl as string,
    //         `/group/${res.data?.id}`
    //     ).then(url=>{
    //         res.data!.coverUrl = url.data!
    //         updateGroup(res.data!).then(end=>{
    //             if(!end.success){
    //                 Message.info(end.message);
    //                 flag = true
    //             }
    //             Message.success("Create Success")
    //         })
    //     }).catch(e=>{
    //         Message.error(e);
    //     })
    // })
    console.log(fileList.value[0])
    console.log(groupUpload.value)
    return true;
}
</script>