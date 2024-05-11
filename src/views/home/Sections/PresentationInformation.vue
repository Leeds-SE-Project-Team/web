<script lang="ts" setup>
import RotatingCard from "../../../examples/cards/rotatingCards/RotatingCard.vue";
import RotatingCardFront from "../../../examples/cards/rotatingCards/RotatingCardFront.vue";
import RotatingCardBack from "../../../examples/cards/rotatingCards/RotatingCardBack.vue";
import DefaultInfoCard from "../../../examples/cards/infoCards/DefaultInfoCard.vue";
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<template>
  <section class="my-5 py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-4 ms-auto me-auto p-lg-4 mt-lg-0 mt-4">
          <RotatingCard>
            <RotatingCardFront
              image="https://images.unsplash.com/photo-1569683795645-b62e50fbf103?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
              icon="touch_app"
              title="Feel the <br /> Material Kit"
              description="A tour refers to a specific journey or itinerary, typically involving visits to attractions, experiences of local culture, and activities. Tours can be either self-guided or conducted as part of a group."
            />

            <RotatingCardBack
              image="https://images.unsplash.com/photo-1498889444388-e67ea62c464b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1365&q=80"
              title="Discover More"
              description="You will discover some tours and some collections."
              :action="[
                {
                  label: 'Start with Headers',
                },
              ]"
              @click="navigateTo('discover')"
            />
          </RotatingCard>
        </div>
        <div class="col-lg-6 ms-auto">
          <div class="row justify-content-start">
            <DefaultInfoCard
              icon="your tours"
              title="Full Tour Documentation"
              description="A tour refers to a specific journey or itinerary, typically involving visits to attractions, experiences of local culture, and activities. Tours can be either self-guided or conducted as part of a group."
            />
            <DefaultInfoCard
              icon="highlight"
              title="distinctive photo"
              description="In the context of tourism, highlights are the notable attractions, activities, or experiences worth special attention or capturing in photographs."
            />
          </div>
          <div class="row justify-content-start mt-5">
            <DefaultInfoCard
              class="mt-3"
              icon="Gourps"
              title="Groups play and tour"
              description=" These individuals can be family members, friends, colleagues, or strangers from different places who share the experience of the journey."
            />
            <DefaultInfoCard
              class="mt-3"
              icon="collections"
              title="Assembling multiple related tours"
              description="These collections may be based on destinations, themes, seasons, or other criteria. Collections enable travelers to browse and select tour options that suit their needs more easily."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
