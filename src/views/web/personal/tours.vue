<script lang="ts" setup>
import { ref } from 'vue';
import tourCard from './cards/tourCard.vue';
import { useUserStore } from '@/stores/user';
// import { onMounted } from 'vue';

const userId = useUserStore().curUser?.id

const cardInfo = ref("info to card")
</script>

<template>
  <div id="personal-tours">

      <!-- planned tours -->
      <!-- <div class="planned-tours">
        <h3>Planned Tours</h3>
        <a-divider :size="4" />

        <div class="card">
          <tourCard :info="cardInfo"></tourCard>
        </div>
        
        <div class="card">
          <tourCard :info="cardInfo"></tourCard>
        </div>
      </div> -->

      <!-- completed tours -->
      <div class="completed-tours">
        <h3>Completed Tours</h3>
        <a-divider :size="4" />

        <div class="card">
          <tourCard :info="cardInfo"></tourCard>
        </div>
        
        <div class="card">
          <tourCard :info="cardInfo"></tourCard>
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

  .planned-tours, .completed-tours {
    margin: 40px 0;
    padding: 30px;
    background-color: #fff;
    h3 {
      font-size: 26px;
    }

    .card{
      padding: 24px 0;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}
</style>