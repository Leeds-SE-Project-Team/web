<template>
    <section style="margin-top: 2rem;">
        <van-cell-group inset class="flex-c" style="background-color: transparent;">
            <van-field label="用户名" placeholder="请输入用户名" readonly right-icon="edit"/>
            <van-field label="密码" placeholder="请输入新密码" readonly/>
            <van-field label="用户名" placeholder="请输入用户名" />
            <van-field label="用户名" placeholder="请输入用户名" />
            <van-field label="用户名" placeholder="请输入用户名" />
        </van-cell-group>
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
:deep(.van-cell){
    background-color: transparent;
    margin: 0.5rem 0;
}
</style>