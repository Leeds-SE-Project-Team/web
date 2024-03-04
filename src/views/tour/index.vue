<template>
  <div>
    <!-- the section of bg in tour page -->
    <section class="bg">
      <!-- bg img -->
      <div class="bg-2-imgs">
           <img :src="url.concat('/test_for_tour_page1.png')" alt="bg in tour page" class="bg-img">
           <img :src="url.concat('/test_for_tour_page1.png')" alt="bg in tour page" class="out-img">
      </div>
      <!-- tile card -->
      <div class="title-card">
        <p>Lifestyle Sports</p>
        <h2>Cricket 101</h2>
        <h3>Learn the basics of cricket, the second most popular sport in the world</h3>
        <div class="profile">
            <img :src="url.concat('/test_for_tour_page2.png')" alt="profile photo">
        </div>
        <p>18 September 2023</p>
      </div>
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
