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
            <h3 :id="collection.id.toString()">{{collection.name}}</h3>
            <a-divider :size="4" />
            
            <div class="card" v-for="tour in collection.tours" :key="tour.id">
              <tourCard :info="tour"></tourCard>
            </div>
        
            <div v-if="!collection.tours.length" class="no">
              No exist planned tours
            </div>
        </div>
    </div>
    
    <a-affix class="affix">
      <a-anchor class="anchor" :style="{backgroundColor: 'var(--color-bg-1)'}" :line-less="true">
        <a-anchor-link 
          v-for="collection in myCollections"
          :key="collection.id"
          :href="'#' + collection.id.toString()"
          class="item"
          >
          {{collection.name}}
        </a-anchor-link>

        <div class="create-btn">
          <icon-plus-circle-fill />CREATE
        </div>
      </a-anchor>
    </a-affix>
</template>

<script lang="ts">
export default {
  name: 'personalCollections'
}
</script>


<style lang="scss">

.affix {
  position: absolute;
  margin-top: calc(50vh);
  right: 0;
  top: 0;
  .anchor {
    border-radius: 10px;
  }
  .create-btn {
      font-size: 16px;
      padding: 8px;
      margin-right: 10px;
      color: #5c8429;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
    }
}

#personal-collections {
    
    position: relative;
    overflow: scroll;
    height: calc(100vh - 50px);
    position: relative;
    margin-right: 100px;

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

