<template>
  <!-- Chat Toggle Button -->
  <div v-if="!isOpen" class="fixed bottom-6 right-6 z-50">
    <button
      @click="toggleChat"
      class="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.456-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
      </svg>
    </button>
    <!-- Notification Badge -->
    <div v-if="unreadCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
      {{ unreadCount }}
    </div>
  </div>

  <!-- Chat Window -->
  <div v-if="isOpen" class="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
    <!-- Header -->
    <div class="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <div class="font-semibold">BroomBot</div>
          <div class="text-xs opacity-90">{{ isTyping ? 'Typing...' : 'Online' }}</div>
        </div>
      </div>
      <button @click="toggleChat" class="text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      <div v-for="(message, index) in messages" :key="index" class="flex" :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
        <div class="max-w-xs">
          <div
            :class="[
              'px-3 py-2 rounded-lg text-sm',
              message.sender === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            ]"
          >
            <div v-if="message.type === 'text'" v-html="message.text"></div>
            <div v-else-if="message.type === 'quick_replies'" class="space-y-2">
              <div>{{ message.text }}</div>
              <div class="space-y-1">
                <button
                  v-for="reply in message.quick_replies"
                  :key="reply.payload"
                  @click="handleQuickReply(reply)"
                  class="block w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  {{ reply.title }}
                </button>
              </div>
            </div>
            <div v-else-if="message.type === 'order_status'" class="space-y-2">
              <div>{{ message.text }}</div>
              <div class="bg-gray-100 rounded p-2 text-xs">
                <div class="font-medium">Order #{{ message.order.order_number }}</div>
                <div>Status: {{ formatStatus(message.order.status) }}</div>
                <div>Total: ₱{{ message.order.total_amount }}</div>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-1" :class="message.sender === 'user' ? 'text-right' : 'text-left'">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-white border border-gray-200 rounded-lg rounded-bl-none px-3 py-2">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-gray-200 bg-white rounded-b-lg">
      <div class="flex space-x-2">
        <input
          ref="messageInput"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          :disabled="isTyping"
        />
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || isTyping"
          class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
      
      <!-- Quick Actions -->
      <div v-if="showQuickActions" class="mt-2 flex flex-wrap gap-1">
        <button
          v-for="action in quickActions"
          :key="action.payload"
          @click="handleQuickReply(action)"
          class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
        >
          {{ action.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const { userProfile } = useAuth()
const { select } = useSupabase()

// Refs
const messagesContainer = ref(null)
const messageInput = ref(null)

// Data
const isOpen = ref(false)
const newMessage = ref('')
const isTyping = ref(false)
const unreadCount = ref(0)
const showQuickActions = ref(true)
const greetingSent = ref(false)

const messages = ref([])

const quickActions = ref([
  { title: "📦 Check my orders", payload: "check_orders" },
  { title: "🚚 Track delivery", payload: "track_delivery" },
  { title: "💳 Payment help", payload: "payment_help" },
  { title: "📞 Contact support", payload: "contact_support" }
])

const faqData = ref([
  {
    keywords: ['track', 'tracking', 'where', 'location', 'driver'],
    response: "You can track your order in real-time! Go to 'My Orders' and click 'Track Live' on any active order to see your driver's location.",
    quick_replies: [
      { title: "View My Orders", payload: "goto_orders" },
      { title: "How does tracking work?", payload: "tracking_help" }
    ]
  },
  {
    keywords: ['payment', 'pay', 'gcash', 'paymaya', 'gotyme', 'cod'],
    response: "We accept multiple payment methods: GCash, PayMaya, GoTyme Bank (via QR codes), and Cash on Delivery. You'll need to upload payment proof for digital payments.",
    quick_replies: [
      { title: "Upload payment proof", payload: "goto_upload_payment" },
      { title: "Payment issues", payload: "payment_issues" }
    ]
  },
  {
    keywords: ['cancel', 'cancellation'],
    response: "You can cancel your order within 30 seconds after placing it. After that, please contact our support team for assistance.",
    quick_replies: [
      { title: "View cancellation policy", payload: "cancellation_policy" },
      { title: "Contact support", payload: "contact_support" }
    ]
  },
  {
    keywords: ['delivery', 'time', 'how long', 'duration'],
    response: "Delivery times vary based on distance and traffic. Typical deliveries take 30-60 minutes. You'll see an estimated time when booking.",
    quick_replies: [
      { title: "Book a service", payload: "goto_book_service" },
      { title: "Check delivery areas", payload: "delivery_areas" }
    ]
  },
  {
    keywords: ['price', 'pricing', 'cost', 'fee', 'expensive'],
    response: "Our AI calculates pricing based on distance, service type, time of day, and driver availability. Base fee starts at ₱40-70 depending on the service.",
    quick_replies: [
      { title: "How pricing works", payload: "pricing_help" },
      { title: "Book a service", payload: "goto_book_service" }
    ]
  }
])

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    if (!greetingSent.value) {
      sendGreeting()
      greetingSent.value = true
    }
    nextTick(() => {
      messageInput.value?.focus()
      scrollToBottom()
    })
  }
}

