import type { App } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components'
import Chart from './Charts/dashboardChart.vue'
import Breadcrumb from './breadcrumb/index.vue'

import Parallax from './Parallax.vue'

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent
])

export { Parallax }

export default {
  install(Vue: App) {
    Vue.component('Chart', Chart)
    Vue.component('Breadcrumb', Breadcrumb)
  }
}
