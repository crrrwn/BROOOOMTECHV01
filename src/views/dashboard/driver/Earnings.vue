<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Earnings</h1>
        <p class="text-gray-600 mt-2">Track your delivery earnings and performance</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <DollarSign class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Earnings</p>
              <p class="text-2xl font-bold text-gray-900">₱{{ todayEarnings.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Week</p>
              <p class="text-2xl font-bold text-gray-900">₱{{ weekEarnings.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <TrendingUp class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">₱{{ monthEarnings.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100">
              <Package class="h-6 w-6 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Deliveries</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalDeliveries }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-wrap items-center gap-4">
          <div>
            <label for="date_from" class="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              id="date_from"
              v-model="filters.dateFrom"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label for="date_to" class="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              id="date_to"
              v-model="filters.dateTo"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Earnings Chart -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Daily Earnings Chart</h3>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div
            v-for="(day, index) in chartData"
            :key="index"
            class="flex-1 bg-green-200 rounded-t-md relative group cursor-pointer hover:bg-green-300 transition-colors"
            :style="{ height: `${(day.earnings / maxEarnings) * 100}%` }"
          >
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
              ₱{{ day.earnings.toFixed(2) }}
            </div>
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-600">
              {{ formatDate(day.date) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings History -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Earnings History</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-4 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p class="text-gray-600 mt-2">Loading earnings...</p>
                </td>
              </tr>
              <tr v-else-if="earnings.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No earnings found for the selected period
                </td>
              </tr>
              <tr v-else v-for="earning in earnings" :key="earning.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(earning.delivered_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ earning.order_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatServiceType(earning.service_type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ earning.customer_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  ₱{{ earning.delivery_fee.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalEarnings) }} of {{ totalEarnings }} results
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { DollarSign, Calendar, TrendingUp, Package } from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const { supabase } = useSupabase()
const { user } = useAuth()
const toast = useToast()

const loading = ref(true)
const earnings = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalEarnings = ref(0)

const todayEarnings = ref(0)
const weekEarnings = ref(0)
const monthEarnings = ref(0)
const totalDeliveries = ref(0)
const chartData = ref([])

const filters = ref({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0]
})

const totalPages = computed(() => Math.ceil(totalEarnings.value / pageSize.value))
const maxEarnings = computed(() => Math.max(...chartData.value.map(d => d.earnings), 1))

const fetchEarningsSummary = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Today's earnings
    const { data: todayData } = await supabase
      .from('orders')
      .select('delivery_fee')
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')
      .gte('delivered_at', today)

    todayEarnings.value = todayData?.reduce((sum, order) => sum + order.delivery_fee, 0) || 0

    // Week earnings
    const { data: weekData } = await supabase
      .from('orders')
      .select('delivery_fee')
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')
      .gte('delivered_at', weekStart)

    weekEarnings.value = weekData?.reduce((sum, order) => sum + order.delivery_fee, 0) || 0

    // Month earnings
    const { data: monthData } = await supabase
      .from('orders')
      .select('delivery_fee')
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')
      .gte('delivered_at', monthStart)

    monthEarnings.value = monthData?.reduce((sum, order) => sum + order.delivery_fee, 0) || 0

    // Total deliveries
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')

    totalDeliveries.value = count || 0
  } catch (error) {
    console.error('Error fetching earnings summary:', error)
  }
}

const fetchEarnings = async () => {
  try {
    loading.value = true

    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1

    const { data, error, count } = await supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey(first_name, last_name)
      `, { count: 'exact' })
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')
      .gte('delivered_at', filters.value.dateFrom)
      .lte('delivered_at', filters.value.dateTo + 'T23:59:59')
      .order('delivered_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    earnings.value = data?.map(order => ({
      ...order,
      customer_name: `${order.users.first_name} ${order.users.last_name}`
    })) || []

    totalEarnings.value = count || 0
  } catch (error) {
    console.error('Error fetching earnings:', error)
    toast.error('Failed to load earnings')
  } finally {
    loading.value = false
  }
}

const fetchChartData = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('delivered_at, delivery_fee')
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')
      .gte('delivered_at', filters.value.dateFrom)
      .lte('delivered_at', filters.value.dateTo + 'T23:59:59')
      .order('delivered_at', { ascending: true })

    if (error) throw error

    // Group by date
    const grouped = {}
    data?.forEach(order => {
      const date = order.delivered_at.split('T')[0]
      if (!grouped[date]) {
        grouped[date] = 0
      }
      grouped[date] += order.delivery_fee
    })

    // Convert to chart data
    chartData.value = Object.entries(grouped).map(([date, earnings]) => ({
      date,
      earnings
    }))
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }
}

const applyFilters = async () => {
  currentPage.value = 1
  await fetchEarnings()
  await fetchChartData()
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const formatServiceType = (type) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

onMounted(async () => {
  await fetchEarningsSummary()
  await fetchEarnings()
  await fetchChartData()
})

watch(currentPage, () => {
  fetchEarnings()
})
</script>