const sendGreeting = () => {
  const greeting = {
    sender: 'bot',
    type: 'quick_replies',
    text: `Hi ${userProfile.value?.first_name || 'there'}! 👋 I'm BroomBot, your AI assistant. How can I help you today?`,
    quick_replies: quickActions.value,
    timestamp: new Date()
  }
  messages.value.push(greeting)
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    sender: 'user',
    type: 'text',
    text: newMessage.value,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  showQuickActions.value = false
  
  scrollToBottom()
  
  // Process message
  await processMessage(messageText)
}

const processMessage = async (message) => {
  isTyping.value = true
  
  // Simulate typing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Check for order status queries
  const orderMatch = message.match(/order\s*#?(\w+)/i)
  if (orderMatch) {
    await handleOrderStatusQuery(orderMatch[1])
    isTyping.value = false
    return
  }
  
  // Check FAQ
  const faqResponse = checkFAQ(message)
  if (faqResponse) {
    const botMessage = {
      sender: 'bot',
      type: faqResponse.quick_replies ? 'quick_replies' : 'text',
      text: faqResponse.response,
      quick_replies: faqResponse.quick_replies,
      timestamp: new Date()
    }
    messages.value.push(botMessage)
    isTyping.value = false
    scrollToBottom()
    return
  }
  
  // Check for intent and redirect
  const intentResponse = checkIntent(message)
  if (intentResponse) {
    const botMessage = {
      sender: 'bot',
      type: 'quick_replies',
      text: intentResponse.text,
      quick_replies: intentResponse.quick_replies,
      timestamp: new Date()
    }
    messages.value.push(botMessage)
    isTyping.value = false
    scrollToBottom()
    return
  }
  
  // Default GPT-style response
  const responses = [
    "I understand you're asking about that. Let me help you find the right information!",
    "That's a great question! Here are some options that might help:",
    "I'm here to assist you with your delivery needs. What would you like to know more about?",
    "Let me help you with that. Here are some quick actions you can take:"
  ]
  
  const botMessage = {
    sender: 'bot',
    type: 'quick_replies',
    text: responses[Math.floor(Math.random() * responses.length)],
    quick_replies: quickActions.value,
    timestamp: new Date()
  }
  
  messages.value.push(botMessage)
  isTyping.value = false
  scrollToBottom()
}

const checkFAQ = (message) => {
  const lowerMessage = message.toLowerCase()
  
  for (const faq of faqData.value) {
    if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return faq
    }
  }
  
  return null
}

const checkIntent = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('book') || lowerMessage.includes('order') || lowerMessage.includes('service')) {
    return {
      text: "I can help you book a service! What type of delivery do you need?",
      quick_replies: [
        { title: "🍔 Food Delivery", payload: "goto_book_service?service=food_delivery" },
        { title: "🛒 Grocery", payload: "goto_book_service?service=grocery" },
        { title: "💊 Medicines", payload: "goto_book_service?service=medicines" },
        { title: "📋 All Services", payload: "goto_book_service" }
      ]
    }
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
    return {
      text: "I'm here to help! What do you need assistance with?",
      quick_replies: [
        { title: "Order issues", payload: "order_help" },
        { title: "Payment problems", payload: "payment_help" },
        { title: "App navigation", payload: "app_help" },
        { title: "Contact human support", payload: "contact_support" }
      ]
    }
  }
  
  return null
}

