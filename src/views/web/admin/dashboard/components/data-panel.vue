<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }" class="panel-col">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <a-image :preview-visible="false" :src="dataPanelPic1" alt="avatar" show-loader />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.onlineContent')"
          :value="parseInt(allContentNum.value)"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            {{ allContentNum.unit }}<span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }" class="panel-col">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <a-image :preview-visible="false" :src="dataPanelPic2" alt="avatar" show-loader />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.putIn')"
          :value="parseInt(onlineContentNum.value)"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            {{ onlineContentNum.unit }}<span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }" class="panel-col">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <a-image :preview-visible="false" :src="dataPanelPic3" alt="avatar" show-loader />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.newDay')"
          :value="newPlayNum"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      class="panel-col"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <a-image :preview-visible="false" :src="dataPanelPic4" alt="avatar" show-loader />
        </a-avatar>
        <a-statistic
          :precision="1"
          :title="$t('workplace.newFromYesterday')"
          :value="newplayNumRate"
          :value-from="0"
          animation
        >
          <template #suffix>
            %
            <icon-caret-up
              v-if="newplayNumRate >= 0 || isNaN(newplayNumRate)"
              class="success-icon"
            />
            <icon-caret-down v-else class="danger-icon" />
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
import dataPanelPic1 from '/public/admin/dashboard/1.png'
import dataPanelPic2 from '/public/admin/dashboard/2.png'
import dataPanelPic3 from '/public/admin/dashboard/3.png'
import dataPanelPic4 from '/public/admin/dashboard/4.png'

import { computed, onMounted, ref } from 'vue'
import { simplifyNumber } from '@/utils'
import { getTours, type TourRecord, TourStatus, TourStatusMap } from '@/apis/tour'
import type { ContentDataRecord } from '../types'

const tourList = ref<TourRecord[]>([])
const allContentNum = computed(() => simplifyNumber(tourList.value.length, 0, 'EN'))
const onlineContentNum = computed(() =>
  simplifyNumber(
    tourList.value.filter((tour) => TourStatusMap[tour.status as TourStatus] === 'online').length,
    0,
    'EN'
  )
)

const weeklyPlayNumList = ref<ContentDataRecord[]>([])
const newPlayNum = computed(() => {
  if (weeklyPlayNumList.value.length > 0) {
    let list = weeklyPlayNumList.value
    return list[list.length - 1].number
  }
  return 0
})

const newplayNumRate = computed(() => {
  if (weeklyPlayNumList.value.length > 0) {
    let list = weeklyPlayNumList.value
    let yesterdayNewPlayNum = list[list.length - 2].number
    if (yesterdayNewPlayNum === 0) {
      return NaN
    }
    return (100 * (newPlayNum.value - yesterdayNewPlayNum)) / yesterdayNewPlayNum
  }
  return NaN
})

// const yesterdayNewPlayNum = computed(() => {
//   if (weeklyPlayNumList.value.length > 0) {
//     let list = weeklyPlayNumList.value
//     return list[list.length - 2].y - list[list.length - 3].y
//   }
//   return 0
// })

onMounted(() => {
  getTours().then((apiRes) => {
    if (apiRes.success) {
      tourList.value = apiRes.data!
    }
  })
  // pullVideo({
  //   allStatus: 'all'
  // }).then((videos) => {
  //   tourList.value = videos
  // })
  // fetch(prefix_url.concat('tour/get/weekly'))
  //   .then((res) => {
  //     if (res.ok) {
  //       res.json().then((data: ContentDataRecord[]) => {
  //         weeklyPlayNumList.value = data
  //       })
  //     } else {
  //       Message.error(res.statusText)
  //     }
  //   })
  //   .catch((e) => {
  //     Message.error(e.message)
  //   })
})
</script>

<style lang="less" scoped>
.arco-grid.panel {
  margin-bottom: 0;
  padding: 16px 20px 0 20px;
}

.panel-col {
  padding-left: 43px;
  border-right: 1px solid rgb(var(--gray-2));
}

.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}

.danger-icon {
  color: rgb(var(--red-6));
}

.success-icon {
  color: #06be5e;
}

.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}

:deep(.panel-border) {
  margin: 4px 0 0 0;
}
</style>
