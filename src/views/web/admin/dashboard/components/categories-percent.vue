<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      :body-style="{
        padding: '20px'
      }"
      :header-style="{ paddingBottom: '0' }"
      class="general-card"
    >
      <template #title>
        {{ $t('workplace.categoriesPercent') }}
      </template>
      <Chart :option="chartOption" height="310px" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading'
import useChartOption from '@/hooks/chart-option'
import { computed, ref } from 'vue'
import { getTours, getTourTypeText, TourType } from '@/apis/tour'
import { countBy } from 'lodash-es'

const { loading, setLoading } = useLoading()

const typeStatistic = ref<{ type: TourType; count: number }[]>([])
const SHOW_TAGS_NUM = 5
const typeNames = computed(() =>
  typeStatistic.value.slice(0, SHOW_TAGS_NUM).map((e) => getTourTypeText(e.type))
)
const typeCount = computed(() => typeStatistic.value.slice(0, SHOW_TAGS_NUM).map((e) => e.count))
// getTagStatistic().then((data) => {
//   typeStatistic.value = data
// })

const totalContentNum = ref(0)

// getVideoInfoAll()
//   .then((videos) => {
//     totalContentNum.value = videos.length
//   })
//   .finally(() => {
//     setLoading(false)
//   })
setLoading(true)
getTours()
  .then((apiRes) => {
    if (apiRes.success) {
      const tourList = apiRes.data!
      totalContentNum.value = tourList.length
      typeStatistic.value = Object.entries(countBy(tourList, 'type')).map((entry) => ({
        type: parseInt(entry[0]) as TourType,
        count: entry[1]
      }))
    }
  })
  .finally(() => {
    setLoading(false)
  })

const { chartOption } = useChartOption((isDark) => {
  // echarts support https://echarts.apache.org/zh/theme-builder.html
  // It's not used here
  return {
    legend: {
      left: 'center',
      data: typeNames.value,
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      textStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969'
      },
      itemStyle: {
        borderWidth: 0
      }
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: '内容量',
            textAlign: 'center',
            fill: isDark ? '#ffffffb3' : '#4E5969',
            fontSize: 14
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '50%',
          style: {
            text: totalContentNum.value,
            textAlign: 'center',
            fill: isDark ? '#ffffffb3' : '#1D2129',
            fontSize: 16,
            fontWeight: 500
          }
        }
      ]
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        label: {
          formatter: '{d}%',
          fontSize: 14,
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969'
        },
        itemStyle: {
          borderColor: isDark ? '#232324' : '#fff',
          borderWidth: 1
        },
        data: typeNames.value.map((_, index) => {
          return {
            value: typeCount.value[index],
            name: typeNames.value[index],
            itemStyle: {
              color: isDark ? itemStyles[index].dark : itemStyles[index].light
            }
          }
        })

        //   [
        //   {
        //     value: typeCount.value[0],
        //     name: typeNames.value[0],
        //     itemStyle: {
        //       color: isDark ? itemStyles[0].dark : itemStyles[0].light
        //     }
        //   },
        //   {
        //     value: typeCount.value[1],
        //     name: typeNames.value[1],
        //     itemStyle: {
        //       color: isDark ? itemStyles[1].dark : itemStyles[1].light
        //     }
        //   },
        //   {
        //     value: typeCount.value[2],
        //     name: typeNames.value[2],
        //     itemStyle: {
        //       color: isDark ? itemStyles[2].dark : itemStyles[2].light
        //     }
        //   }
        // ]
      }
    ]
  }
})

const itemStyles = [
  {
    dark: '#3D72F6',
    light: '#249EFF'
  },
  {
    dark: '#A079DC',
    light: '#313CA9'
  },
  {
    dark: '#6CAAF5',
    light: '#21CCFF'
  },
  // ------------,
  {
    dark: '#9a6cf5',
    light: '#215cff'
  },
  {
    dark: '#716cf5',
    light: '#21e5ff'
  }
]
</script>

<style lang="less" scoped></style>
