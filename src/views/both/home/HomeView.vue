<script setup lang="ts">
import { ref } from 'vue';
import { generateFormModel, locations, densityList, type SizeProps } from "./tourList"

const formModel = ref(generateFormModel())

const size = ref<SizeProps>('medium')
const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
  size.value = val as SizeProps
}
</script>

<template>
  <div id="home">
    <div class="tip-card-container">
      <a-card :bordered="false" :style="{ width: '100%' }" class="tip-card">
        <template #title>
          <span class="tip-title">You're seconds away from being fully set up!</span>
        </template>
        <template #extra>
          <a-button type="primary" class="tip-btn">Let's do it!</a-button>
        </template>
        Make the most out of komoot. Complete the remaining steps and get every adventure off to the right start.
      </a-card>
    </div>
    <main class="main-content-container">
      <div class="tours-card-container">
        <a-card class="tours-card" :bordered="false">
          <template #title>
            <h1>Tours</h1>
          </template>
          <template #extra>
            <a-button type="primary" class="tour-import-btn">Import a GPS file</a-button>
          </template>
        </a-card>
      </div>
    </main>
  </div>
</template>
