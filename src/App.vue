<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
    <ChatBox v-if="showChatBox" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ChatBox from './components/ChatBox.vue'

const route = useRoute()
const showChatBoxRef = ref(false)

const showChatBox = computed(() => {
  // Show chatbox on all pages except auth pages
  showChatBoxRef.value = !route.path.includes('/auth/')
  return showChatBoxRef.value
})
</script>
