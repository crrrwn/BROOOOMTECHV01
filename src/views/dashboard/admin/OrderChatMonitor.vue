<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Order Chat Monitor</h1>
        <p class="text-gray-600 mt-2">Monitor and audit all order conversations</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <MessageSquare class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Chats</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeChats }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <Users class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Messages</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalMessages }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <AlertTriangle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Flagged Chats</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.flaggedChats }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <Clock class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.avgResponseTime }}m</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="order_filter" class="block text-sm font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              id="order_filter"
              v-model="filters.orderStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label for="chat_status_filter" class="block text-sm font-medium text-gray-700 mb-1">
              Chat Status
            </label>
            <select
              id="chat_status_filter"
              v-model="filters.chatStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Chats</option>
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label for="date_from" class="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              id="date_from"
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div class="flex items-end">
            <div class="flex space-x-2 w-full">
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Apply
              </button>
              <button
                @click="resetFilters"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Reset
              </button>
              <div class="flex-1 relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search orders..."
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-4 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p class="text-gray-600 mt-2">Loading chats...</p>
                </td>
              </tr>
              <tr v-else-if="orderChats.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No order chats found
                </td>
              </tr>
              <tr v-else v-for="chat in orderChats" :key="chat.order_id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="p-2 rounded-full bg-green-100 mr-3">
                      <Package class="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">#{{ chat.order_number }}</div>
                      <div class="text-sm text-gray-500">{{ chat.service_type?.replace(/_/g, ' ') }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <div class="flex items-center mb-1">
                      <User class="h-3 w-3 text-blue-500 mr-1" />
                      <span>{{ chat.user_name }}</span>
                    </div>
                    <div v-if="chat.driver_name" class="flex items-center">
                      <Truck class="h-3 w-3 text-green-500 mr-1" />
                      <span>{{ chat.driver_name }}</span>
                    </div>
                    <div v-else class="text-xs text-gray-400">No driver assigned</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ chat.message_count || 0 }}</div>
                  <div class="text-xs text-gray-500">
                    {{ chat.unread_count || 0 }} unread
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ chat.last_message_at ? formatDateTime(chat.last_message_at) : 'No messages' }}
                  </div>
                  <div v-if="chat.last_message" class="text-xs text-gray-500 truncate max-w-xs">
                    {{ chat.last_message }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-1">
                    <span :class="getOrderStatusColor(chat.order_status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ formatStatus(chat.order_status) }}
                    </span>
                    <span v-if="chat.is_flagged" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Flagged
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewChat(chat)"
                      class="text-green-600 hover:text-green-900"
                      title="View Chat"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      @click="exportChat(chat.order_id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Export Chat"
                    >
                      <Download class="h-4 w-4" />
                    </button>
                    <button
                      v-if="!chat.is_flagged"
                      @click="flagChat(chat.order_id)"
                      class="text-yellow-600 hover:text-yellow-900"
                      title="Flag Chat"
                    >
                      <Flag class="h-4 w-4" />
                    </button>
                    <button
                      v-if="chat.is_flagged"
                      @click="unflagChat(chat.order_id)"
                      class="text-green-600 hover:text-green-900"
                      title="Unflag Chat"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalChats) }} of {{ totalChats }} results
            </div>
            <div class="flex space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Viewer Modal -->
      <div v-if="selectedChat" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                Order Chat - #{{ selectedChat.order_number }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ selectedChat.user_name }} ↔ {{ selectedChat.driver_name || 'No driver assigned' }}
              </p>
            </div>
            <button @click="selectedChat = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto p-6 max-h-96">
            <div v-if="loadingMessages" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p class="text-gray-600 mt-2">Loading messages...</p>
            </div>
            <div v-else-if="chatMessages.length === 0" class="text-center py-8 text-gray-500">
              No messages in this chat
            </div>
            <div v-else class="space-y-4">
              <div v-for="message in chatMessages" :key="message.id" class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div :class="getSenderColor(message.sender_type)" class="w-8 h-8 rounded-full flex items-center justify-center">
                    <component :is="getSenderIcon(message.sender_type)" class="h-4 w-4 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">
                      {{ getSenderName(message, selectedChat) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ formatDateTime(message.created_at) }}
                    </span>
                    <span v-if="message.is_flagged" class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Flagged
                    </span>
                  </div>
                  <div class="mt-1">
                    <p class="text-sm text-gray-700">{{ message.message }}</p>
                    <div v-if="message.attachment_url" class="mt-2">
                      <img
                        :src="message.attachment_url"
                        alt="Attachment"
                        class="max-w-xs rounded border cursor-pointer"
                        @click="viewAttachment(message.attachment_url)"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <button
                    v-if="!message.is_flagged"
                    @click="flagMessage(message.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Flag Message"
                  >
                    <Flag class="h-3 w-3" />
                  </button>
                  <button
                    v-else
                    @click="unflagMessage(message.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Unflag Message"
                  >
                    <CheckCircle class="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Actions -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex space-x-2">
              <button
                @click="exportChat(selectedChat.order_id)"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Export Chat
              </button>
              <button
                v-if="!selectedChat.is_flagged"
                @click="flagChat(selectedChat.order_id)"
                class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Flag Entire Chat
              </button>
              <button
                v-else
                @click="unflagChat(selectedChat.order_id)"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Unflag Chat
              </button>
              <button
                @click="sendAdminMessage"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Send Admin Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Message Modal -->
      <div v-if="showAdminMessageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Send Admin Message</h3>
            <button @click="showAdminMessageModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="submitAdminMessage">
              <div class="mb-4">
                <label for="admin_message" class="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="admin_message"
                  v-model="adminMessage"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your admin message..."
                ></textarea>
              </div>
              <div class="flex space-x-2">
                <button
                  type="submit"
                  :disabled="sendingMessage"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {{ sendingMessage ? 'Sending...' : 'Send Message' }}
                </button>
                <button
                  type="button"
                  @click="showAdminMessageModal = false"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Attachment Viewer Modal -->
      <div v-if="viewingAttachment" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Attachment</h3>
            <button @click="viewingAttachment = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6 text-center">
            <img
              :src="viewingAttachment"
              alt="Attachment"
              class="max-w-full max-h-96 mx-auto rounded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { 
  MessageSquareIcon as MessageSquare, 
  UsersIcon as Users, 
  AlertTriangleIcon as AlertTriangle, 
  ClockIcon as Clock, 
  SearchIcon as Search, 
  EyeIcon as Eye, 
  DownloadIcon as Download, 
  FlagIcon as Flag, 
  CheckCircleIcon as CheckCircle, 
  XIcon as X, 
  PackageIcon as Package, 
  UserIcon as User, 
  TruckIcon as Truck, 
  ShieldIcon as Shield 
} from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const { supabase } = useSupabase()
const { subscribeToOrderChats } = useRealtime()
const toast = useToast()

