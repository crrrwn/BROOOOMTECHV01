<template>
<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
        <p class="mt-1 text-sm text-gray-600">Track and manage your delivery orders</p>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search orders..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="placed">Placed</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="assigned">Assigned</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          v-model="serviceFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
    </div>

    <!-- Orders List -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading orders...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📦</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
      <p class="text-gray-600 mb-6">You haven't placed any orders yet or no orders match your filters.</p>
      <router-link
        to="/dashboard/user/book-service"
        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Book a Service
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  Order #{{ order.order_number }}
                </h3>
                <span
                  :class="getStatusClass(order.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ formatStatus(order.status) }}
                </span>
                <!-- Cancel Button (30-second window) -->
                <button
                  v-if="canCancelOrder(order)"
                  @click="cancelOrder(order)"
                  class="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                >
                  Cancel ({{ getCancelTimeLeft(order) }}s)
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><span class="font-medium">Service:</span> {{ formatServiceType(order.service_type) }}</p>
                  <p><span class="font-medium">Date:</span> {{ formatDate(order.created_at) }}</p>
                </div>
                <div>
                  <p><span class="font-medium">Total:</span> ₱{{ order.total_amount }}</p>
                  <p><span class="font-medium">Payment:</span> {{ order.payment_method }}</p>
                </div>
              </div>

              <div class="mt-3">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Pickup:</span> {{ order.pickup_address }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Delivery:</span> {{ order.delivery_address }}
                </p>
              </div>

              <!-- Order Timeline -->
              <div class="mt-4">
                <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Order Progress</span>
                  <span>{{ getProgressPercentage(order.status) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    :style="{ width: getProgressPercentage(order.status) + '%' }"
                    class="bg-green-600 h-2 rounded-full transition-all duration-300"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Placed</span>
                  <span>Approved</span>
                  <span>Assigned</span>
                  <span>Picked Up</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
              </div>

              <!-- Real-time Driver Tracking -->
              <div v-if="order.driver_id && ['assigned', 'picked_up', 'in_transit'].includes(order.status)" class="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-900 mb-2">Driver Information</h4>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-blue-800">
                    <p>{{ order.driver?.first_name }} {{ order.driver?.last_name }}</p>
                    <p>{{ order.driver?.contact_number }}</p>
                    <p>Plate: {{ order.driver?.motorcycle_plate }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="trackDriver(order)"
                      class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Track Live
                    </button>
                    <button
                      @click="chatWithDriver(order)"
                      class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
              <button
                @click="viewOrderDetails(order)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md cursor-pointer',
            page === currentPage
              ? 'bg-green-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </span>
        
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>

  <!-- Order Details Modal -->
  <div
    v-if="selectedOrder"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="closeOrderDetails"
  >
    <div
      class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            @click="closeOrderDetails"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Order Info -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Order Information</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">Order Number:</span>
                <span>{{ selectedOrder.order_number }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Service Type:</span>
                <span>{{ formatServiceType(selectedOrder.service_type) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Status:</span>
                <span
                  :class="getStatusClass(selectedOrder.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Date Placed:</span>
                <span>{{ formatDate(selectedOrder.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Barcode -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Order Barcode</h3>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <BarcodeViewer :value="selectedOrder.order_number" />
              <p class="text-sm text-gray-600 mt-2">Show this barcode to the driver</p>
            </div>
          </div>

          <!-- Addresses -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Addresses</h3>
            <div class="space-y-3">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-green-600 mb-2">Pickup Address</h4>
                <p class="text-gray-700">{{ selectedOrder.pickup_address }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-green-600 mb-2">Delivery Address</h4>
                <p class="text-gray-700">{{ selectedOrder.delivery_address }}</p>
              </div>
            </div>
          </div>

          <!-- Service Details -->
          <div v-if="selectedOrder.service_details">
            <h3 class="text-lg font-semibold mb-3">Service Details</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <pre class="whitespace-pre-wrap text-sm text-gray-700">{{ JSON.stringify(selectedOrder.service_details, null, 2) }}</pre>
            </div>
          </div>

          <!-- Payment Info -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Payment Information</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">Payment Method:</span>
                <span>{{ selectedOrder.payment_method }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Delivery Fee:</span>
                <span>₱{{ selectedOrder.delivery_fee }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Service Fee:</span>
                <span>₱{{ selectedOrder.service_fee }}</span>
              </div>
              <div class="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span>₱{{ selectedOrder.total_amount }}</span>
              </div>
            </div>
          </div>

          <!-- Driver Info -->
          <div v-if="selectedOrder.driver_id">
            <h3 class="text-lg font-semibold mb-3">Driver Information</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ selectedOrder.driver?.first_name?.charAt(0) }}{{ selectedOrder.driver?.last_name?.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium">{{ selectedOrder.driver?.first_name }} {{ selectedOrder.driver?.last_name }}</p>
                  <p class="text-sm text-gray-600">{{ selectedOrder.driver?.contact_number }}</p>
                  <p class="text-sm text-gray-600">Plate: {{ selectedOrder.driver?.motorcycle_plate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div v-if="selectedOrder.images && selectedOrder.images.length > 0">
            <h3 class="text-lg font-semibold mb-3">Uploaded Images</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(image, index) in selectedOrder.images"
                :key="index"
                class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                @click="viewImage(image)"
              >
                <img
                  :src="image"
                  :alt="`Order image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
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
        alt="Order image"
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

  <!-- Add this new component for real-time driver tracking -->
  <div v-if="trackingOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Live Driver Tracking</h2>
          <button @click="closeTracking" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <!-- Driver Info -->
        <div class="bg-blue-50 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {{ trackingOrder.driver?.first_name?.charAt(0) }}{{ trackingOrder.driver?.last_name?.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ trackingOrder.driver?.first_name }} {{ trackingOrder.driver?.last_name }}</h3>
              <p class="text-sm text-gray-600">{{ trackingOrder.driver?.contact_number }}</p>
              <p class="text-sm text-gray-600">Plate: {{ trackingOrder.driver?.motorcycle_plate }}</p>
              <div class="flex items-center mt-1">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span class="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Map -->
        <div class="h-96 bg-gray-200 rounded-lg mb-4">
          <div id="tracking-map" class="w-full h-full rounded-lg"></div>
        </div>

        <!-- ETA and Status -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600">{{ estimatedArrival }}</div>
            <div class="text-sm text-gray-600">Estimated Arrival</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ driverDistance.toFixed(1) }} km</div>
            <div class="text-sm text-gray-600">Distance Away</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-600">{{ trackingOrder.status.replace('_', ' ').toUpperCase() }}</div>
            <div class="text-sm text-gray-600">Current Status</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useRealtime } from '@/composables/useRealtime'
import { useToast } from 'vue-toastification'
import BarcodeViewer from '@/components/BarcodeViewer.vue'

const router = useRouter()
const { supabase } = useSupabase()
const { user } = useAuth()
const { subscribeToTable } = useRealtime()
const toast = useToast()

// Data
const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const serviceFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedOrder = ref(null)
const selectedImage = ref(null)
const cancelTimers = ref({})

// Add to data section
const trackingOrder = ref(null)
const driverLocation = ref(null)
const driverDistance = ref(0)
const estimatedArrival = ref('Calculating...')
let trackingMap = null
let driverMarker = null
let trackingInterval = null

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (searchQuery.value) {
    filtered = filtered.filter(order =>
      order.order_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.pickup_address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  if (serviceFilter.value) {
    filtered = filtered.filter(order => order.service_type === serviceFilter.value)
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = orders.value

  if (searchQuery.value) {
    filtered = filtered.filter(order =>
      order.order_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.pickup_address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  if (serviceFilter.value) {
    filtered = filtered.filter(order => order.service_type === serviceFilter.value)
  }

  return Math.ceil(filtered.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const fetchOrders = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        driver:drivers(first_name, last_name, contact_number, motorcycle_plate)
      `)
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    orders.value = data || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Failed to load orders')
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    placed: 'bg-blue-100 text-blue-800',
    pending_approval: 'bg-yellow-100 text-yellow-800',
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const getProgressPercentage = (status) => {
  const progress = {
    placed: 15,
    pending_approval: 25,
    assigned: 40,
    picked_up: 60,
    in_transit: 80,
    delivered: 100,
    cancelled: 0
  }
  return progress[status] || 0
}

const canCancelOrder = (order) => {
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return false
  }

  // Allow cancellation within 30 seconds of placing order
  const orderTime = new Date(order.created_at).getTime()
  const now = new Date().getTime()
  const timeDiff = now - orderTime

  return timeDiff <= 30000 // 30 seconds
}

const getCancelTimeLeft = (order) => {
  const orderTime = new Date(order.created_at).getTime()
  const now = new Date().getTime()
  const timeDiff = now - orderTime
  const timeLeft = Math.max(0, 30 - Math.floor(timeDiff / 1000))
  return timeLeft
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}

const closeOrderDetails = () => {
  selectedOrder.value = null
}

const viewImage = (image) => {
  selectedImage.value = image
}

const closeImageViewer = () => {
  selectedImage.value = null
}

const trackDriver = (order) => {
  trackingOrder.value = order
  initTrackingMap()
  startLocationTracking()
}

const initTrackingMap = () => {
  setTimeout(() => {
    const mapElement = document.getElementById('tracking-map')
    if (mapElement && typeof google !== 'undefined') {
      trackingMap = new google.maps.Map(mapElement, {
        center: { lat: 14.5995, lng: 120.9842 },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false
      })

      // Add pickup and delivery markers
      new google.maps.Marker({
        position: { lat: trackingOrder.value.pickup_lat, lng: trackingOrder.value.pickup_lng },
        map: trackingMap,
        title: 'Pickup Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">P</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      new google.maps.Marker({
        position: { lat: trackingOrder.value.delivery_lat, lng: trackingOrder.value.delivery_lng },
        map: trackingMap,
        title: 'Delivery Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">D</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      updateDriverLocation()
    }
  }, 100)
}

const startLocationTracking = () => {
  // Simulate real-time driver location updates
  trackingInterval = setInterval(() => {
    updateDriverLocation()
  }, 5000) // Update every 5 seconds
}

const updateDriverLocation = async () => {
  try {
    // In a real app, this would fetch from your real-time database
    // For demo, we'll simulate driver movement
    const { data, error } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('driver_id', trackingOrder.value.driver_id)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      const location = data[0]
      driverLocation.value = location

      // Update driver marker on map
      if (trackingMap) {
        if (driverMarker) driverMarker.setMap(null)

        driverMarker = new google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: trackingMap,
          title: 'Driver Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="15" fill="#3B82F6" stroke="white" stroke-width="3"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
                <circle cx="20" cy="20" r="4" fill="#3B82F6"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40)
          }
        })

        // Calculate distance to delivery location
        const deliveryLocation = { lat: trackingOrder.value.delivery_lat, lng: trackingOrder.value.delivery_lng }
        const driverPos = { lat: location.latitude, lng: location.longitude }
        
        const service = new google.maps.DistanceMatrixService()
        service.getDistanceMatrix({
          origins: [driverPos],
          destinations: [deliveryLocation],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        }, (response, status) => {
          if (status === 'OK') {
            const element = response.rows[0].elements[0]
            if (element.status === 'OK') {
              driverDistance.value = element.distance.value / 1000
              estimatedArrival.value = element.duration.text
            }
          }
        })

        // Center map on driver
        trackingMap.setCenter({ lat: location.latitude, lng: location.longitude })
      }
    }
  } catch (error) {
    console.error('Error updating driver location:', error)
  }
}

const closeTracking = () => {
  trackingOrder.value = null
  if (trackingInterval) {
    clearInterval(trackingInterval)
    trackingInterval = null
  }
}

const chatWithDriver = (order) => {
  router.push(`/dashboard/user/order-chat/${order.id}`)
}

const cancelOrder = async (order) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', order.id)

    if (error) throw error

    toast.success('Order cancelled successfully')
    await fetchOrders()
  } catch (error) {
    console.error('Error cancelling order:', error)
    toast.error('Failed to cancel order')
  }
}

// Watchers
watch([searchQuery, statusFilter, serviceFilter], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await fetchOrders()

  // Subscribe to real-time updates
  subscribeToTable('orders', (payload) => {
    if (payload.eventType === 'UPDATE' && payload.new.user_id === user.value.id) {
      const index = orders.value.findIndex(order => order.id === payload.new.id)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...payload.new }
        toast.info(`Order #${payload.new.order_number} status updated to ${formatStatus(payload.new.status)}`)
      }
    }
  })

  // Start cancel timers for eligible orders
  orders.value.forEach(order => {
    if (canCancelOrder(order)) {
      const timeLeft = getCancelTimeLeft(order)
      if (timeLeft > 0) {
        cancelTimers.value[order.id] = setInterval(() => {
          const newTimeLeft = getCancelTimeLeft(order)
          if (newTimeLeft <= 0) {
            clearInterval(cancelTimers.value[order.id])
            delete cancelTimers.value[order.id]
          }
        }, 1000)
      }
    }
  })
})
</script>
