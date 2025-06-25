<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p class="text-gray-600 mt-2">Manage your current and completed deliveries</p>
      </div>

      <!-- Status Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="getTabCount(tab.key) > 0"
                :class="[
                  'ml-2 py-0.5 px-2 rounded-full text-xs',
                  activeTab === tab.key
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ getTabCount(tab.key) }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Assignments List -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading assignments...</p>
          </div>
          
          <div v-else-if="filteredAssignments.length === 0" class="text-center py-8">
            <Truck class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 text-lg">No {{ activeTab }} assignments</p>
            <p class="text-gray-500 mt-2">{{ getEmptyMessage() }}</p>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="assignment in filteredAssignments"
              :key="assignment.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <!-- Header -->
                  <div class="flex items-center mb-3">
                    <span :class="getStatusColor(assignment.status)" class="text-sm font-medium px-3 py-1 rounded-full">
                      {{ formatStatus(assignment.status) }}
                    </span>
                    <span class="ml-3 text-sm text-gray-600 font-medium">
                      Order #{{ assignment.order_number }}
                    </span>
                    <span class="ml-3 text-xs text-gray-500">
                      {{ formatServiceType(assignment.service_type) }}
                    </span>
                  </div>

                  <!-- Customer Info -->
                  <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-1">
                      <User class="inline h-4 w-4 mr-2" />
                      {{ assignment.customer_name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <Phone class="inline h-4 w-4 mr-2" />
                      {{ assignment.customer_contact }}
                    </p>
                  </div>

                  <!-- Addresses -->
                  <div class="mb-3">
                    <p class="text-sm text-gray-600 mb-1">
                      <MapPin class="inline h-4 w-4 mr-2 text-blue-500" />
                      <span class="font-medium">Pickup:</span> {{ assignment.pickup_address }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <Navigation class="inline h-4 w-4 mr-2 text-red-500" />
                      <span class="font-medium">Delivery:</span> {{ assignment.delivery_address }}
                    </p>
                  </div>

                  <!-- Timeline -->
                  <div class="mb-3">
                    <div class="flex items-center text-xs text-gray-500 space-x-4">
                      <span>
                        <Clock class="inline h-3 w-3 mr-1" />
                        Assigned: {{ formatDateTime(assignment.assigned_at) }}
                      </span>
                      <span v-if="assignment.picked_up_at">
                        Picked up: {{ formatDateTime(assignment.picked_up_at) }}
                      </span>
                      <span v-if="assignment.delivered_at">
                        Delivered: {{ formatDateTime(assignment.delivered_at) }}
                      </span>
                    </div>
                  </div>

                  <!-- Payment Info -->
                  <div class="flex items-center text-sm text-gray-600">
                    <CreditCard class="h-4 w-4 mr-2" />
                    <span class="font-medium">₱{{ assignment.delivery_fee }}</span>
                    <span class="ml-2 capitalize">{{ assignment.payment_method }}</span>
                    <span v-if="assignment.payment_status === 'paid'" class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Paid
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col space-y-2 ml-6">
                  <button
                    @click="openMaps(assignment.delivery_address)"
                    class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <MapPin class="h-4 w-4 mr-1" />
                    Maps
                  </button>
                  
                  <button
                    v-if="assignment.status !== 'delivered' && assignment.status !== 'cancelled'"
                    @click="updateStatus(assignment)"
                    class="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    {{ getNextStatusAction(assignment.status) }}
                  </button>
                  
                  <button
                    @click="openChat(assignment.id)"
                    class="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <MessageSquare class="h-4 w-4 mr-1" />
                    Chat
                  </button>
                  
                  <button
                    v-if="assignment.status === 'delivered'"
                    @click="viewProofOfDelivery(assignment.id)"
                    class="bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
                  >
                    View Proof
                  </button>
                </div>
              </div>

              <!-- Progress Bar for Active Orders -->
              <div v-if="assignment.status !== 'delivered' && assignment.status !== 'cancelled'" class="mt-4">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{{ getProgressPercentage(assignment.status) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${getProgressPercentage(assignment.status)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="selectedAssignment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Update Order Status</h3>
            <button
              @click="selectedAssignment = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <X class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <p class="text-gray-600 mb-4">
            Update status for Order #{{ selectedAssignment.order_number }}
          </p>
          
          <div class="space-y-3">
            <button
              v-if="selectedAssignment.status === 'assigned'"
              @click="updateOrderStatus('picked_up')"
              :disabled="updating"
              class="w-full bg-yellow-600 text-white px-4 py-3 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              Mark as Picked Up
            </button>
            
            <button
              v-if="selectedAssignment.status === 'picked_up'"
              @click="updateOrderStatus('in_transit')"
              :disabled="updating"
              class="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Mark as In Transit
            </button>
            
            <button
              v-if="selectedAssignment.status === 'in_transit'"
              @click="completeDelivery"
              :disabled="updating"
              class="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Complete Delivery
            </button>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button
              @click="selectedAssignment = null"
              class="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
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
  Truck,
  User,
  Phone,
  MapPin,
  Navigation,
  Clock,
  CreditCard,
  MessageSquare,
  X
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const router = useRouter()
const { user } = useAuth()
const { supabase } = useSupabase()
const { subscribeToTable } = useRealtime()
const toast = useToast()

const loading = ref(true)
const updating = ref(false)
const assignments = ref([])
const selectedAssignment = ref(null)
const activeTab = ref('active')

const tabs = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' }
]

const filteredAssignments = computed(() => {
  if (activeTab.value === 'active') {
    return assignments.value.filter(a => ['assigned', 'picked_up', 'in_transit'].includes(a.status))
  } else if (activeTab.value === 'completed') {
    return assignments.value.filter(a => ['delivered', 'cancelled'].includes(a.status))
  }
  return assignments.value
})

const getTabCount = (tabKey) => {
  if (tabKey === 'active') {
    return assignments.value.filter(a => ['assigned', 'picked_up', 'in_transit'].includes(a.status)).length
  } else if (tabKey === 'completed') {
    return assignments.value.filter(a => ['delivered', 'cancelled'].includes(a.status)).length
  }
  return assignments.value.length
}

const getEmptyMessage = () => {
  if (activeTab.value === 'active') {
    return 'No active assignments. Check available bookings to accept new orders.'
  } else if (activeTab.value === 'completed') {
    return 'No completed assignments yet.'
  }
  return 'No assignments found.'
}

const updateStatus = (assignment) => {
  selectedAssignment.value = assignment
}

const updateOrderStatus = async (newStatus) => {
  try {
    updating.value = true
    
    const updateData = {
      status: newStatus
    }
    
    if (newStatus === 'picked_up') {
      updateData.picked_up_at = new Date().toISOString()
    } else if (newStatus === 'in_transit') {
      updateData.in_transit_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', selectedAssignment.value.id)

    if (error) throw error

    toast.success(`Order status updated to ${formatStatus(newStatus)}`)
    selectedAssignment.value = null
    await loadAssignments()
  } catch (error) {
    console.error('Error updating order status:', error)
    toast.error('Failed to update order status')
  } finally {
    updating.value = false
  }
}

const completeDelivery = () => {
  router.push(`/driver/proof-of-delivery/${selectedAssignment.value.id}`)
}

const openMaps = (address) => {
  const encodedAddress = encodeURIComponent(address)
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
}

const openChat = (orderId) => {
  router.push(`/driver/chat/${orderId}`)
}

const viewProofOfDelivery = (orderId) => {
  router.push(`/driver/proof-of-delivery/${orderId}`)
}

const getStatusColor = (status) => {
  const colors = {
    assigned: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status) => {
  const statuses = {
    assigned: 'Assigned',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

const getNextStatusAction = (status) => {
  const actions = {
    assigned: 'Mark Picked Up',
    picked_up: 'Mark In Transit',
    in_transit: 'Complete Delivery'
  }
  return actions[status] || 'Update Status'
}

const getProgressPercentage = (status) => {
  const progress = {
    assigned: 25,
    picked_up: 50,
    in_transit: 75,
    delivered: 100
  }
  return progress[status] || 0
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const loadAssignments = async () => {
  try {
    const { data } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        service_type,
        status,
        pickup_address,
        delivery_address,
        delivery_fee,
        payment_method,
        payment_status,
        assigned_at,
        picked_up_at,
        delivered_at,
        created_at,
        users!inner(full_name, contact)
      `)
      .eq('driver_id', user.value.id)
      .order('created_at', { ascending: false })

    assignments.value = (data || []).map(order => ({
      ...order,
      customer_name: order.users.full_name,
      customer_contact: order.users.contact
    }))
  } catch (error) {
    console.error('Error loading assignments:', error)
    toast.error('Failed to load assignments')
  }
}

const setupRealtimeSubscriptions = () => {
  subscribeToTable('orders', (payload) => {
    if (payload.new?.driver_id === user.value.id || payload.old?.driver_id === user.value.id) {
      loadAssignments()
    }
  })
}

onMounted(async () => {
  await loadAssignments()
  setupRealtimeSubscriptions()
  loading.value = false
})
</script>
