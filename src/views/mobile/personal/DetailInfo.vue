<template>
    <section style="margin-top: 2rem;">
        <van-form ref="theForm">
            <van-cell-group v-if="user" inset class="flex-c" style="background-color: transparent;">
                <van-field
                    label="头像"
                    class="personal-avatar"
                    @click="console.log(file)"
                >
                    <template #input>
                        <van-uploader v-model="file" :show-upload="file.length<1" />
                    </template>
                </van-field>
                <van-field
                    label="用户名"
                    placeholder="请输入用户名"
                    :readonly="!statusArray[0]"
                    :right-icon="statusArray[0]?'sign':'edit'"
                    v-model="user.nickname"
                    @click-right-icon="changeInput(0)"
                    :rules="[{required: true, message: '请输入用户名'}]"
                />
                <van-field
                    label="旧密码"
                    placeholder="请输入旧密码"
                    v-model="pwdStruct.old"
                    type="password"
                />
                <van-field
                    label="新密码"
                    v-model="pwdStruct.new"
                    placeholder="请输入新密码"
                    type="password"
                />
                <van-field
                    label="确认新密码"
                    v-model="pwdStruct.renew"
                    placeholder="请输入确认新密码"
                    :rules="[{validator: pwdValidate}]"
                    type="password"
                />
                <van-field
                    label="邮箱"
                    placeholder="请输入邮箱"
                    :readonly="!statusArray[1]"
                    :right-icon="statusArray[1]?'sign':'edit'"
                    v-model="user.email"
                    @click-right-icon="changeInput(1)"
                    :rules="[{required: true, message:'请输入邮箱'}]"
                />
                <van-field
                    label="Age"
                    placeholder="Enter Age"
                    :readonly="!statusArray[2]"
                    :right-icon="statusArray[2]?'sign':'edit'"
                    @click-right-icon="changeInput(2)"
                    v-model="user.age"
                />
                <van-field
                    label="Gender"
                    placeholder="Enter Gender"
                >
                    <template #input>
                        <van-radio-group v-model="user.gender" direction="horizontal">
                            <van-radio name="Male">Male</van-radio>
                            <van-radio name="Famale">Famale</van-radio>
                        </van-radio-group>
                    </template>
                    
                </van-field>
                <van-field
                    label="Height"
                    placeholder="Enter Height"
                    :readonly="!statusArray[4]"
                    :right-icon="statusArray[4]?'sign':'edit'"
                    @click-right-icon="changeInput(4)"
                    v-model="user.height"
                />
                <van-field
                    label="Weight"
                    placeholder="Enter Weight"
                    :readonly="!statusArray[5]"
                    :right-icon="statusArray[5]?'sign':'edit'"
                    @click-right-icon="changeInput(5)"
                    v-model="user.weight"
                />
                <van-button @click="formSubmit">submit</van-button>
            </van-cell-group>
        </van-form>
    </section>
</template>

<script setup lang="ts">
import type { UserRecord } from '@/apis/user';
import { useUserStore } from '@/stores/user';
import { Message } from '@arco-design/web-vue';
import { reactive, ref, onMounted } from 'vue';
import { updateUser } from '@/apis/user/index';
import { uploadFileFromURL } from '@/utils/file'
import type { UploaderFileListItem } from 'vant';
import router from '@/router';
import { cloneDeep } from 'lodash-es';
import { MD5 } from 'crypto-js';

const user = ref<UserRecord | undefined>();
const file = ref<UploaderFileListItem[]>([]);
const theForm = ref();
const statusArray = ref<boolean[]>(new Array(10).fill(false));
const pwdStruct = reactive({
    old: '',
    new: '',
    renew: '',
})
const userStore = useUserStore();

const pwdValidate = ()=>{
    if(pwdStruct.old=='' && pwdStruct.new!=''){
        return "请输入旧密码"
    }else if(pwdStruct.new==''){
        return true
    }else if(pwdStruct.renew!=pwdStruct.new){
        return "请输入相同密码"
    }
    return true;
}

const formSubmit = ()=>{
    theForm.value.validate().then(()=>{
        if(!user.value){ return; }
        const form = {
            ...user.value,
            oldPassword: pwdStruct.old===''?null:MD5(pwdStruct.old).toString(),
            newPassword: pwdStruct.new===''?null:MD5(pwdStruct.new).toString(),
        }
        console.log(form)
        if(file.value.length==1){
            uploadFileFromURL(
                file.value[0].objectUrl as string,
                `/user/${user.value.id}/avatar`,
            ).then(res=>{
                if(res.success){
                    return res.data as string;
                }else{
                    Message.info(res.message)
                    return 'no'
                }
            }).then(res=>{
                if(res==='no'){return;}
                form.avatar = import.meta.env.APP_STATIC_URL+res;
                console.log(res)
                updateUser(form).then(res=>{
                    if(res.success){
                        Message.info(res.message);
                        userStore.curUser = res.data!
                        router.replace({path:'/personal',query:{status: 'refresh'}})
                    }else{
                        Message.info(res.message);
                    }
                })
            }).catch(e=>{
                Message.error(e)
            })
        }
        updateUser(form).then(res=>{
            if(res.success){
                Message.info(res.message);
            }else{
                Message.info(res.message);
            }
        }).catch(e=>{
            Message.error(e)
        })
    }).catch((e:any)=>{
        console.log(e);
    })
}

const changeInput = (i:number)=>{
    statusArray.value[i] = !statusArray.value[i];
}
onMounted(()=>{
    userStore.getUserRecord().then(res=>{
        console.log(res)
        user.value = res;
    }).catch(e=>{
        Message.info(e);
    })
})
</script>

<style scoped>
:deep(.van-cell){
    background-color: transparent;
    margin: 0.5rem 0;
}
.personal-avatar :deep(.van-field__label){
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>