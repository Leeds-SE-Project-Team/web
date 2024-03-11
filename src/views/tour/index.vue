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
    </section>
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
