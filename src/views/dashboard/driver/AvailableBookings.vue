<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Available Bookings</h1>
        <p class="text-gray-600 mt-2">Accept bookings that match your availability</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              v-model="filters.serviceType"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Services</option>
              <option value="food_delivery">Food Delivery</option>
              <option value="pay_bills">Pay Bills</option>
              <option value="pickup">Pick-up</option>
              <option value="surprise_delivery">Surprise Delivery</option>
              <option value="medicines">Medicines</option>
              <option value="grocery">Grocery</option>
              <option value="pabili">Pabili</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Distance</label>
            <select
              v-model="filters.maxDistance"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Any Distance</option>
              <option value="5">Within 5km</option>
              <option value="10">Within 10km</option>
              <option value="15">Within 15km</option>
              <option value="20">Within 20km</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min Fee</label>
            <input
              v-model="filters.minFee"
              @input="applyFilters"
              type="number"
              placeholder="Minimum fee"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              Available Bookings ({{ filteredBookings.length }})
            </h2>
            <button
              @click="refreshBookings"
              :disabled="loading"
              class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw :class="{ 'animate-spin': loading }" class="h-4 w-4 mr-2 inline" />
              Refresh
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading available bookings...</p>
          </div>
          
          <div v-else-if="filteredBookings.length === 0" class="text-center py-8">
            <Package class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 text-lg">No available bookings found</p>
            <p class="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="booking in filteredBookings"
              :key="booking.id"
              class="border border-gray-200 rounded-lg p-6 hover:border-green-300 transition-all hover:shadow-md"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <!-- Service Type and Order Number -->
                  <div class="flex items-center mb-3">
                    <span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      {{ formatServiceType(booking.service_type) }}
                    </span>
                    <span class="ml-3 text-sm text-gray-600 font-medium">
                      Order #{{ booking.order_number }}
                    </span>
                    <span class="ml-3 text-xs text-gray-500">
                      {{ formatTimeAgo(booking.created_at) }}
                    </span>
                  </div>

                  <!-- Customer Info -->
                  <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-1">
                      <User class="inline h-4 w-4 mr-2" />
                      {{ booking.customer_name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <Phone class="inline h-4 w-4 mr-2" />
                      {{ booking.customer_contact }}
                    </p>
                  </div>

                  <!-- Addresses -->
                  <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-1">
                      <MapPin class="inline h-4 w-4 mr-2 text-blue-500" />
                      <span class="font-medium">Pickup:</span> {{ booking.pickup_address }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <Navigation class="inline h-4 w-4 mr-2 text-red-500" />
                      <span class="font-medium">Delivery:</span> {{ booking.delivery_address }}
                    </p>
                  </div>

                  <!-- Order Details -->
                  <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-1">
                      <Package class="inline h-4 w-4 mr-2" />
                      <span class="font-medium">Items:</span> {{ booking.items_description || 'No description' }}
                    </p>
                    <p v-if="booking.special_instructions" class="text-sm text-gray-600">
                      <MessageSquare class="inline h-4 w-4 mr-2" />
                      <span class="font-medium">Instructions:</span> {{ booking.special_instructions }}
                    </p>
                  </div>

                  <!-- Distance and Time -->
                  <div class="flex items-center text-sm text-gray-600 mb-3">
                    <Clock class="h-4 w-4 mr-1" />
                    <span class="mr-4">{{ formatDistance(booking.distance) }}</span>
                    <Timer class="h-4 w-4 mr-1" />
                    <span>{{ formatTime(booking.estimated_time) }}</span>
                  </div>

                  <!-- Payment Method -->
                  <div class="flex items-center text-sm text-gray-600">
                    <CreditCard class="h-4 w-4 mr-2" />
                    <span class="font-medium">Payment:</span>
                    <span class="ml-1 capitalize">{{ booking.payment_method }}</span>
                    <span v-if="booking.payment_status === 'paid'" class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Paid
                    </span>
                  </div>
                </div>

                <!-- Action Section -->
                <div class="text-right ml-6">
                  <div class="mb-4">
                    <p class="text-2xl font-bold text-green-600">₱{{ booking.delivery_fee }}</p>
                    <p class="text-sm text-gray-500">Delivery Fee</p>
                  </div>
                  
                  <div class="space-y-2">
                    <button
                      @click="viewBookingDetails(booking)"
                      class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      @click="acceptBooking(booking.id)"
                      :disabled="accepting === booking.id"
                      class="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <span v-if="accepting === booking.id">Accepting...</span>
                      <span v-else>Accept Booking</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Booking Details</h3>
            <button
              @click="selectedBooking = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <X class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Booking details content -->
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Order Information</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p><span class="font-medium">Order Number:</span> {{ selectedBooking.order_number }}</p>
                <p><span class="font-medium">Service Type:</span> {{ formatServiceType(selectedBooking.service_type) }}</p>
                <p><span class="font-medium">Created:</span> {{ formatDateTime(selectedBooking.created_at) }}</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Customer Information</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p><span class="font-medium">Name:</span> {{ selectedBooking.customer_name }}</p>
                <p><span class="font-medium">Contact:</span> {{ selectedBooking.customer_contact }}</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Delivery Information</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="mb-2"><span class="font-medium">Pickup Address:</span></p>
                <p class="text-sm text-gray-600 mb-3">{{ selectedBooking.pickup_address }}</p>
                <p class="mb-2"><span class="font-medium">Delivery Address:</span></p>
                <p class="text-sm text-gray-600">{{ selectedBooking.delivery_address }}</p>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="selectedBooking = null"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                @click="acceptBooking(selectedBooking.id)"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Accept Booking
              </button>
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
  RefreshCw,
  User,
  Phone,
  MapPin,
  Navigation,
  MessageSquare,
  Clock,
  Timer,
  CreditCard,
  X
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const router = useRouter()
const { user } = useAuth()
const { supabase } = useSupabase()
const { subscribeToTable } = useRealtime()
const toast = useToast()

const loading = ref(true)
const accepting = ref(null)
const bookings = ref([])
const selectedBooking = ref(null)
const filters = ref({
  serviceType: '',
  maxDistance: '',
  minFee: ''
})

const filteredBookings = computed(() => {
  let filtered = [...bookings.value]

  if (filters.value.serviceType) {
    filtered = filtered.filter(booking => booking.service_type === filters.value.serviceType)
  }

  if (filters.value.maxDistance) {
    filtered = filtered.filter(booking => booking.distance <= parseFloat(filters.value.maxDistance))
  }

  if (filters.value.minFee) {
    filtered = filtered.filter(booking => booking.delivery_fee >= parseFloat(filters.value.minFee))
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const loadBookings = async () => {
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
        items_description,
        special_instructions,
        payment_method,
        payment_status,
        created_at,
        users!inner(full_name, contact)
      `)
      .eq('status', 'approved')
      .is('driver_id', null)
      .order('created_at', { ascending: false })

    bookings.value = (data || []).map(order => ({
      ...order,
      customer_name: order.users.full_name,
      customer_contact: order.users.contact
    }))
  } catch (error) {
    console.error('Error loading bookings:', error)
    toast.error('Failed to load bookings')
  }
}

const setupRealtimeSubscriptions = () => {
  subscribeToTable('orders', (payload) => {
    if (payload.eventType === 'INSERT' && payload.new.status === 'approved') {
      loadBookings()
    } else if (payload.eventType === 'UPDATE') {
      loadBookings()
    }
  })
}

const refreshBookings = async () => {
  loading.value = true
  await loadBookings()
  loading.value = false
  toast.success('Bookings refreshed')
}

const acceptBooking = async (orderId) => {
  try {
    accepting.value = orderId
    
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
    selectedBooking.value = null
    await loadBookings()
    
    // Navigate to assignments
    router.push('/driver/assignments')
  } catch (error) {
    console.error('Error accepting booking:', error)
    toast.error('Failed to accept booking')
  } finally {
    accepting.value = null
  }
}

const viewBookingDetails = (booking) => {
  selectedBooking.value = booking
}

const applyFilters = () => {
  // Filters are applied automatically via computed property
}

const clearFilters = () => {
  filters.value = {
    serviceType: '',
    maxDistance: '',
    minFee: ''
  }
}

const formatServiceType = (type) => {
  const types = {
    food_delivery: 'Food Delivery',
    pay_bills: 'Pay Bills',
    pickup: 'Pick-up',
    surprise_delivery: 'Surprise Delivery',
    medicines: 'Medicines',
    grocery: 'Grocery',
    pabili: 'Pabili'
  }
  return types[type] || type
}

const formatDistance = (distance) => {
  return distance ? `${distance.toFixed(1)} km` : 'N/A'
}

const formatTime = (time) => {
  return time ? `${time} mins` : 'N/A'
}

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString()
}

onMounted(async () => {
  await loadBookings()
  setupRealtimeSubscriptions()
  loading.value = false
})
</script>
