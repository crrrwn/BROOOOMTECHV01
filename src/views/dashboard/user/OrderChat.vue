<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="$router.go(-1)"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Order Chat</h1>
                <p class="text-sm text-gray-600">Order #{{ order?.order_number }}</p>
              </div>
            </div>
            
            <div v-if="order" class="flex items-center space-x-4">
              <span
                :class="getStatusClass(order.status)"
                class="px-3 py-1 text-sm font-medium rounded-full"
              >
                {{ formatStatus(order.status) }}
              </span>
              
              <div v-if="driver" class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ driver.first_name?.charAt(0) }}{{ driver.last_name?.charAt(0) }}
                </div>
                <div class="text-sm">
                  <p class="font-medium text-gray-900">{{ driver.first_name }} {{ driver.last_name }}</p>
                  <p class="text-gray-600">{{ driver.motorcycle_plate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading chat...</p>
      </div>

      <div v-else-if="!order" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">❌</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
        <p class="text-gray-600">The order you're looking for doesn't exist or you don't have access to it.</p>
      </div>

      <div v-else-if="!driver" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">⏳</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No driver assigned yet</h3>
        <p class="text-gray-600">Chat will be available once a driver is assigned to your order.</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
        <!-- Chat Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex',
              message.sender_id === user.id ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                message.sender_id === user.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              ]"
            >
              <div v-if="message.message_type === 'text'">
                <p class="text-sm">{{ message.content }}</p>
              </div>
              
              <div v-else-if="message.message_type === 'image'" class="space-y-2">
                <img
                  :src="message.content"
                  alt="Shared image"
                  class="max-w-full h-auto rounded cursor-pointer"
                  @click="viewImage(message.content)"
                />
                <p v-if="message.text" class="text-sm">{{ message.text }}</p>
              </div>
              
              <div v-else-if="message.message_type === 'file'" class="space-y-2">
                <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded p-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <a
                    :href="message.content"
                    target="_blank"
                    class="text-sm underline"
                  >
                    {{ message.file_name || 'Download File' }}
                  </a>
                </div>
                <p v-if="message.text" class="text-sm">{{ message.text }}</p>
              </div>
              
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs opacity-75">
                  {{ formatTime(message.created_at) }}
                </span>
                <div v-if="message.sender_id === user.id" class="flex items-center space-x-1">
                  <svg
                    v-if="message.read_at"
                    class="w-4 h-4 text-blue-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="border-t p-4">
          <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
            <div class="flex-1">
              <div v-if="selectedFile" class="mb-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                  </div>
                  <span class="text-sm text-gray-700">{{ selectedFile.name }}</span>
                </div>
                <button
                  type="button"
                  @click="removeFile"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div class="flex items-end space-x-2">
                <textarea
                  v-model="newMessage"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.shift.enter.exact="newMessage += '\n'"
                  @input="handleTyping"
                  placeholder="Type your message..."
                  rows="1"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  style="min-height: 40px; max-height: 120px;"
                ></textarea>
                
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  @change="handleFileSelect"
                  class="hidden"
                />
                
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              :disabled="(!newMessage.trim() && !selectedFile) || sending"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="sending" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </span>
              <span v-else>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div
      v-if="selectedImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      @click="closeImageViewer"
    >
      <div class="max-w-4xl max-h-full">
        <img
          :src="selectedImage"
          alt="Chat image"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
        <button
          @click="closeImageViewer"
          class="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useRealtime } from '@/composables/useRealtime'
import { useToast } from 'vue-toastification'

const route = useRoute()
const { supabase } = useSupabase()
const { user } = useAuth()
const { subscribeToTable } = useRealtime()
const toast = useToast()

// Data
const order = ref(null)
const driver = ref(null)
const messages = ref([])
const loading = ref(true)
const newMessage = ref('')
const selectedFile = ref(null)
const sending = ref(false)
const isTyping = ref(false)
const selectedImage = ref(null)
const messagesContainer = ref(null)
const typingTimeout = ref(null)

// Computed
const orderId = computed(() => route.params.id)

// Methods
const fetchOrder = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        driver:drivers(*)
      `)
      .eq('id', orderId.value)
      .eq('user_id', user.value.id)
      .single()

    if (error) throw error
    
    order.value = data
    driver.value = data.driver
  } catch (error) {
    console.error('Error fetching order:', error)
    toast.error('Failed to load order')
  }
}

const fetchMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('order_chats')
      .select('*')
      .eq('order_id', orderId.value)
      .order('created_at', { ascending: true })

    if (error) throw error
    
    messages.value = data || []
    
    // Mark messages as read
    await markMessagesAsRead()
    
    // Scroll to bottom
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching messages:', error)
    toast.error('Failed to load messages')
  }
}

const markMessagesAsRead = async () => {
  try {
    const unreadMessages = messages.value.filter(
      msg => msg.sender_id !== user.value.id && !msg.read_at
    )

    if (unreadMessages.length > 0) {
      const { error } = await supabase
        .from('order_chats')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadMessages.map(msg => msg.id))

      if (error) throw error
    }
  } catch (error) {
    console.error('Error marking messages as read:', error)
  }
}

const sendMessage = async () => {
  if ((!newMessage.value.trim() && !selectedFile.value) || sending.value) {
    return
  }

  try {
    sending.value = true
    let messageData = {
      order_id: orderId.value,
      sender_id: user.value.id,
      sender_type: 'user',
      message_type: 'text',
      content: newMessage.value.trim(),
      created_at: new Date().toISOString()
    }

    // Handle file upload
    if (selectedFile.value) {
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `chat-${orderId.value}-${Date.now()}.${fileExt}`
      const filePath = `chat-files/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('order-files')
        .upload(filePath, selectedFile.value)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('order-files')
        .getPublicUrl(filePath)

      messageData.message_type = selectedFile.value.type.startsWith('image/') ? 'image' : 'file'
      messageData.content = urlData.publicUrl
      messageData.file_name = selectedFile.value.name
      messageData.text = newMessage.value.trim()
    }

    const { error } = await supabase
      .from('order_chats')
      .insert([messageData])

    if (error) throw error

    // Clear form
    newMessage.value = ''
    selectedFile.value = null

    // Scroll to bottom
    await nextTick()
    scrollToBottom()

  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Failed to send message')
  } finally {
    sending.value = false
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must be less than 10MB')
    return
  }

  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
}

