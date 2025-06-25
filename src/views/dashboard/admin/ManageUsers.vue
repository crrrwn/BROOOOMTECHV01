<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p class="text-gray-600 mt-2">View and manage all customer accounts</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <Users class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <UserCheck class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <ShoppingBag class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100">
              <Ban class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Banned Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.banned }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="status_filter" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status_filter"
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label for="date_from" class="block text-sm font-medium text-gray-700 mb-1">
              Joined From
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
                  placeholder="Search users..."
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
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
                  <p class="text-gray-600 mt-2">Loading users...</p>
                </td>
              </tr>
              <tr v-else-if="users.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
              <tr v-else v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      :src="user.profile_picture || '/placeholder.svg?height=40&width=40'"
                      alt="User"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Joined {{ formatDate(user.created_at) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.contact_number }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatStatus(user.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ user.total_orders || 0 }}</span>
                    <span class="text-xs text-gray-500">{{ user.completed_orders || 0 }} completed</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₱{{ (user.total_spent || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewUser(user)"
                      class="text-green-600 hover:text-green-900"
                      title="View Details"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      @click="viewUserOrders(user.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="View Orders"
                    >
                      <ShoppingBag class="h-4 w-4" />
                    </button>
                    <button
                      v-if="user.status === 'active'"
                      @click="banUser(user.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Ban User"
                    >
                      <Ban class="h-4 w-4" />
                    </button>
                    <button
                      v-if="user.status === 'banned'"
                      @click="unbanUser(user.id)"
                      class="text-green-600 hover:text-green-900"
                      title="Unban User"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button
                      @click="sendNotification(user.id)"
                      class="text-purple-600 hover:text-purple-900"
                      title="Send Notification"
                    >
                      <Bell class="h-4 w-4" />
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
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} results
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

      <!-- User Details Modal -->
      <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              User Details - {{ selectedUser.first_name }} {{ selectedUser.last_name }}
            </h3>
            <button @click="selectedUser = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Personal Information -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <img
                      :src="selectedUser.profile_picture || '/placeholder.svg?height=80&width=80'"
                      alt="User"
                      class="w-20 h-20 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <h5 class="text-lg font-medium">
                        {{ selectedUser.first_name }} {{ selectedUser.middle_name }} {{ selectedUser.last_name }}
                      </h5>
                      <p class="text-gray-600">{{ selectedUser.email }}</p>
                      <p class="text-gray-600">{{ selectedUser.contact_number }}</p>
                    </div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Address</h6>
                    <p class="text-sm text-gray-600">{{ selectedUser.address || 'Not provided' }}</p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Account Status</h6>
                    <span :class="getStatusColor(selectedUser.status)" class="px-2 py-1 rounded text-sm">
                      {{ formatStatus(selectedUser.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Order Statistics -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Order Statistics</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-green-600">{{ selectedUser.total_orders || 0 }}</p>
                      <p class="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-blue-600">{{ selectedUser.completed_orders || 0 }}</p>
                      <p class="text-sm text-gray-600">Completed</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-purple-600">₱{{ (selectedUser.total_spent || 0).toFixed(2) }}</p>
                      <p class="text-sm text-gray-600">Total Spent</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-orange-600">{{ selectedUser.cancelled_orders || 0 }}</p>
                      <p class="text-sm text-gray-600">Cancelled</p>
                    </div>
                  </div>
                </div>

                <!-- Recent Activity -->
                <div class="mt-6">
                  <h5 class="font-medium mb-3">Recent Activity</h5>
                  <div class="space-y-2 max-h-32 overflow-y-auto">
                    <div v-for="activity in selectedUser.recent_activity" :key="activity.id" class="text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">{{ activity.description }}</span>
                        <span class="text-gray-400">{{ formatDateTime(activity.created_at) }}</span>
                      </div>
                    </div>
                    <div v-if="!selectedUser.recent_activity?.length" class="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 space-y-2">
                  <button
                    @click="viewUserOrders(selectedUser.id)"
                    class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View All Orders
                  </button>
                  <div v-if="selectedUser.status === 'active'">
                    <button
                      @click="banUser(selectedUser.id)"
                      class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Ban User
                    </button>
                  </div>
                  <div v-if="selectedUser.status === 'banned'">
                    <button
                      @click="unbanUser(selectedUser.id)"
                      class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Unban User
                    </button>
                  </div>
                  <button
                    @click="sendNotification(selectedUser.id)"
                    class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Send Notification Modal -->
      <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Send Notification</h3>
            <button @click="showNotificationModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="submitNotification">
              <div class="mb-4">
                <label for="notification_title" class="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="notification_title"
                  v-model="notificationForm.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Notification title"
                />
              </div>
              <div class="mb-4">
                <label for="notification_message" class="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="notification_message"
                  v-model="notificationForm.message"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Notification message"
                ></textarea>
              </div>
              <div class="flex space-x-2">
                <button
                  type="submit"
                  :disabled="sendingNotification"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {{ sendingNotification ? 'Sending...' : 'Send Notification' }}
                </button>
                <button
                  type="button"
                  @click="showNotificationModal = false"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Users, UserCheck, ShoppingBag, Ban, Search, Eye, CheckCircle, Bell, X 
} from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const { supabase } = useSupabase()
const toast = useToast()

const loading = ref(true)
const users = ref([])
const selectedUser = ref(null)
const showNotificationModal = ref(false)
const sendingNotification = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const searchQuery = ref('')

const stats = ref({
  total: 0,
  active: 0,
  totalOrders: 0,
  banned: 0
})

const filters = ref({
  status: '',
  dateFrom: ''
})

const notificationForm = ref({
  title: '',
  message: '',
  userId: null
})

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

const fetchStats = async () => {
  try {
    // Total users
    const { count: total } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Active users
    const { count: active } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Banned users
    const { count: banned } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'banned')

    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    stats.value = {
      total: total || 0,
      active: active || 0,
      totalOrders: totalOrders || 0,
      banned: banned || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchUsers = async () => {
  try {
    loading.value = true

    let query = supabase
      .from('users')
      .select(`
        *,
        orders(count)
      `, { count: 'exact' })

    // Apply filters
    if (filters.value.status) {
      query = query.eq('status', filters.value.status)
    }
    if (filters.value.dateFrom) {
      query = query.gte('created_at', filters.value.dateFrom)
    }
    if (searchQuery.value) {
      query = query.or(`first_name.ilike.%${searchQuery.value}%,last_name.ilike.%${searchQuery.value}%,email.ilike.%${searchQuery.value}%,contact_number.ilike.%${searchQuery.value}%`)
    }

    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Fetch additional stats for each user
    const usersWithStats = await Promise.all(
      (data || []).map(async (user) => {
        const { data: orderStats } = await supabase
          .from('orders')
          .select('status, delivery_fee')
          .eq('user_id', user.id)

        const totalOrders = orderStats?.length || 0
        const completedOrders = orderStats?.filter(o => o.status === 'delivered').length || 0
        const cancelledOrders = orderStats?.filter(o => o.status === 'cancelled').length || 0
        const totalSpent = orderStats?.reduce((sum, o) => sum + (o.delivery_fee || 0), 0) || 0

        return {
          ...user,
          total_orders: totalOrders,
          completed_orders: completedOrders,
          cancelled_orders: cancelledOrders,
          total_spent: totalSpent
        }
      })
    )

    users.value = usersWithStats
    totalUsers.value = count || 0
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.error('Failed to load users')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchUsers()
}

const resetFilters = () => {
  filters.value = {
    status: '',
    dateFrom: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
  fetchUsers()
}

const viewUser = async (user) => {
  try {
    // Fetch recent activity
    const { data: activity } = await supabase
      .from('orders')
      .select('id, status, service_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    selectedUser.value = {
      ...user,
      recent_activity: activity?.map(a => ({
        id: a.id,
        description: `${a.service_type.replace(/_/g, ' ')} order ${a.status}`,
        created_at: a.created_at
      })) || []
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    selectedUser.value = user
  }
}

const viewUserOrders = (userId) => {
  router.push(`/dashboard/admin/user-orders/${userId}`)
}

const banUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'banned',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    toast.success('User banned successfully')
    await fetchStats()
    await fetchUsers()
    if (selectedUser.value?.id === userId) {
      selectedUser.value = null
    }
  } catch (error) {
    console.error('Error banning user:', error)
    toast.error('Failed to ban user')
  }
}

const unbanUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    toast.success('User unbanned successfully')
    await fetchStats()
    await fetchUsers()
    if (selectedUser.value?.id === userId) {
      selectedUser.value = null
    }
  } catch (error) {
    console.error('Error unbanning user:', error)
    toast.error('Failed to unban user')
  }
}

const sendNotification = (userId) => {
  notificationForm.value = {
    title: '',
    message: '',
    userId
  }
  showNotificationModal.value = true
}

const submitNotification = async () => {
  try {
    sendingNotification.value = true

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: notificationForm.value.userId,
        user_type: 'user',
        title: notificationForm.value.title,
        message: notificationForm.value.message,
        type: 'admin_message'
      })

    if (error) throw error

    toast.success('Notification sent successfully')
    showNotificationModal.value = false
    notificationForm.value = { title: '', message: '', userId: null }
  } catch (error) {
    console.error('Error sending notification:', error)
    toast.error('Failed to send notification')
  } finally {
    sendingNotification.value = false
  }
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    banned: 'bg-red-100 text-red-800',
    suspended: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(currentPage, () => {
  fetchUsers()
})

watch(searchQuery, () => {
  if (searchQuery.value.length === 0 || searchQuery.value.length >= 3) {
    currentPage.value = 1
    fetchUsers()
  }
})

onMounted(async () => {
  await fetchStats()
  await fetchUsers()
})
</script>
