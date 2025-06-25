<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Overview of your delivery service operations</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <Package class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Orders</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.todayOrders }}</p>
              <p class="text-sm text-green-600">+{{ stats.todayOrdersChange }}% from yesterday</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <DollarSign class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p class="text-2xl font-bold text-gray-900">₱{{ stats.todayRevenue.toFixed(2) }}</p>
              <p class="text-sm text-green-600">+{{ stats.revenueChange }}% from yesterday</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <Users class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Online Drivers</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.onlineDrivers }}</p>
              <p class="text-sm text-gray-600">of {{ stats.totalDrivers }} total</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100">
              <UserPlus class="h-6 w-6 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">New Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.newUsers }}</p>
              <p class="text-sm text-gray-600">this week</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <router-link
                to="/admin/orders"
                class="text-sm text-green-600 hover:text-green-700"
              >
                View All
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="loadingOrders" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
            <div v-else-if="recentOrders.length === 0" class="text-center py-4 text-gray-500">
              No recent orders
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="order in recentOrders"
                :key="order.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">#{{ order.order_number }}</p>
                  <p class="text-sm text-gray-600">{{ order.customer_name }}</p>
                  <p class="text-sm text-gray-500">{{ formatServiceType(order.service_type) }}</p>
                </div>
                <div class="text-right">
                  <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded text-sm">
                    {{ formatStatus(order.status) }}
                  </span>
                  <p class="text-sm text-gray-600 mt-1">₱{{ order.delivery_fee }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Driver Applications -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Driver Applications</h3>
              <router-link
                to="/admin/driver-applications"
                class="text-sm text-green-600 hover:text-green-700"
              >
                View All
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="loadingApplications" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
            <div v-else-if="driverApplications.length === 0" class="text-center py-4 text-gray-500">
              No pending applications
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="application in driverApplications"
                :key="application.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <img
                    :src="application.profile_picture || '/placeholder.svg?height=40&width=40'"
                    alt="Profile"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div class="ml-3">
                    <p class="font-medium text-gray-900">{{ application.first_name }} {{ application.last_name }}</p>
                    <p class="text-sm text-gray-600">{{ application.contact_number }}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="approveApplication(application.id)"
                    class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    @click="rejectApplication(application.id)"
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Orders Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Orders Overview (Last 7 Days)</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div
              v-for="(day, index) in ordersChart"
              :key="index"
              class="flex-1 bg-blue-200 rounded-t-md relative group cursor-pointer hover:bg-blue-300 transition-colors"
              :style="{ height: `${(day.orders / maxOrders) * 100}%` }"
            >
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {{ day.orders }} orders
              </div>
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-600">
                {{ formatChartDate(day.date) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Overview (Last 7 Days)</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div
              v-for="(day, index) in revenueChart"
              :key="index"
              class="flex-1 bg-green-200 rounded-t-md relative group cursor-pointer hover:bg-green-300 transition-colors"
              :style="{ height: `${(day.revenue / maxRevenue) * 100}%` }"
            >
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ₱{{ day.revenue.toFixed(2) }}
              </div>
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-600">
                {{ formatChartDate(day.date) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fraud Alerts -->
      <div v-if="fraudAlerts.length > 0" class="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center mb-4">
          <AlertTriangle class="h-6 w-6 text-red-600 mr-2" />
          <h3 class="text-lg font-semibold text-red-900">Fraud Alerts</h3>
        </div>
        <div class="space-y-3">
          <div
            v-for="alert in fraudAlerts"
            :key="alert.id"
            class="flex items-center justify-between bg-white p-4 rounded-lg border border-red-200"
          >
            <div>
              <p class="font-medium text-red-900">{{ alert.alert_type }}</p>
              <p class="text-sm text-red-700">{{ alert.description }}</p>
              <p class="text-xs text-red-600">{{ formatDateTime(alert.created_at) }}</p>
            </div>
            <button
              @click="dismissAlert(alert.id)"
              class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Package, DollarSign, Users, UserPlus, AlertTriangle } from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const { supabase } = useSupabase()
const { subscribeToTable } = useRealtime()
const toast = useToast()

const loadingOrders = ref(true)
const loadingApplications = ref(true)
const recentOrders = ref([])
const driverApplications = ref([])
const fraudAlerts = ref([])
const ordersChart = ref([])
const revenueChart = ref([])

const stats = ref({
  todayOrders: 0,
  todayOrdersChange: 0,
  todayRevenue: 0,
  revenueChange: 0,
  onlineDrivers: 0,
  totalDrivers: 0,
  newUsers: 0
})

const maxOrders = computed(() => Math.max(...ordersChart.value.map(d => d.orders), 1))
const maxRevenue = computed(() => Math.max(...revenueChart.value.map(d => d.revenue), 1))

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchRecentOrders(),
    fetchDriverApplications(),
    fetchFraudAlerts(),
    fetchChartData()
  ])

  // Subscribe to real-time updates
  subscribeToTable('orders', () => {
    fetchStats()
    fetchRecentOrders()
    fetchChartData()
  })

  subscribeToTable('driver_applications', () => {
    fetchDriverApplications()
  })

  subscribeToTable('fraud_alerts', () => {
    fetchFraudAlerts()
  })
})

const fetchStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Today's orders
    const { count: todayCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    // Yesterday's orders for comparison
    const { count: yesterdayCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday)
      .lt('created_at', today)

    stats.value.todayOrders = todayCount || 0
    stats.value.todayOrdersChange = yesterdayCount > 0 
      ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
      : 0

    // Today's revenue
    const { data: todayRevenue } = await supabase
      .from('orders')
      .select('delivery_fee')
      .gte('created_at', today)
      .eq('status', 'delivered')

    const { data: yesterdayRevenue } = await supabase
      .from('orders')
      .select('delivery_fee')
      .gte('created_at', yesterday)
      .lt('created_at', today)
      .eq('status', 'delivered')

    const todayTotal = todayRevenue?.reduce((sum, order) => sum + order.delivery_fee, 0) || 0
    const yesterdayTotal = yesterdayRevenue?.reduce((sum, order) => sum + order.delivery_fee, 0) || 0

    stats.value.todayRevenue = todayTotal
    stats.value.revenueChange = yesterdayTotal > 0 
      ? Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100)
      : 0

    // Online drivers
    const { count: onlineCount } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('is_online', true)
      .eq('status', 'approved')

    const { count: totalCount } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    stats.value.onlineDrivers = onlineCount || 0
    stats.value.totalDrivers = totalCount || 0

    // New users this week
    const { count: newUsersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart)

    stats.value.newUsers = newUsersCount || 0
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchRecentOrders = async () => {
  try {
    loadingOrders.value = true

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    recentOrders.value = data?.map(order => ({
      ...order,
      customer_name: `${order.users.first_name} ${order.users.last_name}`
    })) || []
  } catch (error) {
    console.error('Error fetching recent orders:', error)
  } finally {
    loadingOrders.value = false
  }
}

const fetchDriverApplications = async () => {
  try {
    loadingApplications.value = true

    const { data, error } = await supabase
      .from('driver_applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    driverApplications.value = data || []
  } catch (error) {
    console.error('Error fetching driver applications:', error)
  } finally {
    loadingApplications.value = false
  }
}

const fetchFraudAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from('fraud_alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    fraudAlerts.value = data || []
  } catch (error) {
    console.error('Error fetching fraud alerts:', error)
  }
}

const fetchChartData = async () => {
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      return date.toISOString().split('T')[0]
    }).reverse()

    // Orders chart data
    const ordersData = []
    const revenueData = []

    for (const date of last7Days) {
      // Orders count
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date)
        .lt('created_at', new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

      ordersData.push({ date, orders: count || 0 })

      // Revenue
      const { data: revenueOrders } = await supabase
        .from('orders')
        .select('delivery_fee')
        .gte('created_at', date)
        .lt('created_at', new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .eq('status', 'delivered')

      const revenue = revenueOrders?.reduce((sum, order) => sum + order.delivery_fee, 0) || 0
      revenueData.push({ date, revenue })
    }

    ordersChart.value = ordersData
    revenueChart.value = revenueData
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }
}

const approveApplication = async (applicationId) => {
  try {
    const { error } = await supabase
      .from('driver_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)

    if (error) throw error

    toast.success('Application approved successfully!')
    await fetchDriverApplications()
  } catch (error) {
    console.error('Error approving application:', error)
    toast.error('Failed to approve application')
  }
}

const rejectApplication = async (applicationId) => {
  try {
    const { error } = await supabase
      .from('driver_applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId)

    if (error) throw error

    toast.success('Application rejected')
    await fetchDriverApplications()
  } catch (error) {
    console.error('Error rejecting application:', error)
    toast.error('Failed to reject application')
  }
}

const dismissAlert = async (alertId) => {
  try {
    const { error } = await supabase
      .from('fraud_alerts')
      .update({ status: 'dismissed' })
      .eq('id', alertId)

    if (error) throw error

    await fetchFraudAlerts()
  } catch (error) {
    console.error('Error dismissing alert:', error)
    toast.error('Failed to dismiss alert')
  }
}

const formatServiceType = (type) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    picked_up: 'bg-orange-100 text-orange-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
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

const formatChartDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
