<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-800">Dashboard</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar :isOpen="sidebarOpen" @close="closeSidebar" />

      <!-- Main Content -->
      <div class="flex-1 lg:ml-64">
        <div class="p-4 lg:p-8">
          <!-- Welcome Section -->
          <div class="mb-8">
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {{ userProfile?.first_name }}!
            </h1>
            <p class="text-gray-600">Here's what's happening with your deliveries today.</p>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Orders</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Completed</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.completedOrders }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">In Progress</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.activeOrders }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Spent</p>
                  <p class="text-2xl font-bold text-gray-900">₱{{ stats.totalSpent }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Quick Book Service -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Book Service</h2>
              <div class="grid grid-cols-2 gap-4">
                <router-link
                  to="/dashboard/user/book-service?service=food_delivery"
                  class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                >
                  <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700">Food Delivery</span>
                </router-link>

                <router-link
                  to="/dashboard/user/book-service?service=grocery"
                  class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                >
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700">Grocery</span>
                </router-link>

                <router-link
                  to="/dashboard/user/book-service?service=pay_bills"
                  class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                >
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700">Pay Bills</span>
                </router-link>

                <router-link
                  to="/dashboard/user/book-service"
                  class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                >
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700">View All</span>
                </router-link>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <router-link to="/dashboard/user/my-orders" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </router-link>
              </div>
              <div class="space-y-4">
                <div v-if="recentOrders.length === 0" class="text-center py-8">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  <p class="text-gray-500">No recent orders</p>
                  <router-link to="/dashboard/user/book-service" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Book your first service
                  </router-link>
                </div>
                <div v-else v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ order.service_type.replace('_', ' ').toUpperCase() }}</p>
                      <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
                      {{ order.status.replace('_', ' ').toUpperCase() }}
                    </span>
                    <p class="text-sm font-medium text-gray-900 mt-1">₱{{ order.total_amount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Orders -->
          <div v-if="activeOrders.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
            <div class="space-y-4">
              <div v-for="order in activeOrders" :key="order.id" class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">Order #{{ order.order_number }}</h3>
                    <p class="text-sm text-gray-600">{{ order.service_type.replace('_', ' ').toUpperCase() }}</p>
                  </div>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="getStatusClass(order.status)">
                    {{ order.status.replace('_', ' ').toUpperCase() }}
                  </span>
                </div>
                
                <!-- Order Progress -->
                <div class="mb-4">
                  <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Order Progress</span>
                    <span>{{ getProgressPercentage(order.status) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" :style="{ width: getProgressPercentage(order.status) + '%' }"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-600">
                    <p>Total: <span class="font-medium text-gray-900">₱{{ order.total_amount }}</span></p>
                    <p>{{ formatDate(order.created_at) }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <router-link
                      :to="`/dashboard/user/my-orders?order=${order.id}`"
                      class="btn-secondary text-sm px-3 py-1"
                    >
                      View Details
                    </router-link>
                    <router-link
                      v-if="order.driver_id"
                      :to="`/dashboard/user/order-chat/${order.id}`"
                      class="btn-primary text-sm px-3 py-1"
                    >
                      Chat with Driver
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import Sidebar from '@/components/Sidebar.vue'

const { userProfile } = useAuth()
const { select } = useSupabase()
const { subscribeToOrders } = useRealtime()

const sidebarOpen = ref(false)
const loading = ref(true)

const stats = reactive({
  totalOrders: 0,
  completedOrders: 0,
  activeOrders: 0,
  totalSpent: 0
})

const recentOrders = ref([])
const activeOrders = ref([])

const toggleSidebar = () => {
  sidebarOpen.value = true
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const loadDashboardData = async () => {
  if (!userProfile.value) return

  try {
    // Load user orders
    const { data: orders, error } = await select('orders', '*')
      .eq('user_id', userProfile.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate stats
    stats.totalOrders = orders?.length || 0
    stats.completedOrders = orders?.filter(order => order.status === 'delivered').length || 0
    stats.activeOrders = orders?.filter(order => !['delivered', 'cancelled'].includes(order.status)).length || 0
    stats.totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0

    // Set recent orders (last 5)
    recentOrders.value = orders?.slice(0, 5) || []

    // Set active orders
    activeOrders.value = orders?.filter(order => !['delivered', 'cancelled'].includes(order.status)) || []

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    'placed': 'bg-blue-100 text-blue-800',
    'pending_approval': 'bg-yellow-100 text-yellow-800',
    'assigned': 'bg-purple-100 text-purple-800',
    'picked_up': 'bg-orange-100 text-orange-800',
    'in_transit': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getProgressPercentage = (status) => {
  const progress = {
    'placed': 20,
    'pending_approval': 30,
    'assigned': 50,
    'picked_up': 70,
    'in_transit': 85,
    'delivered': 100,
    'cancelled': 0
  }
  return progress[status] || 0
}

onMounted(async () => {
  await loadDashboardData()
  
  // Subscribe to real-time order updates
  subscribeToOrders((payload) => {
    // Reload dashboard data when orders change
    loadDashboardData()
  })
})
</script>
