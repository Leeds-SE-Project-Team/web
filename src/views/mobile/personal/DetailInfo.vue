<template>
    <section style="margin-top: 2rem;">
        <van-form ref="theForm">
            <van-cell-group v-if="user" inset class="flex-c" style="background-color: transparent;">
                <van-field
                    label="头像"
                    class="avatar"
                >
                    <template #input>
                        <van-uploader v-model="file"/>
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
                />
                <van-field
                    label="确认新密码"
                    v-model="pwdStruct.renew"
                    placeholder="请输入确认新密码"
                    :rules="[{validator: pwdValidate}]"
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

const user = ref<UserRecord | undefined>();
const file = ref();
const theForm = ref();
const statusArray = ref<boolean[]>([false,false]);
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
            nickname: user.value.nickname,
            avatar: user.value.avatar,
            email: user.value.email
        }
        updateUser(form).then(res=>{
            if(res.success){
                Message.info(res.message);
            }else{
                Message.info(res.message);
            }
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
.avatar :deep(.van-field__label){
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>