const handleTyping = () => {
  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  // Set typing indicator (in a real app, you'd send this to other users)
  typingTimeout.value = setTimeout(() => {
    // Stop typing indicator
  }, 1000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const viewImage = (imageUrl) => {
  selectedImage.value = imageUrl
}

const closeImageViewer = () => {
  selectedImage.value = null
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    picked_up: 'bg-orange-100 text-orange-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status) => {
  const statuses = {
    pending: 'Pending',
    approved: 'Approved',
    assigned: 'Assigned',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Watchers
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// Lifecycle
onMounted(async () => {
  loading.value = true
  
  await fetchOrder()
  await fetchMessages()
  
  loading.value = false

  // Subscribe to real-time chat updates
  subscribeToTable('order_chats', (payload) => {
    if (payload.new.order_id === orderId.value) {
      if (payload.eventType === 'INSERT') {
        messages.value.push(payload.new)
        
        // Show notification for new messages from driver
        if (payload.new.sender_id !== user.value.id) {
          toast.info('New message from driver')
          
          // Mark as read after a short delay
          setTimeout(() => {
            markMessagesAsRead()
          }, 1000)
        }
      } else if (payload.eventType === 'UPDATE') {
        const index = messages.value.findIndex(msg => msg.id === payload.new.id)
        if (index !== -1) {
          messages.value[index] = payload.new
        }
      }
    }
  })
})

onUnmounted(() => {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})
</script>
