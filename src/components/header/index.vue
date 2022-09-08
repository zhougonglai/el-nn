<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <nav class="px-2 px-8 bg-white dark:bg-gray-800 drag">
    <div class="relative flex h-16 items-center justify-between">
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex flex-shrink-0 items-center">
          <img class="block h-8 w-auto lg:hidden" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company" />
          <img class="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company" />
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <router-link v-for="item in navigation" :key="item.name" :to="item.href"
              :class="['text-gray-300 hover:bg-gray-700 hover:text-white', 'w-20 py-2 text-center rounded-md text-sm font-medium']"
              exact-active-class="bg-gray-900 text-white" :aria-current="item.current ? 'page' : undefined">{{
              item.name }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex space-x-3 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button type="button" @click="toggleTheme"
          class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <MoonIcon class="h-6 w-6" v-if="themeInfo.dark" />
          <SunIcon class="h-6 w-6" v-else />
        </button>
        <button type="button"
          class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span class="sr-only">View notifications</span>
          <BellIcon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Profile dropdown -->
        <Menu as="div" class="relative">
          <MenuButton
            class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span class="sr-only">打开用户面板</span>
            <img class="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="" />
          </MenuButton>
          <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem v-slot="{ active }">
              <button :class="[active ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-sm text-gray-700']"
                @click="openDialog">
                用户资料
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
              <button :class="[active ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-sm text-gray-700']"
                @click="openWin">
                设置
              </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { onBeforeMount, onMounted, reactive } from '@vue/runtime-core'
import { useTheme } from '../../store/theme';

const navigation = [
  { name: '首页', href: '/' },
  { name: '设置', href: '/setting' },
]

const themeInfo = useTheme();

const openDialog = async () => {
  await window.electronAPI.openFile({
    title: 'title',
    message: 'message',
    buttons: ['确定', '取消'],
    defaultId: 0,
    cancelId: 1,
    detail: 'detail',
    checkboxLabel: '信息',
  })
}

const openWin = async () => {
  await window.electronAPI.openWin('sign/in')
}

const toggleTheme = async () => {
  await window.darkMode.toggle();
}

onMounted(() => {
  window.darkMode.onThemeChange((e, theme) => {
    // console.log('onThemeChange', theme);
    themeInfo.dark = theme.dark;
    themeInfo.theme = theme.theme;
  })
})

onBeforeMount(async () => {
  const {
    dark,
    theme,
    shouldUseHighContrastColors,
    shouldUseInvertedColorScheme,
    inForcedColorsMode
  } = await window.darkMode.getTheme();
  themeInfo.dark = dark;
  themeInfo.theme = theme;
  themeInfo.shouldUseHighContrastColors = shouldUseHighContrastColors;
  themeInfo.shouldUseInvertedColorScheme = shouldUseInvertedColorScheme;
  themeInfo.inForcedColorsMode = inForcedColorsMode;
  themeInfo.systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})
</script>
