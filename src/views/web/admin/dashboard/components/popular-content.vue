<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      :body-style="{ padding: '17px 20px 21px 20px' }"
      :header-style="{ paddingBottom: '0' }"
      class="general-card"
    >
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <!--        <a-link>{{ $t('workplace.viewMore') }}</a-link>-->
        <span>热度 Top10</span>
      </template>
      <a-space :size="10" direction="vertical" fill>
        <a-radio-group v-model:model-value="type" type="button">
          <a-radio value="video">
            {{ $t('workplace.popularContent.video') }}
          </a-radio>
          <a-radio disabled value="image">
            {{ $t('workplace.popularContent.image') }}
          </a-radio>
          <a-radio disabled value="text">
            {{ $t('workplace.popularContent.text') }}
          </a-radio>
        </a-radio-group>
        <a-table
          :bordered="false"
          :data="renderList"
          :pagination="false"
          :scroll="{ x: '100%', y: '264px' }"
        >
          <template #columns>
            <a-table-column :align="'center'" :fixed="'left'" data-index="index" title="排名">
              <template #cell="{ rowIndex }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1
                  }"
                >
                  {{ rankingArr ? rankingArr[rowIndex] : '-' }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column data-index="videoTitle" title="内容标题">
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1
                  }"
                >
                  {{ record.videoTitle }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column :align="'center'" data-index="playCount" title="点击量">
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1
                  }"
                >
                  {{ simplifyNumber(record.playCount, 0, 'EN').string }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <!--            <a-table-column-->
            <!--              title="日涨幅"-->
            <!--              data-index="increases"-->
            <!--              :sortable="{-->
            <!--                sortDirections: ['ascend', 'descend']-->
            <!--              }"-->
            <!--            >-->
            <!--              <template #cell="{ record }">-->
            <!--                <div class="increases-cell">-->
            <!--                  <span>{{ record.increases }}%</span>-->
            <!--                  <icon-caret-up-->
            <!--                    v-if="record.increases !== 0"-->
            <!--                    style="color: #f53f3f; font-size: 8px"-->
            <!--                  />-->
            <!--                </div>-->
            <!--              </template>-->
            <!--            </a-table-column>-->
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import useLoading from '@/hooks/loading'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import { getRankings, simplifyNumber } from '@/utils'

const type = ref('video')
const { loading, setLoading } = useLoading()
const renderList = ref<TableData[]>()
const rankingArr = computed(() =>
  renderList.value !== undefined ? getRankings(renderList.value.map((e) => e.playCount)) : undefined
)

setLoading(true)
// getVideoInfoAll()
//   .then((records) => {
//     renderList.value = records.sort((a, b) => b.playCount - a.playCount).slice(0, 10)
//   })
//   .finally(() => {
//     setLoading(false)
//   })
</script>

<style lang="less" scoped>
.general-card {
  min-height: 395px;
}

:deep(.arco-table-tr) {
  height: 44px;

  .arco-typography {
    margin-bottom: 0;
  }
}

.increases-cell {
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
}
</style>
