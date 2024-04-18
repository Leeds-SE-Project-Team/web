<template>
    <section id="tour-detail">
        <van-tabs style="background-color: transparent;">
            <van-tab title="Completed">
                <van-list>
                    <div class="completed-tour flex-r">
                        <van-image width="100" height="100" src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"/>
                        <div class="tour-info flex-c flex-justify-c">
                            <div class="info-title">
                                Title
                            </div>
                            <div class="info-time flex-r">
                                <van-icon name="completed-o" />
                                <span>2022-22-2-2</span>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-tab>
            <van-tab title="Planned">内容 2</van-tab>
        </van-tabs>
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
:deep(.van-tabs__line){
    background: green;
}
:deep(.van-tabs__nav){
    background: transparent;
}
:deep(.van-tabs__content){
    height: calc(100vh - 44px - 88px);
    overflow: auto;
}
</style>