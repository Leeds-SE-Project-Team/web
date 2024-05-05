<script lang="ts" setup>
import type { TourRecord } from '@/apis/tour';
import router from '@/router';

const props = defineProps<{
    info: TourRecord
}>()

console.log(props.info)

const redirectToRoute = () => {
    router.push(`/tour?id=${props.info.id}`);
}

</script>


<template>
    <div id="tour-card" @click="redirectToRoute">
        <div class="card-pic">
            <img :src="$props.info.mapUrl" alt="">
        </div>
        <div class="card-content">
            <div class="card-title">
                {{ $props.info.title }}
            </div>
            <div class="card-detail">
                <span class="hard">Easy</span>
                <span><icon-clock-circle />{{ $props.info.tourRecordData?.timeTaken.toFixed(2) }} mins</span>
                <span><icon-clock-circle />{{ $props.info.tourRecordData?.timeInMotion.toFixed(2) }} mins</span>
                <span><icon-double-right />{{ $props.info.tourRecordData?.totalDistance.toFixed(2) }} km</span>
                <span><icon-thunderbolt />{{ $props.info.tourRecordData?.avgSpeed.toFixed(2) }} km/h</span>
                <span><icon-up />{{ $props.info.tourRecordData?.calorie.toFixed(2) }} calorie</span>
            </div>
            <div class="card-time">
                {{ $props.info.createTime }}
            </div>
        </div>

        <!-- <div class="delete">Delete</div> -->
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
    cursor: pointer;

    .card-pic {
        height: 96px;
        width: 96px;
        background-color: #9f5d5d;
        border-radius: 5px;
        margin-right: 24px;
        overflow: hidden;

        img {
            height: 96px;
            width: 96px;
            scale: 1.6;
        }
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
