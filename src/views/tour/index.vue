<template>
  <div class="tour-main">
    <!-- the section of bg and title in tour page -->
    <section class="tour-title">
      <!-- the bg part -->
      <div class="bg">
        <div class="main-bg">1234</div>
        <div class="sub">
          <div class="sub-bg">1234</div>
          <div class="sub-bg">1234</div>
        </div>
      </div>

      <!-- the title part -->
      <div class="title">
        <h1 class="main-title">Alberta - Plain of Six Glaciers</h1>
        <div>
          <span class="category">Expert</span>
          <span class="time">07:10</span>
          <span class="distance">18.4</span>km
          <span class="speed">2.6</span>km/h
        </div>
        <h3 class="des">Expert Hiking Tour. Very good fitness required. Sure-footedness, sturdy shoes and alpine experience required.</h3>
      </div>
    </section>

    <!-- the section of TOUR OVERVIEW -->
    <section class="overview">
      <div class="subtitle">TOUR OVERVIEW</div>
      <a-divider />
      <a-timeline labelPosition="relative" class="timeline">
      
        <a-timeline-item label="2017-03-10 8:20" lineType="dashed">
          <div class="mile">3 m</div>
        </a-timeline-item>


        <a-timeline-item label="2018-05-12 9:30" lineType="dashed">
          <div class="mile">13 m</div>
        </a-timeline-item>
        
        
        <a-timeline-item label="2020-09-30 10:10" lineType="dashed">
          <div class="mile">3 km</div>
        </a-timeline-item>
      
      </a-timeline>
    </section>

    <!-- the section of map -->
    <section class="map">
      <div class="subtitle">
        MAP
      </div>
      <div class="map-img"></div>
    </section>

    <!-- the section of weather and profile .. and so on -->
    <section class="profile">
      <div class="subtitle">
        PROFIEL
      </div>
    </section>

    <section class="weather">
      <div class="subtitle">
        WEATHER
      </div>
    </section>
  </div>

  
  <div class="comments">
    <a-space size="large">
      <a-avatar
        :size="50"
        imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
      >
      </a-avatar>
      <div class="rigion">
        <h3>Thüringer Wald planned a hike.</h3>
        <p>September 13, 2017</p>
      </div>
    </a-space>
    
    <div class="like">
      <a-button class="button-icon">
        <template #icon>
          <div class="icon">
            <icon-heart class="button" />
            <span>66</span>
          </div>
        </template>
      </a-button>
      
      <div class="follower">
        <a-space :size="32">
          <a-avatar-group :max-count="5">
            <a-avatar :style="{ backgroundColor: '#7BC616' }">A</a-avatar>
            <a-avatar :style="{ backgroundColor: '#14C9C9' }">B</a-avatar>
            <a-avatar :style="{ backgroundColor: '#168CFF' }">C</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FF7D00' }">D</a-avatar>
            <a-avatar :style="{ backgroundColor: '#7BC616' }">E</a-avatar>
            <a-avatar :style="{ backgroundColor: '#14C9C9' }">F</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FF7D00' }">G</a-avatar>
          </a-avatar-group>
        </a-space>
      </div>

    </div>

    <div class="subtitle comment-title">COMMENTS</div>
    
    <div class="comments-content" v-for="i in Array(3)" :key="i">
      <a-divider />
      <div class="flex-content">
        <div class="head-profile">
          <a-space size="large">
            <a-avatar
              :size="36"
              imageUrl="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            >
            </a-avatar>
          </a-space>
        </div>

        <div class="content">
          <h3 class="name">George</h3>
          <p class="com-content">The Rennsteig begins at the Werraufer in Hörschel. Here, so it is custom, you should take a pebble, which you throw in the hall at the end of your tour. The first stage leads you about 19 kilometers almost steadily uphill. At the large Eichelberg (310 m above sea level) offers a beautiful view of the</p>
          <p class="date">August 31, 2017</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
export default {
    name: "TourPage"
}
</script>

<script setup lang="ts">
const url = import.meta.env.APP_STATIC_URL.concat("/tour")
</script>

<style></style>
