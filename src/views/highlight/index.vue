<template>
  <div id="page-highlight">
    <div class="left-page">
      <!-- the section of bg and title in tour page -->
      <section class="tour-title" style="box-shadow: none !important;">
        <!-- the bg part -->
        <div class="bg">
          <div class="main-bg">
            <img
              src="https://ts1.cn.mm.bing.net/th/id/R-C.fb5c419af8a68620f260141329de4871?rik=TithX9%2fgPjEddg&riu=http%3a%2f%2fpic1.k1u.com%2fk1u%2fmb%2fd%2ffile%2f20201127%2f1606451147136550_836_10000.jpg&ehk=Z0DADLY7u52CbaEwT7xc70kBlZcEco%2b4uLxBpIsNOWk%3d&risl=&pid=ImgRaw&r=0"
              alt=""
            />
          </div>
          <div class="sub">
            <div class="sub-bg">
              <img
                src="https://tse4-mm.cn.bing.net/th/id/OIP-C.ewQZp_TJxTyX_fpVLKg_oAHaEm?rs=1&pid=ImgDetMain"
                alt=""
              />
            </div>
            <div class="sub-bg">
              <img
                src="https://tse4-mm.cn.bing.net/th/id/OIP-C.dimV8ywyo3r5qHjiOjZHxAHaEQ?rs=1&pid=ImgDetMain"
                alt=""
              />
            </div>
          </div>
        </div>

        <!-- the title part -->
        <div class="title">
          <h1 class="main-title">Chengdu Giant Panda Base</h1>
          <h3 class="des">
            The Panda Base is a world-renowned giant panda relocation protection base, scientific research and breeding base, 
            science popularization education base, and cultural tourism base, covering an area of 3.07 square kilometers.
          </h3>
        </div>

        <!-- follow part -->
        <!-- <div class="follow">
          <a-divider />
          <a-avatar-group :size="30" :max-count="3">
            <a-avatar :style="{ backgroundColor: '#7BC616' }">A</a-avatar>
            <a-avatar :style="{ backgroundColor: '#14C9C9' }">B</a-avatar>
            <a-avatar :style="{ backgroundColor: '#168CFF' }">C</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FF7D00' }">Arco</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FFC72E' }">Design</a-avatar>
          </a-avatar-group>
          <div class="recommend">Recommended by 31 cyclists</div>
        </div> -->
      </section>

      <div class="comments-content">
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
            <p class="com-content">
              It is recommended to go to the panda base in the morning. Panda babies are cute and lively, 
              and there are not many people. It is best to go outside of holidays
            </p>
            <p class="date">August 31, 2023</p>
          </div>
        </div>
      </div>
    </div>

    <div class="right-page">
      <h3 class="right-title">Top Touring Cycling Routes to Chengdu Giant Panda Base</h3>
      <div class="tours">
        <a-divider />
        <div class="title">
          <div class="left">
            <span class="category">Expert</span>
            <h1 class="main-title">Chengdu Giant Panda Base</h1>
            <div>
              <span class="time">07:10</span>
              <span class="distance">18.4</span>km <span class="speed">2.6</span>km/h
            </div>
          </div>

          <div class="right">
            <div class="icon">
              <svg
                aria-hidden="true"
                role="presentation"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="css-nqigl7"
              >
                <g clip-path="url(#tour-visitors_svg__clip0_5249_547)">
                  <path
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="tour-visitors_svg__clip0_5249_547">
                    <path fill="#666666" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
              <span>11</span>
            </div>
            <div class="pic">
              <img
                src="https://file.wmzspace.space//tour/21/map_screenshot.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MobileHighlight'
}
</script>

<style lang="scss" scoped>
/* 这里是你的样式 */
</style>
