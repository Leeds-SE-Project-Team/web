<script lang="ts" setup>
const props = defineProps<{
  info: string
}>()

console.log(props.info)

</script>


<template>
    <div id="tour-card">
        <div class="card-pic">111</div>
        <div class="card-content">
            <div class="card-title">
                this is
            </div>
            <div class="card-detail">
                <span class="hard">Easy</span>
                <span><icon-clock-circle/>1:16</span>
                <span><icon-double-right/>4.63km</span>
                <span><icon-thunderbolt/>3.7km/h</span>
                <span><icon-up/>70m</span>
                <span><icon-down/>70m</span>
            </div>
            <div class="card-time">
                April 18, 2024
            </div>
        </div>

        <div class="delete">Delete</div>
    </div>
</template>


<script lang="ts">
export default {
  name: 'tourCard'
}
</script>


<style lang="scss">
#tour-card {
    width: 100%;
    height: 96px;
    display: flex;
    position: relative;
    .card-pic {
        height: 96px;
        width: 96px;
        background-color: #9f5d5d;
        margin-right: 24px;
    }

    .card-content {
        .card-title {   
            font-size: 21px;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .card-detail {
            height: 24px;
            display: flex;
            align-items: center;
            font-weight: 600;
            gap: 18px;
            letter-spacing: 0.8px;
            .hard {
                padding: 4px 6px;
                border-radius: 3px;
                background-color: #5078ad;
                color: #fff;
                font-weight: 600;
            }
        }
        .card-time {
            color: #666666;
            font-size: 16px;
            margin-top: 22px;
        }
    }

    .delete {
        position: absolute;
        font-size: 16px;
        bottom: 0px;
        right: 0px;
        color: #666666;

    }
}
</style>

