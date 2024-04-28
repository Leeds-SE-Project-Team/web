<template>
    <section id="group-index" class="flex-c">
        <div class="cover">
            <van-image
                :width="'100%'"
                :src="'//fp1.fghrsh.net/2024/02/20/81b61a2ccb2ad52ade592a9ac18e55b9.jpg'"
                :fit="'cover'"
             />
        </div>
        <div class="group-name flex-r flex-justify-c">
            <h2>Group</h2>
        </div>
        <div class="group-des flex-r flex-justify-c">
            <div>230420349820934820934802948092384</div>
        </div>
        <div class="leader flex-c">
            <div class="label flex-r flex-justify-c">
                <label>Group Leader</label>
            </div>
            <div class="leader-info flex-r flex-justify-c">
                <div class="flex-c flex-justify-c">
                    <div class="flex-r flex-justify-c">
                        <van-image :height="50" :width="50" fit="cover" :src="ava"/>
                    </div>
                    <div class="flex-r flex-justify-c">
                        <span>Username</span>
                    </div>
                </div>
            </div>
        </div>
        <van-collapse v-model="activeName">
            <van-collapse-item title="Members" name="1">
                <div class="member-info flex-r flex-justify-c">
                    <div class="flex-c flex-justify-c" style="width: 60px;">
                        <div class="flex-r flex-justify-c">
                            <van-image :src="ava" :height="45" :width="45" />
                        </div>
                        <div class="flex-r flex-justify-c">
                            <span>Leader</span>
                        </div>
                    </div>
                    <div class="flex-c flex-justify-c" style="width: 60px;">
                        <div class="flex-r flex-justify-c">
                            <van-image :src="ava" :height="45" :width="45" />
                        </div>
                        <div class="flex-r flex-justify-c">
                            <span>Leader</span>
                        </div>
                    </div>
                    <div class="flex-c flex-justify-c" style="width: 60px;">
                        <div class="flex-r flex-justify-c">
                            <van-image :src="ava" :height="45" :width="45" />
                        </div>
                        <div class="flex-r flex-justify-c">
                            <span>Leader</span>
                        </div>
                    </div>
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
import ava from 'C:\\Users\\ltj16\\Desktop\\图\\100226644_p0.jpg'

const activeName = ref([])
</script>