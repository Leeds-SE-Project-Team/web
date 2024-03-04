<script lang="ts">
export default {
  setup() {
    const customStyle = {
      borderRadius: '6px',
      marginBottom: '18px',
      border: 'none',
      overflow: 'hidden',
    }

    return {
      customStyle
    }
  }
}
</script>

<template>
  <!-- the section of route planner sider -->
  <section class="sider">
    <div class="top">
      <!-- search bar input part -->
      <div class="search">
        <a-input class="input" placeholder="Search For Place Or Address" allow-clear />
      </div>

      <!-- tool part -->
      <div class="tool">
        <a-collapse expand-icon-position="right" accordion>
          <a-collapse-item :style="customStyle" header="Beijing Toutiao Technology Co., Ltd." key="1">
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
          <a-collapse-item :style="customStyle" header="Beijing Toutiao Technology Co., Ltd." key="2">
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
          <a-collapse-item :style="customStyle" header="Beijing Toutiao Technology Co., Ltd." key="3">
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
        </a-collapse>
      </div>
    </div>

    <div class="middle">
      <!-- place part -->
      <div class="place">
        <div>
          <a-input class="place-input" placeholder="Enter Place Or Address..." allow-clear />
        </div>
        <div>
          <a-input class="place-input" placeholder="Enter Place Or Address..." allow-clear />
        </div>
        <div>
          <a-input class="place-input" placeholder="Enter Place Or Address..." allow-clear />
        </div>
      </div>

      <!-- icon part -->
      <div class="icons-part">
        <div></div>
        <div></div>
        <div class="right-icon">
          <svg aria-hidden="true" role="presentation" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="css-rjl6tn"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm8.25.25c0-.963.787-1.75 1.75-1.75s1.75.787 1.75 1.75S12.963 14 12 14s-1.75-.787-1.75-1.75zm7-1.75c-.962 0-1.75.787-1.75 1.75S16.288 14 17.25 14 19 13.213 19 12.25s-.788-1.75-1.75-1.75zM5 12.25c0-.963.787-1.75 1.75-1.75s1.75.787 1.75 1.75S7.713 14 6.75 14 5 13.213 5 12.25z" fill="currentColor"></path></svg>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="route-img">
        <img src="../../../public/route/route.png" alt="route">
      </div>
      <div>
        <h3 class="header">Where do you want to go?</h3>
<!--        <p class="text">Enter a destination or click on the map to add it.</p>-->
      </div>
    </div>
  </section>
</template>

<style lang="less">

</style>
