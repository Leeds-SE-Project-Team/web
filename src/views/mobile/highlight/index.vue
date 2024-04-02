<script lang="ts" setup>
import { defineComponent } from "vue";
import { createApp } from 'vue';
import { ImagePreview, showImagePreview } from 'vant';

const actions = [
  { title: 'See rides here' },
  { title: 'Bookmark' },
  // Add other actions here
]

const rides = [
  // Populate with ride data
]

const tips = [
  // Populate with tips data
  // Example:
  {
    id: 1,
    userAvatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    userName: 'Andrus',
    date: 'October 13, 2023 20:20',
    content: 'Hawes Trail forms the backbone of the eponymous Hawes Trail ',
  },
  // Add more tip objects as needed
  {
    id: 1,
    userAvatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    userName: 'Andrus',
    date: 'October 13, 2023 20:20',
    content: 'Hawes Trail forms the  it provides access to are some of the least technical and rocky in the Phoenix area, making it a great option for cross country riders. The beautiful desert scenery is beautiful but not without its own dangers. This is an area where shin guards are a good idea to protect yourself from the abundance of prickly cacti that line the trails.',
  },
  {
    id: 1,
    userAvatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    userName: 'Andrus',
    date: 'October 13, 2023 20:20',
    content: 'Hawes  reat tiful desert scenery is beautiful but not without its own dangers. This is an area where shin guards are a good idea to protect yourself from the abundance of prickly cacti that line the trails.',
  },
]

const suggestions = [
  // Example suggestion data
  {
    name: 'Wild Horse Trail',
    imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    // Add more properties as needed
  },
  {
    name: 'Wild Horse Trail',
    imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    // Add more properties as needed
  }, {
    name: 'Wild Horse Trail',
    imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    // Add more properties as needed
  },
  // ... additional suggestions ...
]

const monthlyVisits = {
  Jan: 5,
  Feb: 10,
  Mar: 0,
  Apr: 0,
  May: 15,
  Jun: 20,
  Jul: 0,
  Aug: 0,
  Sep: 8,
  Oct: 0,
  Nov: 0,
  Dec: 0,
}

showImagePreview({
  images: [
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  ],
  closeable: true,
})
</script>

<template>
  <div id="page-highlight">

    <!-- Image section with click event to open preview -->
    <!-- Image and title section -->
    <div class="image-title-container">
      <img class="trail-image" src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg" alt="Trail Image" />
      <h1 class="trail-title">Hawes Trail</h1>
      <p class="trail-description">Mountain Biking Highlight (Segment)</p>
    </div>
    <!-- Top section with image and action buttons -->
    <div class="highlight-top">
      <div class="actions-container">
        <div class="action-item">
          <i class="icon fas fa-bicycle"></i>See rides here
        </div>
        <div class="action-item">
          <i class="icon fas fa-bookmark"></i>Bookmark
        </div>
        <div class="action-item">
          <i class="icon fas fa-map-marker-alt"></i>Open in planner
        </div>
      </div>
    </div>

    <!-- Information section -->
    <div class="information-section">
      <div class="info-alert">
        <i class="icon fas fa-info-circle"></i>
        <span>This Highlight goes through a protected area. Please check local regulations for: Tonto National
          Forest</span>
      </div>
      <div class="info-credits">
        <div class="user-avatars">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg" alt="User 1" />
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg" alt="User 2" />
        </div>
        <div class="credits-text">
          <span>Created by komoot users</span>
          <span>Recommended by 2 out of 2 mountain bikers</span>
        </div>
      </div>
    </div>

    <!-- Highlight location section -->
    <div class="highlight-location-section">
      <hr class="section-divider" />
      <h2 class="section-title">HIGHLIGHT LOCATION</h2>
      <div class="location-map-placeholder"></div>
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
            <h3>Hawes Trail Network loop — Mesa, Arizona</h3>
            <div class="ride-stats">
              <span><i class="fas fa-clock"></i> 2 h 01</span>
              <span><i class="fas fa-ruler-horizontal"></i> 12.2 mi</span>
              <span><i class="fas fa-arrow-up"></i> 1,450 ft</span>
            </div>
            <div class="map-thumbnail"></div>
          </div>
        </div>
        <!-- Add more ride-cards here -->
        <div class="ride-card">
          <div class="ride-level">Expert</div>
          <div class="ride-info">
            <h3>Hawes Trail Network loop — Mesa, Arizona</h3>
            <div class="ride-stats">
              <span><i class="fas fa-clock"></i> 2 h 01</span>
              <span><i class="fas fa-ruler-horizontal"></i> 12.2 mi</span>
              <span><i class="fas fa-arrow-up"></i> 1,450 ft</span>
            </div>
            <div class="map-thumbnail"></div>
          </div>
        </div>
        <div class="ride-card">
          <div class="ride-level">Expert</div>
          <div class="ride-info">
            <h3>Hawes Trail Network loop — Mesa, Arizona</h3>
            <div class="ride-stats">
              <span><i class="fas fa-clock"></i> 2 h 01</span>
              <span><i class="fas fa-ruler-horizontal"></i> 12.2 mi</span>
              <span><i class="fas fa-arrow-up"></i> 1,450 ft</span>
            </div>
            <div class="map-thumbnail"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips section -->
    <div class="tips-section">
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
    </div>


    <!-- most-visited-section section -->
    <div class="most-visited-section">
      <hr class="section-divider" />

      <h2 class="section-title">MOST VISITED DURING</h2>
      <div class="months-container">
        <div class="month" v-for="(visitCount, month) in monthlyVisits" :key="month"
          :class="{ 'active': visitCount > 0 }">
          {{ month }}
        </div>
      </div>
      <hr class="section-divider" />

    </div>

    <!-- You might also like section -->
    <div class="you-might-like-section">
      <h2 class="section-title">YOU MIGHT ALSO LIKE</h2>
      <div class="suggestions-container">
        <div class="suggestion-card" v-for="suggestion in suggestions" :key="suggestion.name">
          <img class="suggestion-image" :src="suggestion.imageUrl" :alt="suggestion.name" />
          <div class="suggestion-details">
            <i class="suggestion-icon fas fa-biking"></i>
            <h3 class="suggestion-title">{{ suggestion.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MobileHighlight',
}
</script>