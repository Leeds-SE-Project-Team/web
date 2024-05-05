<script lang="ts" setup>
import { getTourCollectionsByCurUser, type TourCollection } from '@/apis/collection';
import tourCard from './cards/tourCard.vue';
import { ref } from 'vue';

const myCollections = ref<TourCollection[]>([])

getTourCollectionsByCurUser()
    .then((res) => {
        myCollections.value = res.data as TourCollection[]
    })

</script>

<template>
    <div id="personal-collections">
        
        <div class="my-collections" v-for="collection in myCollections" :key="collection.id">
            <h3>{{collection.name}}</h3>
            <a-divider :size="4" />
            
            <div class="card" v-for="tour in collection.tours" :key="tour.id">
              <tourCard :info="tour"></tourCard>
            </div>
        
            <div v-if="!collection.tours.length" class="no">
              No exist planned tours
            </div>
        </div>

    </div>
</template>

<script lang="ts">
export default {
  name: 'personalCollections'
}
</script>


<style lang="scss">
#personal-collections {
    
    position: relative;
    overflow: scroll;
    height: calc(100vh - 50px);
    position: relative;

    .my-collections {
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

