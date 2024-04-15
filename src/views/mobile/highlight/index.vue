<script lang="ts" setup>
import { getTourHighlightExample, type TourHighlight } from '@/apis/tour/highlight';
import { computed, onMounted, ref } from 'vue';


const highlightData = ref<TourHighlight>();

// this is the len of img

onMounted(() => {
  highlightData.value = getTourHighlightExample(1);
  console.log(highlightData.value.title)
});

</script>

<template>
  <div id="mobile-page-highlight">
    <!-- Image section with click event to open preview -->
    <!-- Image and title section -->
    <div class="image-title-container">
      <img
        class="trail-image"
        :src="highlightData?.tourImages[0]?.imageUrl"
        alt="Trail Image"
      />
      <h1 class="trail-title">{{highlightData?.title}}</h1>
      <p class="trail-description">{{highlightData?.title}} is a famous attraction!</p>
    </div>
    <!-- Top section with image and action buttons -->
    <div class="highlight-top">
      <div class="actions-container">
        <div class="action-item"><i class="icon fas fa-bicycle"></i>See rides here</div>
        <div class="action-item"><i class="icon fas fa-bookmark"></i>Bookmark</div>
        <div class="action-item"><i class="icon fas fa-map-marker-alt"></i>Open in planner</div>
      </div>
    </div>

    <!-- Information section -->
    <div class="information-section">
      <div class="info-alert">
        <i class="icon fas fa-info-circle"></i>
        <span>
          {{highlightData?.title}} is a modern and high-grade teaching building, which won a lot of awards.
        </span>
      </div>
      <div class="info-credits">
        <div class="user-avatars">
          <img src="https://file.wmzspace.space//resource/cover.jpg" alt="User 1" />
          <img src="https://file.wmzspace.space//resource/cover.jpg" alt="User 2" />
        </div>
        <div class="credits-text">
          <span>Created by walcraft users</span>
          <span>Recommended by 2 out of 2 mountain bikers</span>
        </div>
      </div>
    </div>

    <!-- Highlight location section -->
    <div class="highlight-location-section">
      <hr class="section-divider" />
      <h2 class="section-title">HIGHLIGHT LOCATION</h2>
      <div class="location-map-placeholder">
        <img 
          style="width: 100%;height: 100%; 
          object-fit: cover" 
          src="https://file.wmzspace.space//resource/highlight_map.png" 
          alt="">
      </div>
      <div class="location-distance">7,424 mi away</div>
    </div>

    <!-- Rides here section -->
    <div class="rides-here-section">
      <div class="section-header">
        <h2 class="section-title">Rides here</h2>
        <button class="see-all-button">See all</button>
      </div>
      <div class="rides-container">
        <!-- Add v-for here with actual data -->
        <div class="ride-card">
          <div class="ride-level">Expert</div>
          <div class="ride-info">
            <h3>Broad and Narrow Alley</h3>
            <div class="ride-stats">
              <span><i class="fas fa-clock"></i> 2 h 01</span>
              <span><i class="fas fa-ruler-horizontal"></i> 12.2 mi</span>
              <span><i class="fas fa-arrow-up"></i> 1,450 ft</span>
            </div>
            <div class="map-thumbnail">
              <img style="width: 100%;height: 100%; object-fit: cover" src="https://file.wmzspace.space//tour/20/map_screenshot.jpg" alt="">
            </div>
          </div>
        </div>
        <!-- Add more ride-cards here -->
        <div class="ride-card">
          <div class="ride-level">Expert</div>
          <div class="ride-info">
            <h3>Chengdu Giant Panda Base</h3>
            <div class="ride-stats">
              <span><i class="fas fa-clock"></i> 2 h 01</span>
              <span><i class="fas fa-ruler-horizontal"></i> 12.2 mi</span>
              <span><i class="fas fa-arrow-up"></i> 1,450 ft</span>
            </div>
            <div class="map-thumbnail">
              <div class="map-thumbnail">
              <img style="width: 100%;height: 100%; object-fit: cover" src="https://file.wmzspace.space//tour/21/map_screenshot.jpg" alt="">
            </div>
            </div>
          </div>
        </div>
        <div class="ride-card">
          <div class="ride-level">Expert</div>
          <div class="ride-info">
            <h3> Chengdu DISNEY</h3>
            <div class="ride-stats">
              <span><i class="fas fa-clock"></i> 2 h 01</span>
              <span><i class="fas fa-ruler-horizontal"></i> 12.2 mi</span>
              <span><i class="fas fa-arrow-up"></i> 1,450 ft</span>
            </div>
            <div class="map-thumbnail">
              <div class="map-thumbnail">
              <img style="width: 100%;height: 100%; object-fit: cover" src="https://file.wmzspace.space//tour/22/map_screenshot.jpg" alt="">
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips section -->
    <!-- <div class="tips-section">
      <div class="tip" v-for="tip in tips" :key="tip.id">
        <div class="tip-header">
          <img class="tip-avatar" :src="tip.userAvatar" alt="User avatar" />
          <div class="tip-user-info">
            <h3 class="tip-user-name">{{ tip.userName }}</h3>
            <p class="tip-date">{{ tip.date }}</p>
          </div>
        </div>
        <p class="tip-content">{{ tip.content }}</p>
      </div>
      <button class="write-tip-button">WRITE A TIP</button>
    </div> -->
  </div>
</template>

<script lang="ts">
export default {
  name: 'MobileHighlight'
}
</script>

<style lang="scss" scoped></style>
