<script lang="ts" setup>
import MapContainer from '@/components/map/MapContainer.vue'
import { reactive, ref, watch } from 'vue'
import { createTour, type CreateTourForm, TourType } from '@/apis/tour'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'

const customStyle = {
  borderRadius: '6px',
  marginBottom: '18px',
  border: 'none',
  overflow: 'hidden'
}

const createTourForm = reactive<CreateTourForm>({
  startLocation: '',
  endLocation: '',
  type: TourType.WALK,
  pons: [],
  tourCollectionId: 1,
  result: undefined,
  title: ''
})

const mapContainer = ref()
const infile = ref<HTMLInputElement | null>(null)

const { loading, setLoading } = useLoading()
const formRef = ref()
const handleCreateTour = () => {
  formRef.value.validate().then((e: any) => {
    if (!e) {
      setLoading(true)
      createTour(createTourForm)
        .then((res) => {
          if (res.success) {
            Message.success(res.message)
            mapContainer.value.screenMap()
          } else {
            Message.info(res.message)
          }
        })
        .catch((e) => {
          Message.error(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  })
}

const handleGPX = () => {
  const theFile = infile.value?.files?.item(0)
  if (theFile) {
    const reader = new FileReader()
    reader.readAsText(theFile)
    reader.onload = () => {
      // 读取gpx文件为DOM
      const paser = new DOMParser()
      const res = paser.parseFromString(reader.result as string, 'text/xml')
      console.log(res)
      const tracks = res.getElementsByTagName('trkpt')
      const pos = []
      // 摘取经纬度
      for (let i = 0; i < tracks.length; i++) {
        if (tracks.item(i)) {
          pos.push([tracks[i].getAttribute('lon'), tracks.item(i)?.getAttribute('lat')])
        }
      }
      createTourForm.startLocation = pos[0].toString()
      createTourForm.endLocation = pos[pos.length - 1].toString()
      mapContainer.value.drawGPX(pos)
    }
  }
}

const validatePosition = (value: string, cb: any) => {
  // const va = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
  const [lat, lon] = value.split(',').map((e) => parseFloat(e))
  if (lat?.toString().concat(lon?.toString()).length + 1 !== value.length) {
    cb('postition value error')
  }
  if (lat > 0 && lat < 180 && lon >= -90 && lon <= 90) {
    cb()
  } else {
    cb('postition value error')
  }
}

// 表单验证
const rules = {
  startLocation: [
    {
      required: true,
      message: 'invalid address'
    },
    {
      validator: validatePosition
    }
  ],
  endLocation: [
    {
      required: true,
      message: 'invalid address'
    },
    {
      validator: validatePosition
    }
  ]
}
</script>

<template>
  <!-- the section of route planner sider -->
  <section class="sider">
    <a-form
      ref="formRef"
      :rules="rules"
      :model="createTourForm"
      :style="{ width: '388px' }"
      @submit="handleCreateTour"
    >
      <div class="top">
        <!-- search bar input part -->
        <div class="search">
          <a-input allow-clear class="input" placeholder="Search For Place Or Address" />
        </div>

        <!-- tool part -->
        <div class="tool">
          <a-collapse accordion expand-icon-position="right">
            <a-collapse-item key="1" :style="customStyle" header="Sports">
              <div class="items">
                <div
                  class="item walk"
                  @click="createTourForm.type = TourType.WALK"
                  :class="[createTourForm.type === TourType.WALK ? 'svg-grew' : 'svg-white']"
                >
                  <svg
                    t="1710074674268"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2737"
                  >
                    <path
                      d="M566.1 261.4c44.8 0 82-37.2 82-81.9s-37.3-81.9-82-81.9c-44.8 0-82.1 37.2-82.1 81.9 0.1 44.7 37.4 81.9 82.1 81.9z m179.1 208.4l-100.7-37.2-63.4-115.4c-3.7-3.7-7.5-7.4-7.5-11.2l-7.5-7.4c-26.1-26.1-63.4-29.8-97-14.9l-175.3 59.6c-14.9 3.7-26.1 18.6-29.8 33.5l-14.9 137.7c-3.7 22.3 14.9 44.7 37.3 48.4h3.7c22.4 0 41-14.9 41-37.2l11.2-107.9 67.1-22.3c-11.2 26.1-22.4 52.1-29.8 70.7-14.9 33.5-14.9 78.2 3.7 115.4l-115.6 268c-11.2 26.1 0.3 58.8 26.1 70.7 29.5 13.6 64.7-11.7 74.6-33.5l85.8-193.5c52.2 93.1 111.9 201 111.9 204.7 11.2 18.6 29.8 29.8 48.5 29.8 7.5 0 18.6-3.7 26.1-7.4 26.1-14.9 37.3-48.4 22.4-74.4-3.7-7.4-93.2-174.9-152.9-275.4l52.2-115.4 18.6 33.5c3.7 11.2 14.9 14.9 22.4 18.6L719 551.7c3.7 0 11.2 3.7 14.9 3.7 18.6 0 33.6-11.2 41-29.8 3.8-22.3-7.4-48.3-29.7-55.8z"
                      p-id="2738"
                      fill="#ffffff"
                    ></path>
                  </svg>
                </div>

                <div
                  class="item"
                  @click="createTourForm.type = TourType.CYCLING"
                  :class="[createTourForm.type === TourType.CYCLING ? 'svg-grew' : 'svg-white']"
                >
                  <svg
                    t="1710074828341"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="7408"
                  >
                    <path
                      d="M214.343422 460.600539c29.25422 0 56.974128 5.728099 82.955149 16.979722 25.981021 11.353911 48.279692 26.287883 66.896014 44.904205C384.140645 541.203077 399.483768 563.501748 410.121666 589.482769 420.759564 615.46379 426.078514 643.797423 426.078514 674.38138c0 29.25422-5.318949 56.974128-15.956847 82.852862C399.483768 783.317551 384.140645 805.616222 364.194586 824.232544 345.475976 844.178604 323.177305 859.521726 297.196284 870.159624 271.317551 880.89981 243.597643 886.116472 214.343422 886.116472c-30.583958 0-58.917591-5.318949-84.898612-15.956847C103.46379 859.521726 81.165118 844.178604 62.446509 824.232544c-18.616322-18.616322-33.652582-40.914994-44.904205-66.896014S0.562581 703.737888 0.562581 674.38138c0-30.583958 5.625812-58.917591 16.979722-84.898612C28.896214 563.501748 43.830187 541.203077 62.446509 522.586755c18.616322-18.616322 40.914994-33.652582 66.896014-44.904205C155.425832 466.328638 183.657177 460.600539 214.343422 460.600539zM214.343422 822.186795c19.946059 0 38.971531-3.989212 56.974128-11.967636 18.002597-7.978424 33.652582-18.616322 46.949955-32.015982 13.297373-13.297373 23.935271-28.947358 32.015982-46.949955 7.978424-18.002597 11.967636-36.925782 11.967636-56.974128 0-21.275797-3.989212-40.914994-11.967636-58.917591C342.202777 597.461193 331.564879 581.811208 318.165218 568.513835c-13.297373-13.297373-28.947358-23.935271-46.949955-32.015982C253.314954 528.519429 234.289482 524.530217 214.343422 524.530217c-21.275797 0-40.914994 3.989212-58.917591 11.967636C137.423234 544.578564 121.773249 555.216462 108.475877 568.513835 95.076216 581.811208 84.438318 597.461193 76.459894 615.46379 68.48147 633.466387 64.492259 653.105584 64.492259 674.38138c0 19.946059 3.989212 38.971531 11.967636 56.974128C84.438318 749.358106 95.076216 765.008091 108.475877 778.305464c13.297373 13.297373 28.947358 23.935271 46.949955 32.015982C173.326141 818.197583 193.067626 822.186795 214.343422 822.186795zM557.92708 268.811507 460.037958 366.700629 553.937868 438.60873l0 277.710518L478.040555 716.319249l0-213.780841-145.861952-83.875737C326.859654 414.673459 322.256718 410.377385 318.165218 405.672161 314.176006 401.069224 310.902807 396.057137 308.243332 390.738188c-2.659475-5.318949-5.012087-11.251623-6.955549-18.002597C299.242034 366.086904 298.219159 360.051943 298.219159 354.732994c0-10.637898 2.04575-20.252922 6.034962-28.947358C308.243332 317.0912 313.562281 309.521926 320.210968 302.770952l157.829587-157.829587c6.648686-6.648686 14.320248-11.967636 23.014684-15.956847 8.694436-3.989212 18.30946-6.034962 28.947358-6.034962 6.648686 0 13.297373 1.022875 19.946059 2.966337 6.648686 2.04575 12.683648 4.296074 18.002597 6.955549 5.318949 2.659475 10.024173 6.341824 14.013385 10.944761 3.989212 4.705224 7.978424 9.717311 11.967636 14.933973L673.818799 298.78174 809.656578 298.78174l0 75.897313L631.880931 374.679053 557.92708 268.811507zM809.656578 460.600539c30.583958 0 58.917591 5.728099 84.898612 16.979722 25.981021 11.353911 48.279692 26.287883 66.896014 44.904205 18.616322 18.71861 33.652582 40.914994 44.904205 66.896014C1017.811607 615.46379 1023.437419 643.797423 1023.437419 674.38138c0 29.25422-5.625812 56.974128-16.979722 82.852862C995.103786 783.317551 980.169813 805.616222 961.451204 824.232544c-18.616322 19.946059-40.914994 35.289182-66.896014 45.92708C868.574168 880.89981 840.342823 886.116472 809.656578 886.116472c-29.25422 0-56.974128-5.318949-82.955149-15.956847C700.822695 859.521726 678.524024 844.178604 659.805414 824.232544 639.859355 805.616222 624.516232 783.317551 613.878334 757.33653S597.921486 703.737888 597.921486 674.38138c0-30.583958 5.318949-58.917591 15.956847-84.898612C624.516232 563.501748 639.859355 541.203077 659.805414 522.586755c18.616322-18.616322 40.914994-33.652582 66.896014-44.904205C752.682449 466.328638 780.402357 460.600539 809.656578 460.600539zM681.797223 152.919788c-10.637898 0-20.662072-2.04575-29.970233-6.034962C642.518829 142.997902 634.540406 137.678953 627.891719 131.030267 621.243033 124.279293 615.924084 116.300869 611.934872 106.992708 607.94566 97.684547 605.89991 87.762661 605.89991 77.022475c0-10.637898 1.943462-20.662072 6.034962-29.970233C615.924084 37.846369 621.243033 29.765658 627.891719 23.116971 634.540406 16.468285 642.518829 11.149336 651.82699 7.160124 661.135151 3.170912 671.159325 1.125162 681.797223 1.125162s20.662072 2.04575 29.970233 6.034962C721.075617 11.149336 729.770053 16.468285 737.748477 23.116971 744.397163 29.765658 749.716112 37.846369 753.705324 47.052243 757.694536 56.360404 759.740286 66.384577 759.740286 77.022475c0 10.637898-2.04575 20.662072-6.034962 29.970233C749.716112 116.300869 744.397163 124.279293 737.748477 131.030267 729.770053 137.678953 721.075617 142.997902 711.767456 146.987114 702.459295 150.976326 692.435121 152.919788 681.797223 152.919788zM809.656578 822.186795c21.275797 0 40.914994-3.989212 58.917591-11.967636 18.002597-7.978424 33.652582-18.616322 46.949955-32.015982 13.297373-13.297373 23.935271-28.947358 32.015982-46.949955 7.978424-18.002597 11.967636-36.925782 11.967636-56.974128 0-21.275797-3.989212-40.914994-11.967636-58.917591C939.561682 597.461193 928.821496 581.811208 915.524123 568.513835c-13.297373-13.297373-28.947358-23.935271-46.949955-32.015982C850.673859 528.519429 830.932374 524.530217 809.656578 524.530217c-19.946059 0-38.971531 3.989212-56.974128 11.967636C734.78214 544.578564 719.132155 555.216462 705.732494 568.513835 692.435121 581.811208 681.797223 597.461193 673.818799 615.46379 665.840376 633.466387 661.851164 653.105584 661.851164 674.38138c0 19.946059 3.989212 38.971531 11.967636 56.974128C681.797223 749.358106 692.435121 765.008091 705.732494 778.305464c13.297373 13.297373 28.947358 23.935271 46.949955 32.015982C770.685046 818.197583 789.710518 822.186795 809.656578 822.186795z"
                      p-id="7409"
                      fill="#ffffff"
                    ></path>
                  </svg>
                </div>

                <div
                  class="item car"
                  @click="createTourForm.type = TourType.CAR"
                  :class="[createTourForm.type === TourType.CAR ? 'svg-grew' : 'svg-white']"
                >
                  <svg
                    t="1710075402574"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="8606"
                  >
                    <path
                      d="M848.3 384.9l-72-183.8c-13.5-35-42.9-64.9-98.3-64.9H346.6c-55.3 0-84.6 29.9-98.2 64.9l-72 183.8c-28.5 3.6-79.1 36.8-79.1 99.6v279.9h81v58.2c0 92 109.6 90.9 109.6 0v-58.2h449v58.2c0 90.9 109.6 92 109.6 0v-58.2h81V484.5c-0.1-62.8-50.7-96-79.2-99.6zM305.1 238.4c6.8-20.3 16.9-35 40.7-35.3H679c23.6 0.2 33.8 14.9 40.6 35.3l54.2 142.2H250.9l54.2-142.2z m-31.6 384.4c-34.3 0-62.1-28.3-62.1-63.3s27.8-63.4 62.1-63.4 62.1 28.3 62.1 63.4c0 35-27.8 63.3-62.1 63.3z m477.6 0c-34.3 0-62.1-28.3-62.1-63.3s27.8-63.4 62.1-63.4 62.1 28.3 62.1 63.4c0.1 35-27.7 63.3-62.1 63.3z"
                      p-id="8607"
                      fill="#ffffff"
                    ></path>
                  </svg>
                </div>

                <div
                  class="item public"
                  @click="createTourForm.type = TourType.PUBLIC"
                  :class="[createTourForm.type === TourType.PUBLIC ? 'svg-grew' : 'svg-white']"
                >
                  <svg
                    t="1710075911174"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="10030"
                  >
                    <path
                      d="M875.8 53.4C825.8 17.8 765.4 0 695 0L329 0.1c-70.5 0-130.7 17.8-180.9 53.4C98 89.1 73 132.2 73 182.9v511.9c0 49.7 23.8 91.8 71.7 126.9 10.5 7.6 21.4 14.5 32.8 20.5 56.3 29.9 66.5 106.4 20.2 150.3-6 5.8-7.6 12.4-4.5 20 3.1 7.5 8.7 11.5 17.2 11.5h603.3c8.3 0 14.1-4 17.2-11.5 3.1-7.7 1.7-14.2-4.5-20-46.3-43.9-36.1-120.4 20.2-150.3 11.4-6.1 22.3-12.9 32.8-20.5 47.6-35 71.6-77.4 71.6-126.9v-512c0-50.7-25-93.8-75.2-129.4zM182.9 406.8V178.3c0-17.7 14.3-32 32-32H480v292.5H214.9c-17.7 0-32-14.3-32-32zM379.7 736c-21.4 21.3-47.2 32-77.7 32s-56.5-10.6-77.7-32c-21.4-21.3-32-47.2-32-77.7s10.6-56.3 32-77.7c21.4-21.3 47.2-32 77.7-32s56.3 10.8 77.7 32c21.2 21.4 32 47.2 32 77.7s-10.8 56.5-32 77.7z m420 0c-21.4 21.3-47.2 32-77.7 32s-56.5-10.6-77.7-32c-21.4-21.3-32-47.2-32-77.7s10.6-56.3 32-77.7c21.4-21.3 47.2-32 77.7-32s56.3 10.8 77.7 32c21.2 21.4 32 47.2 32 77.7s-10.8 56.5-32 77.7z m41.4-329.1c0 17.7-14.3 32-32 32H544V146.3h265.1c17.7 0 32 14.3 32 32v228.6z"
                      p-id="10031"
                      fill="#ffffff"
                    ></path>
                  </svg>
                </div>
              </div>
            </a-collapse-item>
            <a-collapse-item key="2" :style="customStyle" header="Fitness">
              <div class="items">
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
              </div>
            </a-collapse-item>
          </a-collapse>
        </div>
      </div>

      <div class="middle">
        <!-- place part -->
        <div class="place">
          <div>
            <a-form-item field="startLocation" validate-trigger="blur">
              <a-input
                v-model.trim:model-value="createTourForm.startLocation"
                allow-clear
                class="place-input"
                placeholder="Enter Starting Point"
                @change="console.log(createTourForm.startLocation)"
              >
                <template #prefix><span class="white">A</span></template>
                <!--            <template #append><icon-delete /></template>-->
              </a-input>
            </a-form-item>
          </div>
          <div>
            <a-form-item field="endLocation" validate-trigger="blur">
              <a-input
                v-model.trim:model-value="createTourForm.endLocation"
                allow-clear
                class="place-input"
                placeholder="Enter Destination"
              >
                <template #prefix><span class="white">B</span></template>
              </a-input>
            </a-form-item>
          </div>
        </div>

        <!-- icon part -->
        <div class="icons-part">
          <div></div>
          <div></div>
          <div class="right-icon">
            <svg
              aria-hidden="true"
              class="css-rjl6tn"
              fill="none"
              role="presentation"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm8.25.25c0-.963.787-1.75 1.75-1.75s1.75.787 1.75 1.75S12.963 14 12 14s-1.75-.787-1.75-1.75zm7-1.75c-.962 0-1.75.787-1.75 1.75S16.288 14 17.25 14 19 13.213 19 12.25s-.788-1.75-1.75-1.75zM5 12.25c0-.963.787-1.75 1.75-1.75s1.75.787 1.75 1.75S7.713 14 6.75 14 5 13.213 5 12.25z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="route-img">
          <img alt="route" src="/route/route.png" />
        </div>
        <div class="route-text">
          <h3 class="header">Where do you want to go?</h3>
          <!--<p class="text">Enter a destination or click on the map to add it.</p>-->
        </div>
        <a-button :loading="loading" style="width: 100px" html-type="submit">create</a-button>
        <!-- <input ref="infile" type="file" name="file" id="infile" @change="handleGPX"> -->
      </div>
    </a-form>
  </section>

  <MapContainer ref="mapContainer" v-model:create-tour-form="createTourForm" />
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'PlannerView'
}
</script>
