<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Drivers</h1>
        <p class="text-gray-600 mt-2">View and manage all delivery drivers</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <Users class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Drivers</p>
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
              <p class="text-sm font-medium text-gray-600">Active Drivers</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <Clock class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Online Now</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.online }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <AlertCircle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Approval</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label for="online_filter" class="block text-sm font-medium text-gray-700 mb-1">
              Online Status
            </label>
            <select
              id="online_filter"
              v-model="filters.isOnline"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
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
                  placeholder="Search drivers..."
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Drivers Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
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
                  <p class="text-gray-600 mt-2">Loading drivers...</p>
                </td>
              </tr>
              <tr v-else-if="drivers.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No drivers found
                </td>
              </tr>
              <tr v-else v-for="driver in drivers" :key="driver.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="relative">
                      <img
                        :src="driver.profile_picture || '/placeholder.svg?height=40&width=40'"
                        alt="Driver"
                        class="w-10 h-10 rounded-full object-cover"
                      />
                      <div
                        v-if="driver.is_online"
                        class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                      ></div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ driver.first_name }} {{ driver.last_name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Joined {{ formatDate(driver.created_at) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ driver.contact_number }}</div>
                  <div class="text-sm text-gray-500">{{ driver.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ driver.motorcycle_plate || 'N/A' }}</div>
                  <div class="text-sm text-gray-500">{{ driver.motorcycle_model || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-1">
                    <span :class="getStatusColor(driver.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ formatStatus(driver.status) }}
                    </span>
                    <span :class="driver.is_online ? 'text-green-600' : 'text-gray-500'" class="text-xs">
                      {{ driver.is_online ? 'Online' : 'Offline' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <div class="flex items-center">
                      <Star class="h-4 w-4 text-yellow-400 mr-1" />
                      {{ driver.rating?.toFixed(1) || 'N/A' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ driver.total_deliveries || 0 }} deliveries
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ driver.completion_rate?.toFixed(1) || 0 }}% completion
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewDriver(driver)"
                      class="text-green-600 hover:text-green-900"
                      title="View Details"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      v-if="driver.status === 'pending'"
                      @click="approveDriver(driver.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Approve"
                    >
                      <Check class="h-4 w-4" />
                    </button>
                    <button
                      v-if="driver.status === 'approved'"
                      @click="suspendDriver(driver.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Suspend"
                    >
                      <Ban class="h-4 w-4" />
                    </button>
                    <button
                      v-if="driver.status === 'suspended'"
                      @click="reactivateDriver(driver.id)"
                      class="text-green-600 hover:text-green-900"
                      title="Reactivate"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button
                      @click="viewEarnings(driver.id)"
                      class="text-purple-600 hover:text-purple-900"
                      title="View Earnings"
                    >
                      <DollarSign class="h-4 w-4" />
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
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalDrivers) }} of {{ totalDrivers }} results
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

      <!-- Driver Details Modal -->
      <div v-if="selectedDriver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Driver Details - {{ selectedDriver.first_name }} {{ selectedDriver.last_name }}
            </h3>
            <button @click="selectedDriver = null" class="text-gray-400 hover:text-gray-600">
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
                      :src="selectedDriver.profile_picture || '/placeholder.svg?height=80&width=80'"
                      alt="Driver"
                      class="w-20 h-20 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <h5 class="text-lg font-medium">{{ selectedDriver.first_name }} {{ selectedDriver.last_name }}</h5>
                      <p class="text-gray-600">{{ selectedDriver.email }}</p>
                      <p class="text-gray-600">{{ selectedDriver.contact_number }}</p>
                    </div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Address</h6>
                    <p class="text-sm text-gray-600">{{ selectedDriver.address || 'Not provided' }}</p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Vehicle Information</h6>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Plate:</span> {{ selectedDriver.motorcycle_plate || 'N/A' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Model:</span> {{ selectedDriver.motorcycle_model || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Documents and Performance -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Documents & Performance</h4>
                
                <!-- Documents -->
                <div class="mb-6">
                  <h5 class="font-medium mb-3">Documents</h5>
                  <div class="grid grid-cols-2 gap-4">
                    <div v-if="selectedDriver.license_url" class="text-center">
                      <img
                        :src="selectedDriver.license_url"
                        alt="License"
                        class="w-full h-24 object-cover rounded border cursor-pointer"
                        @click="viewDocument(selectedDriver.license_url, 'License')"
                      />
                      <p class="text-xs text-gray-600 mt-1">License</p>
                    </div>
                    <div v-if="selectedDriver.orcr_url" class="text-center">
                      <img
                        :src="selectedDriver.orcr_url"
                        alt="ORCR"
                        class="w-full h-24 object-cover rounded border cursor-pointer"
                        @click="viewDocument(selectedDriver.orcr_url, 'ORCR')"
                      />
                      <p class="text-xs text-gray-600 mt-1">ORCR</p>
                    </div>
                    <div v-if="selectedDriver.selfie_with_id_url" class="text-center">
                      <img
                        :src="selectedDriver.selfie_with_id_url"
                        alt="Selfie with ID"
                        class="w-full h-24 object-cover rounded border cursor-pointer"
                        @click="viewDocument(selectedDriver.selfie_with_id_url, 'Selfie with ID')"
                      />
                      <p class="text-xs text-gray-600 mt-1">Selfie with ID</p>
                    </div>
                  </div>
                </div>

                <!-- Performance Stats -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h5 class="font-medium mb-3">Performance Statistics</h5>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-green-600">{{ selectedDriver.rating?.toFixed(1) || 'N/A' }}</p>
                      <p class="text-sm text-gray-600">Rating</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-blue-600">{{ selectedDriver.total_deliveries || 0 }}</p>
                      <p class="text-sm text-gray-600">Total Deliveries</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-purple-600">{{ selectedDriver.completion_rate?.toFixed(1) || 0 }}%</p>
                      <p class="text-sm text-gray-600">Completion Rate</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-orange-600">{{ selectedDriver.avg_response_time || 0 }}s</p>
                      <p class="text-sm text-gray-600">Avg Response</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 space-y-2">
                  <div v-if="selectedDriver.status === 'pending'" class="flex space-x-2">
                    <button
                      @click="approveDriver(selectedDriver.id)"
                      class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Driver
                    </button>
                    <button
                      @click="rejectDriver(selectedDriver.id)"
                      class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject Driver
                    </button>
                  </div>
                  <div v-if="selectedDriver.status === 'approved'">
                    <button
                      @click="suspendDriver(selectedDriver.id)"
                      class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Suspend Driver
                    </button>
                  </div>
                  <div v-if="selectedDriver.status === 'suspended'">
                    <button
                      @click="reactivateDriver(selectedDriver.id)"
                      class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Reactivate Driver
                    </button>
                  </div>
                  <button
                    @click="viewEarnings(selectedDriver.id)"
                    class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    View Earnings History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Viewer Modal -->
      <div v-if="documentViewer.show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ documentViewer.title }}</h3>
            <button @click="documentViewer.show = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6 text-center">
            <img
              :src="documentViewer.url"
              :alt="documentViewer.title"
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
import { useRouter } from 'vue-router'
import { 
  Users, UserCheck, Clock, AlertCircle, Search, Eye, Check, Ban, 
  CheckCircle, DollarSign, Star, X 
} from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const { supabase } = useSupabase()
const { subscribeToDrivers } = useRealtime()
const toast = useToast()

const loading = ref(true)
const drivers = ref([])
const selectedDriver = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalDrivers = ref(0)
const searchQuery = ref('')

const stats = ref({
  total: 0,
  active: 0,
  online: 0,
  pending: 0
})

const filters = ref({
  status: '',
  isOnline: ''
})

const documentViewer = ref({
  show: false,
  url: '',
  title: ''
})

const totalPages = computed(() => Math.ceil(totalDrivers.value / pageSize.value))

const fetchStats = async () => {
  try {
    // Total drivers
    const { count: total } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })

    // Active drivers
    const { count: active } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Online drivers
    const { count: online } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('is_online', true)
      .eq('status', 'approved')

    // Pending drivers
    const { count: pending } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    stats.value = {
      total: total || 0,
      active: active || 0,
      online: online || 0,
      pending: pending || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchDrivers = async () => {
  try {
    loading.value = true

    let query = supabase
      .from('drivers')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.value.status) {
      query = query.eq('status', filters.value.status)
    }
    if (filters.value.isOnline !== '') {
      query = query.eq('is_online', filters.value.isOnline === 'true')
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

    drivers.value = data || []
    totalDrivers.value = count || 0
  } catch (error) {
    console.error('Error fetching drivers:', error)
    toast.error('Failed to load drivers')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchDrivers()
}

const resetFilters = () => {
  filters.value = {
    status: '',
    isOnline: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
  fetchDrivers()
}

const viewDriver = (driver) => {
  selectedDriver.value = driver
}

const approveDriver = async (driverId) => {
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', driverId)

    if (error) throw error

    toast.success('Driver approved successfully!')
    await fetchStats()
    await fetchDrivers()
    if (selectedDriver.value?.id === driverId) {
      selectedDriver.value = null
    }
  } catch (error) {
    console.error('Error approving driver:', error)
    toast.error('Failed to approve driver')
  }
}

const rejectDriver = async (driverId) => {
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', driverId)

    if (error) throw error

    toast.success('Driver rejected')
    await fetchStats()
    await fetchDrivers()
    if (selectedDriver.value?.id === driverId) {
      selectedDriver.value = null
    }
  } catch (error) {
    console.error('Error rejecting driver:', error)
    toast.error('Failed to reject driver')
  }
}

const suspendDriver = async (driverId) => {
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ 
        status: 'suspended',
        is_online: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', driverId)

    if (error) throw error

    toast.success('Driver suspended')
    await fetchStats()
    await fetchDrivers()
    if (selectedDriver.value?.id === driverId) {
      selectedDriver.value = null
    }
  } catch (error) {
    console.error('Error suspending driver:', error)
    toast.error('Failed to suspend driver')
  }
}

const reactivateDriver = async (driverId) => {
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', driverId)

    if (error) throw error

    toast.success('Driver reactivated')
    await fetchStats()
    await fetchDrivers()
    if (selectedDriver.value?.id === driverId) {
      selectedDriver.value = null
    }
  } catch (error) {
    console.error('Error reactivating driver:', error)
    toast.error('Failed to reactivate driver')
  }
}

const viewEarnings = (driverId) => {
  router.push(`/dashboard/admin/driver-earnings/${driverId}`)
}

const viewDocument = (url, title) => {
  documentViewer.value = {
    show: true,
    url,
    title
  }
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800'
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

watch(currentPage, () => {
  fetchDrivers()
})

watch(searchQuery, () => {
  if (searchQuery.value.length === 0 || searchQuery.value.length >= 3) {
    currentPage.value = 1
    fetchDrivers()
  }
})

onMounted(async () => {
  await fetchStats()
  await fetchDrivers()
  
  // Subscribe to real-time updates
  subscribeToDrivers(() => {
    fetchStats()
    fetchDrivers()
  })
})
</script>
