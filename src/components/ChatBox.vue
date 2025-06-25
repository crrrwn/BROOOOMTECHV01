<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Toggle Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
      </svg>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200"
    >
      <!-- Chat Header -->
      <div class="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 class="font-semibold">BroomTech Assistant</h3>
        </div>
        <button @click="toggleChat" class="text-white hover:text-gray-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Chat Messages -->
      <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-xs px-3 py-2 rounded-lg text-sm',
              message.sender === 'user'
                ? 'bg-primary-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            ]"
          >
            {{ message.text }}
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg rounded-bl-none text-sm">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            v-model="currentMessage"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            :disabled="isTyping"
          />
          <button
            @click="sendMessage"
            :disabled="!currentMessage.trim() || isTyping"
            class="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const isOpen = ref(false)
const currentMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const { user, userProfile } = useAuth()

const messages = ref([
  {
    id: 1,
    sender: 'bot',
    text: `Hello! I'm your BroomTech assistant. How can I help you today?`,
    timestamp: new Date()
  }
])

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: currentMessage.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''

  await nextTick()
  scrollToBottom()

  // Show typing indicator
  isTyping.value = true

  // Simulate AI response
  setTimeout(async () => {
    const botResponse = await generateAIResponse(messageText)
    
    messages.value.push({
      id: Date.now(),
      sender: 'bot',
      text: botResponse,
      timestamp: new Date()
    })

    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
}

const generateAIResponse = async (userMessage) => {
  const message = userMessage.toLowerCase()

  // Intent detection and responses
  if (message.includes('order') && message.includes('status')) {
    return "I can help you check your order status! Please go to 'My Orders' in your dashboard to see real-time updates on all your deliveries."
  }

  if (message.includes('track') || message.includes('where')) {
    return "You can track your order in real-time! Once a driver is assigned, you'll see their location on the map in your order details."
  }

  if (message.includes('cancel')) {
    return "You can cancel your order within 30 seconds of placing it. After that, please contact our support team for assistance."
  }

  if (message.includes('payment') || message.includes('pay')) {
    return "We accept GCash, PayMaya, GoTyme, and Cash on Delivery. You can upload your payment proof in the 'Upload Payment' section."
  }

  if (message.includes('driver') || message.includes('delivery')) {
    return "Our drivers are carefully vetted and approved. You'll be able to chat with your assigned driver and track their location in real-time."
  }

  if (message.includes('book') || message.includes('service')) {
    return "You can book our services by going to 'Book a Service' in your dashboard. We offer food delivery, grocery shopping, bill payments, and more!"
  }

  if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
    return "Our pricing is dynamic based on distance, time, and demand. You'll see the exact fee before confirming your order."
  }

  if (message.includes('help') || message.includes('support')) {
    return "I'm here to help! You can ask me about orders, payments, services, or any other questions about BroomTech."
  }

  if (message.includes('hello') || message.includes('hi')) {
    const greeting = user.value ? `Hi ${userProfile.value?.first_name || 'there'}!` : 'Hello!'
    return `${greeting} Welcome to BroomTech! How can I assist you today?`
  }

  // Default responses
  const defaultResponses = [
    "I understand you're asking about that. Could you please be more specific so I can help you better?",
    "That's a great question! For detailed information, you might want to check your dashboard or contact our support team.",
    "I'm here to help with BroomTech services. Could you tell me more about what you need assistance with?",
    "Thanks for reaching out! Is there something specific about our delivery services I can help you with?"
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  // Add personalized greeting if user is logged in
  if (user.value && userProfile.value) {
    setTimeout(() => {
      messages.value.push({
        id: Date.now(),
        sender: 'bot',
        text: `Welcome back, ${userProfile.value.first_name}! I can help you with order tracking, booking services, or any questions you might have.`,
        timestamp: new Date()
      })
    }, 2000)
  }
})
</script>
