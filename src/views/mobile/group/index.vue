<template>
    <section id="group-index" class="flex-c">
        <div class="cover">
            <van-image
                :width="'100%'"
                :src="''"
                :fit="'cover'"
             />
        </div>
        <div class="group-name flex-r flex-justify-c">
            <span>Group</span>
        </div>
        <div class="group-des flex-r flex-justify-c">
            <div>230420349820934820934802948092384</div>
        </div>
        <div class="leader flex-c">
            <div class="label flex-r flex-justify-c">
                <label>Leader</label>
            </div>
            <div class="leader-info flex-r flex-justify-c">
                <van-image />
                <span>Leader</span>
            </div>
        </div>
        <van-collapse v-model="activeName">
            <van-collapse-item title="Members" name="1">
                <div class="leader-info flex-r flex-justify-c">
                    <van-image />
                    <span>Leader</span>
                </div>
            </van-collapse-item>
            <van-collapse-item title="Collections" name="2">
                <div
                    class="collection flex-r"
                >
                    <van-image width="100" height="100" :src="''"/>
                    <div class="collection-info flex-c flex-justify-c">
                        <div class="info-title">
                            234
                        </div>
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse>
    </section>
</template>

<script lang="ts">
export default {
    name: 'GroupIndex'
}
</script>

<script setup lang="ts">
import { ref } from 'vue';

const activeName = ref([])
</script>