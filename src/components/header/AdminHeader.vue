<template>
  <div id="b-header">
    <div class="left-side">
      <a-space>
        <a-image :fit="'cover'" :src="logoTransparent" alt="logo" height="40" />
        <a-typography-title
          :heading="5"
          :style="{
            margin: '3px 0 3px 3px',
            fontSize: '18px',
            fontWeight: 'bold',
            textWrap: 'noWrap'
          }"
        >
          {{ authStore.isAdmin ? '后台管理平台' : '未登录' }}
        </a-typography-title>
      </a-space>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setDropDownVisible">
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption v-for="item in locales" :key="item.value" :value="item.value">
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button :shape="'circle'" class="nav-btn" type="outline" @click="handleToggleTheme">
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--      <li>-->
      <!--        <a-tooltip :content="$t('settings.navbar.alerts')">-->
      <!--          <div class="message-box-trigger">-->
      <!--            <a-badge :count="9" dot>-->
      <!--              <a-button-->
      <!--                class="nav-btn"-->
      <!--                type="outline"-->
      <!--                :shape="'circle'"-->
      <!--                @click="setPopoverVisible"-->
      <!--                disabled-->
      <!--              >-->
      <!--                <icon-notification />-->
      <!--              </a-button>-->
      <!--            </a-badge>-->
      <!--          </div>-->
      <!--        </a-tooltip>-->
      <!--        <a-popover-->
      <!--          trigger="click"-->
      <!--          :arrow-style="{ display: 'none' }"-->
      <!--          :content-style="{ padding: 0, minWidth: '400px' }"-->
      <!--          content-class="message-popover"-->
      <!--        >-->
      <!--          <div ref="refBtn" class="ref-btn"></div>-->
      <!--          <template #content>-->
      <!--            <message-box />-->
      <!--          </template>-->
      <!--        </a-popover>-->
      <!--      </li>-->
      <li>
        <a-tooltip
          :content="
            isFullscreen ? $t('settings.navbar.screen.toExit') : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button :shape="'circle'" class="nav-btn" type="outline" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown :trigger="['hover']">
          <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
            <img :src="userStore.getUserAvatar" alt="avatar" />
          </a-avatar>
          <template #content>
            <!--            <a-doption>-->
            <!--              <a-space @click="switchRoles">-->
            <!--                <icon-tag />-->
            <!--                <span>-->
            <!--                  {{ $t('messageBox.switchRoles') }}-->
            <!--                </span>-->
            <!--              </a-space>-->
            <!--            </a-doption>-->
            <!--            <a-doption>-->
            <!--              <a-space @click="$router.push({ name: 'Info' })">-->
            <!--                <icon-user />-->
            <!--                <span>-->
            <!--                  {{ $t('messageBox.userCenter') }}-->
            <!--                </span>-->
            <!--              </a-space>-->
            <!--            </a-doption>-->
            <!--            <a-doption>-->
            <!--              <a-space @click="$router.push({ name: 'Setting' })">-->
            <!--                <icon-settings />-->
            <!--                <span>-->
            <!--                  {{ $t('messageBox.userSettings') }}-->
            <!--                </span>-->
            <!--              </a-space>-->
            <!--            </a-doption>-->
            <a-doption>
              <a-space @click="$router.push({ name: 'discover' })">
                <icon-home />
                <span>
                  {{ $t('messageBox.goUserHome') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import logoTransparent from '/logo/green-transparent.png'

import { computed, ref } from 'vue'
import { useDark, useFullscreen, useToggle } from '@vueuse/core'
import { useAppStore, useAuthStore, useUserStore } from '@/stores'
import useLocale from '@/hooks/locale'
import { LOCALE_OPTIONS } from '@/locale'

const appStore = useAppStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const theme = computed(() => {
  return appStore.theme
})
const { changeLocale, currentLocale } = useLocale()
const locales = [...LOCALE_OPTIONS]

const refBtn = ref()
const triggerBtn = ref()
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  })
  refBtn.value.dispatchEvent(event)
}

const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  })
  triggerBtn.value.dispatchEvent(event)
}
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark)
  }
})
const toggleTheme = useToggle(isDark)
const handleToggleTheme = () => {
  toggleTheme()
}
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen()
const handleLogout = () => {
  authStore.handleLogout()
}
</script>

<style lang="scss" scoped>
#b-header {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;

    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      border-color: rgb(var(--gray-2));
      color: rgb(var(--gray-8));
      font-size: 16px;
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
}
</style>
