<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome back, {{ user?.full_name }}!</p>
      </div>

      <!-- Online/Offline Toggle -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Status</h2>
            <p class="text-gray-600">{{ isOnline ? 'You are online and available for bookings' : 'You are offline' }}</p>
          </div>
          <div class="flex items-center">
            <span class="mr-3 text-sm font-medium text-gray-700">Offline</span>
            <button
              @click="toggleOnlineStatus"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                isOnline ? 'bg-green-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  isOnline ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
            <span class="ml-3 text-sm font-medium text-gray-700">Online</span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <Package class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Deliveries</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.todayDeliveries }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <DollarSign class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Earnings</p>
              <p class="text-2xl font-bold text-gray-900">₱{{ stats.todayEarnings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Orders</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeOrders }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <Star class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rating</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.rating }}/5</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Bookings -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Available Bookings</h2>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading available bookings...</p>
          </div>
          <div v-else-if="availableBookings.length === 0" class="text-center py-8">
            <Package class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600">No available bookings at the moment</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="booking in availableBookings"
              :key="booking.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {{ booking.service_type }}
                    </span>
                    <span class="ml-2 text-sm text-gray-600">
                      Order #{{ booking.order_number }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">
                    <MapPin class="inline h-4 w-4 mr-1" />
                    {{ booking.pickup_address }}
                  </p>
                  <p class="text-sm text-gray-600 mb-2">
                    <Navigation class="inline h-4 w-4 mr-1" />
                    {{ booking.delivery_address }}
                  </p>
                  <div class="flex items-center text-sm text-gray-600">
                    <Clock class="h-4 w-4 mr-1" />
                    {{ formatDistance(booking.distance) }} • {{ formatTime(booking.estimated_time) }}
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-green-600">₱{{ booking.delivery_fee }}</p>
                  <button
                    @click="acceptBooking(booking.id)"
                    class="mt-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Assignments -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Current Assignments</h2>
        </div>
        <div class="p-6">
          <div v-if="currentAssignments.length === 0" class="text-center py-8">
            <Truck class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600">No current assignments</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="assignment in currentAssignments"
              :key="assignment.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span :class="getStatusColor(assignment.status)" class="text-xs font-medium px-2.5 py-0.5 rounded">
                      {{ assignment.status }}
                    </span>
                    <span class="ml-2 text-sm text-gray-600">
                      Order #{{ assignment.order_number }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">
                    <User class="inline h-4 w-4 mr-1" />
                    {{ assignment.customer_name }}
                  </p>
                  <p class="text-sm text-gray-600 mb-2">
                    <Navigation class="inline h-4 w-4 mr-1" />
                    {{ assignment.delivery_address }}
                  </p>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="openMaps(assignment.delivery_address)"
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <MapPin class="h-4 w-4" />
                  </button>
                  <button
                    @click="updateOrderStatus(assignment.id)"
                    class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import Sidebar from '@/components/Sidebar.vue'
import Toast from '@/components/Toast.vue'
import {
  Package,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Navigation,
  User,
  Truck
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const router = useRouter()
const { user } = useAuth()
const { supabase } = useSupabase()
const { subscribeToTable } = useRealtime()
const toast = useToast()

const loading = ref(true)
const isOnline = ref(false)
const stats = ref({
  todayDeliveries: 0,
  todayEarnings: 0,
  activeOrders: 0,
  rating: 0
})
const availableBookings = ref([])
const currentAssignments = ref([])

onMounted(async () => {
  await loadDriverData()
  await loadAvailableBookings()
  await loadCurrentAssignments()
  setupRealtimeSubscriptions()
  loading.value = false
})

const loadDriverData = async () => {
  try {
    // Load driver status
    const { data: driverData } = await supabase
      .from('drivers')
      .select('is_online, rating')
      .eq('user_id', user.value.id)
      .single()

    if (driverData) {
      isOnline.value = driverData.is_online
      stats.value.rating = driverData.rating || 0
    }

    // Load today's stats
    const today = new Date().toISOString().split('T')[0]
    
    const { data: deliveries } = await supabase
      .from('orders')
      .select('delivery_fee')
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')
      .gte('created_at', today)

    if (deliveries) {
      stats.value.todayDeliveries = deliveries.length
      stats.value.todayEarnings = deliveries.reduce((sum, order) => sum + (order.delivery_fee || 0), 0)
    }

    // Load active orders
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('driver_id', user.value.id)
      .in('status', ['assigned', 'picked_up', 'in_transit'])

    if (activeOrders) {
      stats.value.activeOrders = activeOrders.length
    }
  } catch (error) {
    console.error('Error loading driver data:', error)
    toast.error('Failed to load driver data')
  }
}

const loadAvailableBookings = async () => {
  try {
    const { data } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        service_type,
        pickup_address,
        delivery_address,
        delivery_fee,
        distance,
        estimated_time,
        created_at
      `)
      .eq('status', 'approved')
      .is('driver_id', null)
      .order('created_at', { ascending: true })

    availableBookings.value = data || []
  } catch (error) {
    console.error('Error loading available bookings:', error)
    toast.error('Failed to load available bookings')
  }
}

const loadCurrentAssignments = async () => {
  try {
    const { data } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        delivery_address,
        users!inner(full_name)
      `)
      .eq('driver_id', user.value.id)
      .in('status', ['assigned', 'picked_up', 'in_transit'])
      .order('created_at', { ascending: true })

    currentAssignments.value = (data || []).map(order => ({
      ...order,
      customer_name: order.users.full_name
    }))
  } catch (error) {
    console.error('Error loading current assignments:', error)
    toast.error('Failed to load current assignments')
  }
}

const setupRealtimeSubscriptions = () => {
  // Subscribe to orders table for real-time updates
  subscribeToTable('orders', (payload) => {
    if (payload.eventType === 'INSERT' && payload.new.status === 'approved') {
      loadAvailableBookings()
    } else if (payload.eventType === 'UPDATE') {
      if (payload.new.driver_id === user.value.id) {
        loadCurrentAssignments()
      }
      loadAvailableBookings()
    }
  })
}

const toggleOnlineStatus = async () => {
  try {
    const newStatus = !isOnline.value
    
    const { error } = await supabase
      .from('drivers')
      .update({ is_online: newStatus })
      .eq('user_id', user.value.id)

    if (error) throw error

    isOnline.value = newStatus
    toast.success(`You are now ${newStatus ? 'online' : 'offline'}`)
  } catch (error) {
    console.error('Error updating online status:', error)
    toast.error('Failed to update status')
  }
}

const acceptBooking = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        driver_id: user.value.id,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    toast.success('Booking accepted successfully!')
    await loadAvailableBookings()
    await loadCurrentAssignments()
  } catch (error) {
    console.error('Error accepting booking:', error)
    toast.error('Failed to accept booking')
  }
}

const updateOrderStatus = async (orderId) => {
  // Navigate to order details for status update
  router.push(`/driver/assignments/${orderId}`)
}

const openMaps = (address) => {
  const encodedAddress = encodeURIComponent(address)
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
}

const getStatusColor = (status) => {
  const colors = {
    assigned: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatDistance = (distance) => {
  return distance ? `${distance.toFixed(1)} km` : 'N/A'
}

const formatTime = (time) => {
  return time ? `${time} mins` : 'N/A'
}
</script>
