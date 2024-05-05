<template>
    <a-button type="primary" style="background-color: #bacd9e; margin-right: 10px;" @click="show=true">
        <template #icon>
          <icon-plus />
        </template>
    </a-button>

    <van-dialog v-model:show="show" title="members" show-cancel-button> 
        <div style="padding: 10px;">
            <div>

            </div>
            <a-divider/>
            <div>
                <van-cell-group inset>
                    <van-field v-model="searchName" label="name" placeholder="fillter" />
                </van-cell-group>
            </div>
        </div>
    </van-dialog>
</template>


<script setup lang="ts">
import type { GroupRecord } from '@/apis/group';
import { computed, ref } from 'vue';

const props = defineProps<{
  info: GroupRecord,
  isCreated: number
}>()

const show = ref(false)
const searchName = ref<string>('')

const leader = computed(() => props.info.members.find((user) => user.id === props.info.leaderId)) 

const others = computed(() => props.info.members.filter((user) => user.id !== props.info.leaderId))

</script>