const handleOrderStatusQuery = async (orderNumber) => {
  try {
    const { data, error } = await select('orders', '*')
      .eq('user_id', userProfile.value.id)
      .ilike('order_number', `%${orderNumber}%`)
      .limit(1)
    
    if (error) throw error
    
    if (data && data.length > 0) {
      const order = data[0]
      const botMessage = {
        sender: 'bot',
        type: 'order_status',
        text: `Here's the status of your order:`,
        order: order,
        timestamp: new Date()
      }
      messages.value.push(botMessage)
      
      // Add quick actions for the order
      const orderActions = {
        sender: 'bot',
        type: 'quick_replies',
        text: "What would you like to do with this order?",
        quick_replies: [
          { title: "Track live", payload: `track_order_${order.id}` },
          { title: "View details", payload: `goto_order_${order.id}` },
          { title: "Chat with driver", payload: `chat_driver_${order.id}` }
        ],
        timestamp: new Date()
      }
      messages.value.push(orderActions)
    } else {
      const botMessage = {
        sender: 'bot',
        type: 'text',
        text: `I couldn't find an order with number "${orderNumber}". Please check the order number and try again.`,
        timestamp: new Date()
      }
      messages.value.push(botMessage)
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    const botMessage = {
      sender: 'bot',
      type: 'text',
      text: "Sorry, I'm having trouble accessing your order information right now. Please try again later.",
      timestamp: new Date()
    }
    messages.value.push(botMessage)
  }
}

const handleQuickReply = (reply) => {
  // Add user message
  const userMessage = {
    sender: 'user',
    type: 'text',
    text: reply.title,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  // Handle the action
  handleAction(reply.payload)
  scrollToBottom()
}

const handleAction = async (payload) => {
  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (payload.startsWith('goto_')) {
    const route = payload.replace('goto_', '')
    
    const botMessage = {
      sender: 'bot',
      type: 'text',
      text: `Redirecting you to ${route.replace('_', ' ')}...`,
      timestamp: new Date()
    }
    messages.value.push(botMessage)
    
    setTimeout(() => {
      if (route.includes('?')) {
        const [path, query] = route.split('?')
        const params = new URLSearchParams(query)
        router.push({ path: `/dashboard/user/${path.replace('_', '-')}`, query: Object.fromEntries(params) })
      } else {
        router.push(`/dashboard/user/${route.replace('_', '-')}`)
      }
      isOpen.value = false
    }, 1000)
  } else if (payload === 'check_orders') {
    await handleOrdersQuery()
  } else if (payload === 'contact_support') {
    const botMessage = {
      sender: 'bot',
      type: 'text',
      text: "For human support, please contact us at:\n📧 support@broomtech.com\n📞 +63 917 123 4567\n\nOur support team is available 24/7!",
      timestamp: new Date()
    }
    messages.value.push(botMessage)
  } else {
    // Default response for other actions
    const botMessage = {
      sender: 'bot',
      type: 'quick_replies',
      text: "Here are some things I can help you with:",
      quick_replies: quickActions.value,
      timestamp: new Date()
    }
    messages.value.push(botMessage)
  }
  
  isTyping.value = false
  scrollToBottom()
}

const handleOrdersQuery = async () => {
  try {
    const { data, error } = await select('orders', '*')
      .eq('user_id', userProfile.value.id)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (error) throw error
    
    if (data && data.length > 0) {
      const botMessage = {
        sender: 'bot',
        type: 'text',
        text: `You have ${data.length} recent orders. Here are your latest:`,
        timestamp: new Date()
      }
      messages.value.push(botMessage)
      
      data.forEach(order => {
        const orderMessage = {
          sender: 'bot',
          type: 'order_status',
          text: '',
          order: order,
          timestamp: new Date()
        }
        messages.value.push(orderMessage)
      })
      
      const actionMessage = {
        sender: 'bot',
        type: 'quick_replies',
        text: "What would you like to do?",
        quick_replies: [
          { title: "View all orders", payload: "goto_my_orders" },
          { title: "Book new service", payload: "goto_book_service" },
          { title: "Track active orders", payload: "track_delivery" }
        ],
        timestamp: new Date()
      }
      messages.value.push(actionMessage)
    } else {
      const botMessage = {
        sender: 'bot',
        type: 'quick_replies',
        text: "You don't have any orders yet. Would you like to book your first service?",
        quick_replies: [
          { title: "Book a service", payload: "goto_book_service" },
          { title: "Learn about our services", payload: "service_info" }
        ],
        timestamp: new Date()
      }
      messages.value.push(botMessage)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    const botMessage = {
      sender: 'bot',
      type: 'text',
      text: "Sorry, I'm having trouble accessing your orders right now. Please try again later.",
      timestamp: new Date()
    }
    messages.value.push(botMessage)
  }
}

const formatStatus = (status) => {
  const statuses = {
    placed: 'Placed',
    pending_approval: 'Pending Approval',
    assigned: 'Assigned',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Watch for new messages when chat is closed
watch(messages, (newMessages) => {
  if (!isOpen.value && newMessages.length > 0) {
    const lastMessage = newMessages[newMessages.length - 1]
    if (lastMessage.sender === 'bot') {
      unreadCount.value++
    }
  }
}, { deep: true })

onMounted(() => {
  // Initialize chat with welcome message when user first visits
  if (messages.value.length === 0) {
    setTimeout(() => {
      if (!isOpen.value) {
        unreadCount.value = 1
      }
    }, 3000)
  }
})
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
