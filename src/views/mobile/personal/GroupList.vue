<template>
    <section id="personal-group" class="flex-c">
        <van-search placeholder="请输入搜索关键词" @focus="showSearch=true" @blur="showSearch=false" />
        <van-list>
            <van-cell @click="createGroup" >
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
                    <div class="list-group flex-r" >
                        <van-image style="flex: 1; max-height: 100px;" :src="'//fp1.fghrsh.net/2020/01/12/1e8c4232da6be35942f6ecd630797f60.jpg'" fit="cover"/>
                        <div class="group-info flex-c flex-justify-c" >
                            <div class="info-title" >
                                Group
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-collapse-item>
            <van-collapse-item title="My Joined" name="2">
                <van-list>
                    <div class="list-group flex-r" >
                        <van-image style="flex: 1; max-height: 100px;" :src="''"/>
                        <div class="group-info flex-c flex-justify-c" >
                            <div class="info-title" >
                                Group
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-collapse-item>
        </van-collapse>
        <van-dialog v-model:show="showCreate" title="New Group" show-cancel-button :beforeClose="beforeClose">
            <van-form>
                <van-field
                    label="封面"
                    class="avatar"
                >
                    <template #input>
                        <van-uploader v-model="fileList" multiple />
                    </template>
                </van-field>
                <van-field label="名称" placeholder="请输入组名" />
                <van-field label="描述" placeholder="请输入描述" autosize />
            </van-form>
        </van-dialog>
    </section>

</template>

<script setup lang="ts">
import type { UploaderFileListItem } from 'vant';
import type { Interceptor } from 'vant/lib/utils';
import { ref } from 'vue';

const activeNames = ref([])
const showSearch = ref(false);
const showCreate = ref(false);
const fileList = ref<UploaderFileListItem[]>([])
const createGroup = ()=>{
    showCreate.value = true;
}
const beforeClose: Interceptor = (action:string)=>{
    
}
</script>