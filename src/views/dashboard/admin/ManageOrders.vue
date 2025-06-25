<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <p class="text-gray-600 mt-2">View and manage all delivery orders</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label for="service_filter" class="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              id="service_filter"
              v-model="filters.serviceType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <label for="date_from" class="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              id="date_from"
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="flex space-x-2">
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Apply Filters
            </button>
            <button
              @click="resetFilters"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Reset
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <Search class="h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search orders..."
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
                  <p class="text-gray-600 mt-2">Loading orders...</p>
                </td>
              </tr>
              <tr v-else-if="orders.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
              <tr v-else v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">#{{ order.order_number }}</div>
                    <div class="text-sm text-gray-500">{{ formatServiceType(order.service_type) }}</div>
                    <div class="text-xs text-gray-400">{{ formatDateTime(order.created_at) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      :src="order.customer_avatar || '/placeholder.svg?height=32&width=32'"
                      alt="Customer"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.customer_name }}</div>
                      <div class="text-sm text-gray-500">{{ order.customer_contact }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="order.driver_name" class="flex items-center">
                    <img
                      :src="order.driver_avatar || '/placeholder.svg?height=32&width=32'"
                      alt="Driver"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.driver_name }}</div>
                      <div class="text-sm text-gray-500">{{ order.driver_contact }}</div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500">Not assigned</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₱{{ order.delivery_fee.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewOrder(order)"
                      class="text-green-600 hover:text-green-900"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      v-if="order.status === 'pending'"
                      @click="approveOrder(order.id)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <Check class="h-4 w-4" />
                    </button>
                    <button
                      v-if="!order.driver_id && order.status === 'approved'"
                      @click="assignDriver(order)"
                      class="text-purple-600 hover:text-purple-900"
                    >
                      <UserPlus class="h-4 w-4" />
                    </button>
                    <button
                      @click="viewChat(order.id)"
                      class="text-orange-600 hover:text-orange-900"
                    >
                      <MessageCircle class="h-4 w-4" />
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
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalOrders) }} of {{ totalOrders }} results
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

      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Order Details - #{{ selectedOrder.order_number }}</h3>
            <button @click="selectedOrder = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Order Information -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Order Information</h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Order Number:</span>
                    <span class="font-medium">{{ selectedOrder.order_number }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Service Type:</span>
                    <span class="font-medium">{{ formatServiceType(selectedOrder.service_type) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span :class="getStatusColor(selectedOrder.status)" class="px-2 py-1 rounded text-sm">
                      {{ formatStatus(selectedOrder.status) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Delivery Fee:</span>
                    <span class="font-medium">₱{{ selectedOrder.delivery_fee.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Created:</span>
                    <span class="font-medium">{{ formatDateTime(selectedOrder.created_at) }}</span>
                  </div>
                </div>

                <!-- Addresses -->
                <div class="mt-6">
                  <h5 class="font-medium text-gray-900 mb-2">Pickup Address</h5>
                  <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded">{{ selectedOrder.pickup_address }}</p>
                </div>
                <div class="mt-4">
                  <h5 class="font-medium text-gray-900 mb-2">Delivery Address</h5>
                  <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded">{{ selectedOrder.delivery_address }}</p>
                </div>

                <!-- Items Description -->
                <div v-if="selectedOrder.items_description" class="mt-4">
                  <h5 class="font-medium text-gray-900 mb-2">Items Description</h5>
                  <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded">{{ selectedOrder.items_description }}</p>
                </div>

                <!-- Special Instructions -->
                <div v-if="selectedOrder.special_instructions" class="mt-4">
                  <h5 class="font-medium text-gray-900 mb-2">Special Instructions</h5>
                  <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded">{{ selectedOrder.special_instructions }}</p>
                </div>
              </div>

              <!-- Images and Actions -->
              <div>
                <!-- Payment Proof -->
                <div v-if="selectedOrder.payment_proof_url" class="mb-6">
                  <h5 class="font-medium text-gray-900 mb-2">Payment Proof</h5>
                  <img
                    :src="selectedOrder.payment_proof_url"
                    alt="Payment proof"
                    class="w-full max-w-sm rounded-lg border"
                  />
                </div>

                <!-- Delivery Proof -->
                <div v-if="selectedOrder.proof_of_delivery_photo" class="mb-6">
                  <h5 class="font-medium text-gray-900 mb-2">Proof of Delivery</h5>
                  <img
                    :src="selectedOrder.proof_of_delivery_photo"
                    alt="Delivery proof"
                    class="w-full max-w-sm rounded-lg border"
                  />
                </div>

                <!-- Barcode -->
                <div class="mb-6">
                  <h5 class="font-medium text-gray-900 mb-2">Order Barcode</h5>
                  <BarcodeViewer :value="selectedOrder.order_number" />
                </div>

                <!-- Actions -->
                <div class="space-y-3">
                  <div v-if="selectedOrder.status === 'pending'" class="flex space-x-2">
                    <button
                      @click="approveOrder(selectedOrder.id)"
                      class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Order
                    </button>
                    <button
                      @click="rejectOrder(selectedOrder.id)"
                      class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject Order
                    </button>
                  </div>
                  <div v-if="!selectedOrder.driver_id && selectedOrder.status === 'approved'">
                    <button
                      @click="assignDriver(selectedOrder)"
                      class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Assign Driver
                    </button>
                  </div>
                  <button
                    @click="viewChat(selectedOrder.id)"
                    class="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    View Chat History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Driver Assignment Modal -->
      <div v-if="showDriverModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Assign Driver</h3>
            <button @click="showDriverModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <button
                @click="getAIRecommendation"
                :disabled="loadingAI"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <div v-if="loadingAI" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                {{ loadingAI ? 'Getting AI Recommendation...' : 'Get AI Recommendation' }}
              </button>
            </div>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="driver in availableDrivers"
                :key="driver.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                :class="{ 'border-blue-500 bg-blue-50': driver.recommended }"
              >
                <div class="flex items-center">
                  <img
                    :src="driver.profile_picture || '/placeholder.svg?height=40&width=40'"
                    alt="Driver"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div class="ml-3">
                    <p class="font-medium text-gray-900">
                      {{ driver.first_name }} {{ driver.last_name }}
                      <span v-if="driver.recommended" class="text-blue-600 text-sm">(AI Recommended)</span>
                    </p>
                    <p class="text-sm text-gray-600">{{ driver.contact_number }}</p>
                    <p class="text-xs text-gray-500">
                      Rating: {{ driver.rating?.toFixed(1) || 'N/A' }} | 
                      Distance: {{ driver.distance?.toFixed(1) || 'N/A' }}km
                    </p>
                  </div>
                </div>
                <button
                  @click="assignDriverToOrder(driver.id)"
                  class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Eye, Check, UserPlus, MessageCircle, X } from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import { driverAssignment } from '@/utils/driverAssignment'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'
import BarcodeViewer from '@/components/BarcodeViewer.vue'

const router = useRouter()
const { supabase } = useSupabase()
const { subscribeToOrders } = useRealtime()
const toast = useToast()

const loading = ref(true)
const loadingAI = ref(false)
const orders = ref([])
const selectedOrder = ref(null)
const showDriverModal = ref(false)
const availableDrivers = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalOrders = ref(0)
const searchQuery = ref('')

const filters = ref({
  status: '',
  serviceType: '',
  dateFrom: '',
  dateTo: ''
})

const totalPages = computed(() => Math.ceil(totalOrders.value / pageSize.value))

const fetchOrders = async () => {
  try {
    loading.value = true

    let query = supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey(first_name, last_name, contact_number, profile_picture),
        drivers!orders_driver_id_fkey(first_name, last_name, contact_number, profile_picture)
      `, { count: 'exact' })

    // Apply filters
    if (filters.value.status) {
      query = query.eq('status', filters.value.status)
    }
    if (filters.value.serviceType) {
      query = query.eq('service_type', filters.value.serviceType)
    }
    if (filters.value.dateFrom) {
      query = query.gte('created_at', filters.value.dateFrom)
    }
    if (filters.value.dateTo) {
      query = query.lte('created_at', filters.value.dateTo + 'T23:59:59')
    }
    if (searchQuery.value) {
      query = query.or(`order_number.ilike.%${searchQuery.value}%,pickup_address.ilike.%${searchQuery.value}%,delivery_address.ilike.%${searchQuery.value}%`)
    }

    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    orders.value = data?.map(order => ({
      ...order,
      customer_name: order.users ? `${order.users.first_name} ${order.users.last_name}` : 'Unknown',
      customer_contact: order.users?.contact_number || 'N/A',
      customer_avatar: order.users?.profile_picture,
      driver_name: order.drivers ? `${order.drivers.first_name} ${order.drivers.last_name}` : null,
      driver_contact: order.drivers?.contact_number,
      driver_avatar: order.drivers?.profile_picture
    })) || []

    totalOrders.value = count || 0
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Failed to load orders')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchOrders()
}

const resetFilters = () => {
  filters.value = {
    status: '',
    serviceType: '',
    dateFrom: '',
    dateTo: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
  fetchOrders()
}

const viewOrder = (order) => {
  selectedOrder.value = order
}

const approveOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    toast.success('Order approved successfully!')
    await fetchOrders()
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value = null
    }
  } catch (error) {
    console.error('Error approving order:', error)
    toast.error('Failed to approve order')
  }
}

const rejectOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    toast.success('Order rejected')
    await fetchOrders()
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value = null
    }
  } catch (error) {
    console.error('Error rejecting order:', error)
    toast.error('Failed to reject order')
  }
}

const assignDriver = async (order) => {
  try {
    // Fetch available drivers
    const { data: drivers, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_online', true)
      .eq('status', 'approved')

    if (error) throw error

    availableDrivers.value = drivers || []
    selectedOrder.value = order
    showDriverModal.value = true
  } catch (error) {
    console.error('Error fetching drivers:', error)
    toast.error('Failed to load available drivers')
  }
}

const getAIRecommendation = async () => {
  try {
    loadingAI.value = true

    const orderData = {
      pickup_lat: selectedOrder.value.pickup_lat,
      pickup_lng: selectedOrder.value.pickup_lng,
      delivery_lat: selectedOrder.value.delivery_lat,
      delivery_lng: selectedOrder.value.delivery_lng,
      service_type: selectedOrder.value.service_type
    }

    const recommendation = await driverAssignment.findOptimalDriver(orderData, availableDrivers.value)

    if (recommendation) {
      // Mark recommended driver
      availableDrivers.value = availableDrivers.value.map(driver => ({
        ...driver,
        recommended: driver.id === recommendation.id,
        distance: driver.id === recommendation.id ? recommendation.distance : driver.distance,
        rating: driver.rating || 0
      }))

      toast.success('AI recommendation generated!')
    } else {
      toast.warning('No suitable driver found by AI')
    }
  } catch (error) {
    console.error('Error getting AI recommendation:', error)
    toast.error('Failed to get AI recommendation')
  } finally {
    loadingAI.value = false
  }
}

const assignDriverToOrder = async (driverId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        driver_id: driverId,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedOrder.value.id)

    if (error) throw error

    // Create notification for driver
    await supabase
      .from('notifications')
      .insert({
        user_id: driverId,
        user_type: 'driver',
        title: 'New Order Assigned',
        message: `You have been assigned order #${selectedOrder.value.order_number}`,
        type: 'order_assigned',
        order_id: selectedOrder.value.id
      })

    toast.success('Driver assigned successfully!')
    showDriverModal.value = false
    selectedOrder.value = null
    await fetchOrders()
  } catch (error) {
    console.error('Error assigning driver:', error)
    toast.error('Failed to assign driver')
  }
}

const viewChat = (orderId) => {
  router.push(`/admin/order-chat-monitor/${orderId}`)
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

watch(currentPage, () => {
  fetchOrders()
})

watch(searchQuery, () => {
  if (searchQuery.value.length === 0 || searchQuery.value.length >= 3) {
    currentPage.value = 1
    fetchOrders()
  }
})

onMounted(async () => {
  await fetchOrders()
  
  // Subscribe to real-time updates
  subscribeToOrders(() => {
    fetchOrders()
  })
})
</script>
