<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import tourCard from './cards/tourCard.vue';
import { useUserStore } from '@/stores/user';
import { getTourByUser, type TourRecord } from '@/apis/tour';
// import { onMounted } from 'vue';

const userId = useUserStore().curUser?.id

const tours = ref<TourRecord[]>()

onMounted(async () => {
  await getTourByUser()
    .then((res) => {
      if (res.success) {
        tours.value = res.data
      }
    })
})

const plannedTours = computed(() => tours.value?.filter((tour) => tour.state === 0))
const ongoingTours = computed(() => tours.value?.filter((tour) => tour.state === 1))
const completedTours = computed(() => tours.value?.filter((tour) => tour.state === 2))

</script>

<template>
  <div id="personal-tours">

    <!-- ongoing tours -->
    <div class="planned-tours">
      <h3>Ongoing Tours</h3>
      <a-divider :size="4" />

      <div class="card" v-for="tour in ongoingTours" :key="tour.id">
        <tourCard :info="tour"></tourCard>
      </div>

      <div v-if="!ongoingTours?.length" class="no">
        No exist ongoing tours
      </div>

    </div>

    <!-- planned tours -->
    <div class="planned-tours">
      <h3>Planned Tours</h3>
      <a-divider :size="4" />

      <div class="card" v-for="tour in plannedTours" :key="tour.id">
        <tourCard :info="tour"></tourCard>
      </div>

      <div v-if="!plannedTours?.length" class="no">
        No exist ongoing tours
      </div>
    </div>

    <!-- completed tours -->
    <div class="completed-tours">
      <h3>Completed Tours</h3>
      <a-divider :size="4" />

      <div class="card" v-for="tour in completedTours" :key="tour.id">
        <tourCard :info="tour"></tourCard>
      </div>

      <div v-if="!completedTours?.length" class="no">
        No exist ongoing tours
      </div>
    </div>

  </div>
</template>


<script lang="ts">
export default {
  name: 'personalTours'
}
</script>


<style lang="scss">
#personal-tours {
  position: relative;
  overflow: scroll;
  height: calc(100vh - 50px);

  .planned-tours,
  .completed-tours {
    border-radius: 10px;
    margin: 40px 0;
    padding: 30px;
    background-color: #fff;

    h3 {
      font-size: 26px;
    }

    .card {
      padding: 24px 0;
      border-bottom: 1px solid #e5e5e5;
    }

    .no {
      width: 100%;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      color: #818181;
    }
  }
}
</style>