const loading = ref(true)
const loadingMessages = ref(false)
const sendingMessage = ref(false)
const orderChats = ref([])
const chatMessages = ref([])
const selectedChat = ref(null)
const showAdminMessageModal = ref(false)
const adminMessage = ref('')
const viewingAttachment = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalChats = ref(0)
const searchQuery = ref('')

const stats = ref({
  activeChats: 0,
  totalMessages: 0,
  flaggedChats: 0,
  avgResponseTime: 0
})

const filters = ref({
  orderStatus: '',
  chatStatus: '',
  dateFrom: ''
})

const totalPages = computed(() => Math.ceil(totalChats.value / pageSize.value))

const loadStats = async () => {
  try {
    // Active chats (orders with messages)
    const { count: activeChats } = await supabase
      .from('order_chats')
      .select('order_id', { count: 'exact', head: true })
      .not('order_id', 'is', null)

    // Total messages
    const { count: totalMessages } = await supabase
      .from('order_chats')
      .select('*', { count: 'exact', head: true })

    // Flagged chats
    const { count: flaggedChats } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('chat_flagged', true)

    stats.value = {
      activeChats: activeChats || 0,
      totalMessages: totalMessages || 0,
      flaggedChats: flaggedChats || 0,
      avgResponseTime: 5.2 // This would be calculated from actual response times
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadOrderChats = async () => {
  try {
    loading.value = true

    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        service_type,
        status,
        chat_flagged,
        created_at,
        users(first_name, last_name),
        drivers(first_name, last_name),
        order_chats(
          id,
          message,
          sender_type,
          created_at,
          is_flagged
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.value.orderStatus) {
      query = query.eq('status', filters.value.orderStatus)
    }
    if (filters.value.chatStatus === 'flagged') {
      query = query.eq('chat_flagged', true)
    }
    if (filters.value.dateFrom) {
      query = query.gte('created_at', filters.value.dateFrom)
    }
    if (searchQuery.value) {
      query = query.ilike('order_number', `%${searchQuery.value}%`)
    }

    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Process the data to include chat statistics
    const processedChats = (data || []).map(order => {
      const messages = order.order_chats || []
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null

      return {
        order_id: order.id,
        order_number: order.order_number,
        service_type: order.service_type,
        order_status: order.status,
        is_flagged: order.chat_flagged,
        user_name: order.users ? `${order.users.first_name} ${order.users.last_name}` : 'Unknown User',
        driver_name: order.drivers ? `${order.drivers.first_name} ${order.drivers.last_name}` : null,
        message_count: messages.length,
        unread_count: messages.filter(m => !m.is_read).length,
        last_message_at: lastMessage?.created_at,
        last_message: lastMessage?.message,
        created_at: order.created_at
      }
    })

    orderChats.value = processedChats
    totalChats.value = count || 0
  } catch (error) {
    console.error('Error loading order chats:', error)
    toast.error('Failed to load order chats')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadOrderChats()
}

const resetFilters = () => {
  filters.value = {
    orderStatus: '',
    chatStatus: '',
    dateFrom: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
  loadOrderChats()
}

const viewChat = async (chat) => {
  selectedChat.value = chat
  await loadChatMessages(chat.order_id)
}

const loadChatMessages = async (orderId) => {
  try {
    loadingMessages.value = true

    const { data, error } = await supabase
      .from('order_chats')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    if (error) throw error

    chatMessages.value = data || []
  } catch (error) {
    console.error('Error loading chat messages:', error)
    toast.error('Failed to load chat messages')
  } finally {
    loadingMessages.value = false
  }
}

const exportChat = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('order_chats')
      .select(`
        *,
        orders(order_number, users(first_name, last_name), drivers(first_name, last_name))
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Create CSV content
    const order = data[0]?.orders
    const csvContent = [
      ['Order Number', 'Sender', 'Message', 'Timestamp', 'Flagged'],
      ...data.map(msg => [
        order?.order_number || 'N/A',
        getSenderName(msg, { 
          user_name: order?.users ? `${order.users.first_name} ${order.users.last_name}` : 'Unknown',
          driver_name: order?.drivers ? `${order.drivers.first_name} ${order.drivers.last_name}` : 'No Driver'
        }),
        msg.message,
        new Date(msg.created_at).toLocaleString(),
        msg.is_flagged ? 'Yes' : 'No'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${order?.order_number || orderId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Chat exported successfully!')
  } catch (error) {
    console.error('Error exporting chat:', error)
    toast.error('Failed to export chat')
  }
}

const flagChat = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        chat_flagged: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    toast.success('Chat flagged successfully')
    await loadStats()
    await loadOrderChats()
    if (selectedChat.value?.order_id === orderId) {
      selectedChat.value.is_flagged = true
    }
  } catch (error) {
    console.error('Error flagging chat:', error)
    toast.error('Failed to flag chat')
  }
}

const unflagChat = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        chat_flagged: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    toast.success('Chat unflagged successfully')
    await loadStats()
    await loadOrderChats()
    if (selectedChat.value?.order_id === orderId) {
      selectedChat.value.is_flagged = false
    }
  } catch (error) {
    console.error('Error unflagging chat:', error)
    toast.error('Failed to unflag chat')
  }
}

const flagMessage = async (messageId) => {
  try {
    const { error } = await supabase
      .from('order_chats')
      .update({ 
        is_flagged: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId)

    if (error) throw error

    toast.success('Message flagged successfully')
    
    // Update local message
    const message = chatMessages.value.find(m => m.id === messageId)
    if (message) {
      message.is_flagged = true
    }
  } catch (error) {
    console.error('Error flagging message:', error)
    toast.error('Failed to flag message')
  }
}

const unflagMessage = async (messageId) => {
  try {
    const { error } = await supabase
      .from('order_chats')
      .update({ 
        is_flagged: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId)

    if (error) throw error

    toast.success('Message unflagged successfully')
    
    // Update local message
    const message = chatMessages.value.find(m => m.id === messageId)
    if (message) {
      message.is_flagged = false
    }
  } catch (error) {
    console.error('Error unflagging message:', error)
    toast.error('Failed to unflag message')
  }
}

const sendAdminMessage = () => {
  showAdminMessageModal.value = true
}

const submitAdminMessage = async () => {
  try {
    sendingMessage.value = true

    const { error } = await supabase
      .from('order_chats')
      .insert({
        order_id: selectedChat.value.order_id,
        sender_type: 'admin',
        sender_id: null, // Admin doesn't have a specific ID
        message: adminMessage.value,
        is_admin_message: true
      })

    if (error) throw error

    toast.success('Admin message sent successfully')
    adminMessage.value = ''
    showAdminMessageModal.value = false
    
    // Reload chat messages
    await loadChatMessages(selectedChat.value.order_id)
  } catch (error) {
    console.error('Error sending admin message:', error)
    toast.error('Failed to send admin message')
  } finally {
    sendingMessage.value = false
  }
}

const viewAttachment = (url) => {
  viewingAttachment.value = url
}

const getSenderColor = (senderType) => {
  const colors = {
    user: 'bg-blue-500',
    driver: 'bg-green-500',
    admin: 'bg-purple-500'
  }
  return colors[senderType] || 'bg-gray-500'
}

const getSenderIcon = (senderType) => {
  const icons = {
    user: User,
    driver: Truck,
    admin: Shield
  }
  return icons[senderType] || User
}

const getSenderName = (message, chat) => {
  if (message.sender_type === 'admin') return 'Admin'
  if (message.sender_type === 'user') return chat.user_name || 'User'
  if (message.sender_type === 'driver') return chat.driver_name || 'Driver'
  return 'Unknown'
}

const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(currentPage, () => {
  loadOrderChats()
})

watch(searchQuery, () => {
  if (searchQuery.value.length === 0 || searchQuery.value.length >= 3) {
    currentPage.value = 1
    loadOrderChats()
  }
})

onMounted(async () => {
  await loadStats()
  await loadOrderChats()
  
  // Subscribe to real-time updates
  subscribeToOrderChats(() => {
    loadStats()
    loadOrderChats()
  })
})
</script>
