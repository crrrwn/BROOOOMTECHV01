<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Driver Applications</h1>
        <p class="text-gray-600 mt-2">Review and manage driver applications</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <Clock class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Review</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Approved</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.approved }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100">
              <XCircle class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rejected</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <Users class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Applications</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
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
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label for="date_from" class="block text-sm font-medium text-gray-700 mb-1">
              Applied From
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
                  placeholder="Search applications..."
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
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
                  Applied Date
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
                  <p class="text-gray-600 mt-2">Loading applications...</p>
                </td>
              </tr>
              <tr v-else-if="applications.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
              <tr v-else v-for="application in applications" :key="application.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      :src="application.profile_picture || '/placeholder.svg?height=40&width=40'"
                      alt="Applicant"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.first_name }} {{ application.last_name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ application.experience }} years experience
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ application.contact_number }}</div>
                  <div class="text-sm text-gray-500">{{ application.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ application.motorcycle_model || 'N/A' }}</div>
                  <div class="text-sm text-gray-500">{{ application.motorcycle_plate || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(application.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatStatus(application.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(application.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewApplication(application)"
                      class="text-green-600 hover:text-green-900"
                      title="View Details"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      v-if="application.status === 'pending'"
                      @click="markUnderReview(application.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Mark Under Review"
                    >
                      <Clock class="h-4 w-4" />
                    </button>
                    <button
                      v-if="['pending', 'under_review'].includes(application.status)"
                      @click="approveApplication(application.id)"
                      class="text-green-600 hover:text-green-900"
                      title="Approve"
                    >
                      <Check class="h-4 w-4" />
                    </button>
                    <button
                      v-if="['pending', 'under_review'].includes(application.status)"
                      @click="rejectApplication(application.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Reject"
                    >
                      <X class="h-4 w-4" />
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
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalApplications) }} of {{ totalApplications }} results
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

      <!-- Application Details Modal -->
      <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Driver Application - {{ selectedApplication.first_name }} {{ selectedApplication.last_name }}
            </h3>
            <button @click="selectedApplication = null" class="text-gray-400 hover:text-gray-600">
              <XIcon class="h-6 w-6" />
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
                      :src="selectedApplication.profile_picture || '/placeholder.svg?height=80&width=80'"
                      alt="Applicant"
                      class="w-20 h-20 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <h5 class="text-lg font-medium">
                        {{ selectedApplication.first_name }} {{ selectedApplication.last_name }}
                      </h5>
                      <p class="text-gray-600">{{ selectedApplication.email }}</p>
                      <p class="text-gray-600">{{ selectedApplication.contact_number }}</p>
                    </div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Address</h6>
                    <p class="text-sm text-gray-600">{{ selectedApplication.address || 'Not provided' }}</p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Experience & Availability</h6>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Experience:</span> {{ selectedApplication.experience }} years
                    </p>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Availability:</span> {{ selectedApplication.availability || 'Not specified' }}
                    </p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h6 class="font-medium mb-2">Vehicle Information</h6>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Model:</span> {{ selectedApplication.motorcycle_model || 'N/A' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Plate:</span> {{ selectedApplication.motorcycle_plate || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div>
                <h4 class="text-lg font-medium text-gray-900 mb-4">Documents</h4>
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div v-if="selectedApplication.license_url" class="text-center">
                    <img
                      :src="selectedApplication.license_url"
                      alt="License"
                      class="w-full h-32 object-cover rounded border cursor-pointer"
                      @click="viewDocument(selectedApplication.license_url, 'License')"
                    />
                    <p class="text-xs text-gray-600 mt-1">License</p>
                  </div>
                  <div v-if="selectedApplication.orcr_url" class="text-center">
                    <img
                      :src="selectedApplication.orcr_url"
                      alt="ORCR"
                      class="w-full h-32 object-cover rounded border cursor-pointer"
                      @click="viewDocument(selectedApplication.orcr_url, 'ORCR')"
                    />
                    <p class="text-xs text-gray-600 mt-1">ORCR</p>
                  </div>
                  <div v-if="selectedApplication.selfie_with_id_url" class="text-center">
                    <img
                      :src="selectedApplication.selfie_with_id_url"
                      alt="Selfie with ID"
                      class="w-full h-32 object-cover rounded border cursor-pointer"
                      @click="viewDocument(selectedApplication.selfie_with_id_url, 'Selfie with ID')"
                    />
                    <p class="text-xs text-gray-600 mt-1">Selfie with ID</p>
                  </div>
                </div>

                <!-- Application Status -->
                <div class="bg-gray-50 p-4 rounded-lg mb-6">
                  <h5 class="font-medium mb-2">Application Status</h5>
                  <span :class="getStatusColor(selectedApplication.status)" class="px-2 py-1 rounded text-sm">
                    {{ formatStatus(selectedApplication.status) }}
                  </span>
                  <p class="text-xs text-gray-500 mt-2">
                    Applied on {{ formatDateTime(selectedApplication.created_at) }}
                  </p>
                  <div v-if="selectedApplication.admin_notes" class="mt-3">
                    <h6 class="font-medium text-sm">Admin Notes:</h6>
                    <p class="text-sm text-gray-600">{{ selectedApplication.admin_notes }}</p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2">
                  <div v-if="selectedApplication.status === 'pending'">
                    <button
                      @click="markUnderReview(selectedApplication.id)"
                      class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-2"
                    >
                      Mark Under Review
                    </button>
                  </div>
                  <div v-if="['pending', 'under_review'].includes(selectedApplication.status)" class="flex space-x-2">
                    <button
                      @click="approveApplication(selectedApplication.id)"
                      class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve Application
                    </button>
                    <button
                      @click="rejectApplication(selectedApplication.id)"
                      class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject Application
                    </button>
                  </div>
                  <button
                    @click="showNotesModal = true"
                    class="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Add Admin Notes
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
              <XIcon class="h-6 w-6" />
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

      <!-- Admin Notes Modal -->
      <div v-if="showNotesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Add Admin Notes</h3>
            <button @click="showNotesModal = false" class="text-gray-400 hover:text-gray-600">
              <XIcon class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="saveAdminNotes">
              <div class="mb-4">
                <label for="admin_notes" class="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="admin_notes"
                  v-model="adminNotes"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add notes about this application..."
                ></textarea>
              </div>
              <div class="flex space-x-2">
                <button
                  type="submit"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Notes
                </button>
                <button
                  type="button"
                  @click="showNotesModal = false"
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
import { 
  Clock, CheckCircle, XCircle, Users, Search, Eye, Check, X as XIcon 
} from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useRealtime } from '@/composables/useRealtime'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const { supabase } = useSupabase()
const { subscribeToDriverApplications } = useRealtime()
const toast = useToast()

const loading = ref(true)
const applications = ref([])
const selectedApplication = ref(null)
const showNotesModal = ref(false)
const adminNotes = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalApplications = ref(0)
const searchQuery = ref('')

const stats = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0
})

const filters = ref({
  status: '',
  dateFrom: ''
})

const documentViewer = ref({
  show: false,
  url: '',
  title: ''
})

const totalPages = computed(() => Math.ceil(totalApplications.value / pageSize.value))

onMounted(async () => {
  await fetchStats()
  await fetchApplications()
  
  // Subscribe to real-time updates
  subscribeToDriverApplications(() => {
    fetchStats()
    fetchApplications()
  })
})

const fetchStats = async () => {
  try {
    // Pending applications
    const { count: pending } = await supabase
      .from('driver_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Approved applications
    const { count: approved } = await supabase
      .from('driver_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Rejected applications
    const { count: rejected } = await supabase
      .from('driver_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    // Total applications
    const { count: total } = await supabase
      .from('driver_applications')
      .select('*', { count: 'exact', head: true })

    stats.value = {
      pending: pending || 0,
      approved: approved || 0,
      rejected: rejected || 0,
      total: total || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchApplications = async () => {
  try {
    loading.value = true

    let query = supabase
      .from('driver_applications')
      .select('*', { count: 'exact' })

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

    applications.value = data || []
    totalApplications.value = count || 0
  } catch (error) {
    console.error('Error fetching applications:', error)
    toast.error('Failed to load applications')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchApplications()
}

const resetFilters = () => {
  filters.value = {
    status: '',
    dateFrom: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
  fetchApplications()
}

const viewApplication = (application) => {
  selectedApplication.value = application
}

const markUnderReview = async (applicationId) => {
  try {
    const { error } = await supabase
      .from('driver_applications')
      .update({ 
        status: 'under_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (error) throw error

    toast.success('Application marked under review')
    await fetchStats()
    await fetchApplications()
    if (selectedApplication.value?.id === applicationId) {
      selectedApplication.value.status = 'under_review'
    }
  } catch (error) {
    console.error('Error updating application:', error)
    toast.error('Failed to update application')
  }
}

const approveApplication = async (applicationId) => {
  try {
    const application = applications.value.find(app => app.id === applicationId) || selectedApplication.value

    // First, create driver account
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .insert({
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email,
        contact_number: application.contact_number,
        address: application.address,
        motorcycle_model: application.motorcycle_model,
        motorcycle_plate: application.motorcycle_plate,
        license_url: application.license_url,
        orcr_url: application.orcr_url,
        selfie_with_id_url: application.selfie_with_id_url,
        profile_picture: application.profile_picture,
        status: 'approved',
        is_online: false,
        rating: 5.0,
        total_deliveries: 0,
        completion_rate: 100.0
      })
      .select()
      .single()

    if (driverError) throw driverError

    // Update application status
    const { error: updateError } = await supabase
      .from('driver_applications')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (updateError) throw updateError

    // Send notification to applicant
    await supabase
      .from('notifications')
      .insert({
        user_id: driver.id,
        user_type: 'driver',
        title: 'Application Approved!',
        message: 'Congratulations! Your driver application has been approved. You can now login and start accepting deliveries.',
        type: 'application_approved'
      })

    toast.success('Application approved and driver account created!')
    await fetchStats()
    await fetchApplications()
    if (selectedApplication.value?.id === applicationId) {
      selectedApplication.value = null
    }
  } catch (error) {
    console.error('Error approving application:', error)
    toast.error('Failed to approve application')
  }
}

const rejectApplication = async (applicationId) => {
  try {
    const { error } = await supabase
      .from('driver_applications')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (error) throw error

    toast.success('Application rejected')
    await fetchStats()
    await fetchApplications()
    if (selectedApplication.value?.id === applicationId) {
      selectedApplication.value = null
    }
  } catch (error) {
    console.error('Error rejecting application:', error)
    toast.error('Failed to reject application')
  }
}

const viewDocument = (url, title) => {
  documentViewer.value = {
    show: true,
    url,
    title
  }
}

const saveAdminNotes = async () => {
  try {
    const { error } = await supabase
      .from('driver_applications')
      .update({ 
        admin_notes: adminNotes.value,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedApplication.value.id)

    if (error) throw error

    toast.success('Admin notes saved')
    selectedApplication.value.admin_notes = adminNotes.value
    showNotesModal.value = false
    adminNotes.value = ''
  } catch (error) {
    console.error('Error saving notes:', error)
    toast.error('Failed to save notes')
  }
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(currentPage, () => {
  fetchApplications()
})

watch(searchQuery, () => {
  if (searchQuery.value.length === 0 || searchQuery.value.length >= 3) {
    currentPage.value = 1
    fetchApplications()
  }
})
</script>
