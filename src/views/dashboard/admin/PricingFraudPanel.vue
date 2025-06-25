<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Pricing & Fraud Detection Panel</h1>
        <p class="text-gray-600 mt-2">Manage dynamic pricing and monitor fraud detection</p>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'pricing'"
            :class="activeTab === 'pricing' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Dynamic Pricing
          </button>
          <button
            @click="activeTab = 'fraud'"
            :class="activeTab === 'fraud' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Fraud Detection
          </button>
        </nav>
      </div>

      <!-- Dynamic Pricing Tab -->
      <div v-if="activeTab === 'pricing'">
        <!-- Pricing Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100">
                <DollarSign class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Base Fee</p>
                <p class="text-2xl font-bold text-gray-900">₱{{ pricingConfig.baseFee }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100">
                <TrendingUp class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Distance Rate</p>
                <p class="text-2xl font-bold text-gray-900">₱{{ pricingConfig.distanceMultiplier }}/km</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100">
                <Clock class="h-6 w-6 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Time Multiplier</p>
                <p class="text-2xl font-bold text-gray-900">{{ pricingConfig.timeMultiplier }}x</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-orange-100">
                <Users class="h-6 w-6 text-orange-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Demand Factor</p>
                <p class="text-2xl font-bold text-gray-900">{{ pricingConfig.demandMultiplier }}x</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Configuration -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Pricing Configuration</h3>
          <form @submit.prevent="updatePricingConfig">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="base_fee" class="block text-sm font-medium text-gray-700 mb-1">
                  Base Fee (₱)
                </label>
                <input
                  id="base_fee"
                  v-model.number="pricingForm.baseFee"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="distance_multiplier" class="block text-sm font-medium text-gray-700 mb-1">
                  Distance Rate (₱/km)
                </label>
                <input
                  id="distance_multiplier"
                  v-model.number="pricingForm.distanceMultiplier"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="time_multiplier" class="block text-sm font-medium text-gray-700 mb-1">
                  Time Multiplier
                </label>
                <input
                  id="time_multiplier"
                  v-model.number="pricingForm.timeMultiplier"
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="demand_multiplier" class="block text-sm font-medium text-gray-700 mb-1">
                  Demand Multiplier
                </label>
                <input
                  id="demand_multiplier"
                  v-model.number="pricingForm.demandMultiplier"
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="driver_availability_factor" class="block text-sm font-medium text-gray-700 mb-1">
                  Driver Availability Factor
                </label>
                <input
                  id="driver_availability_factor"
                  v-model.number="pricingForm.driverAvailabilityFactor"
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="peak_hours_multiplier" class="block text-sm font-medium text-gray-700 mb-1">
                  Peak Hours Multiplier
                </label>
                <input
                  id="peak_hours_multiplier"
                  v-model.number="pricingForm.peakHoursMultiplier"
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="updatingPricing"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {{ updatingPricing ? 'Updating...' : 'Update Pricing Configuration' }}
              </button>
            </div>
          </form>
        </div>

        <!-- AI Pricing Recommendations -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">AI Pricing Recommendations</h3>
            <button
              @click="getAIPricingRecommendations"
              :disabled="loadingRecommendations"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loadingRecommendations ? 'Analyzing...' : 'Get AI Recommendations' }}
            </button>
          </div>
          <div v-if="pricingRecommendations.length > 0" class="space-y-4">
            <div v-for="recommendation in pricingRecommendations" :key="recommendation.id" class="border rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">{{ recommendation.title }}</h4>
                  <p class="text-sm text-gray-600">{{ recommendation.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">Impact: {{ recommendation.impact }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="recommendation.priority === 'high' ? 'bg-red-100 text-red-800' : recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 text-xs rounded-full">
                    {{ recommendation.priority.toUpperCase() }}
                  </span>
                  <button
                    @click="applyRecommendation(recommendation)"
                    class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            No recommendations available. Click "Get AI Recommendations" to analyze current pricing.
          </div>
        </div>
      </div>

      <!-- Fraud Detection Tab -->
      <div v-if="activeTab === 'fraud'">
        <!-- Fraud Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-red-100">
                <AlertTriangle class="h-6 w-6 text-red-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Alerts</p>
                <p class="text-2xl font-bold text-gray-900">{{ fraudStats.activeAlerts }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100">
                <Shield class="h-6 w-6 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Flagged Users</p>
                <p class="text-2xl font-bold text-gray-900">{{ fraudStats.flaggedUsers }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-orange-100">
                <Ban class="h-6 w-6 text-orange-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Blocked Orders</p>
                <p class="text-2xl font-bold text-gray-900">{{ fraudStats.blockedOrders }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100">
                <CheckCircle class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Detection Rate</p>
                <p class="text-2xl font-bold text-gray-900">{{ fraudStats.detectionRate }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Fraud Alerts -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Recent Fraud Alerts</h3>
            <button
              @click="refreshFraudAlerts"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alert Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User/Order
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loadingFraudAlerts">
                  <td colspan="6" class="px-6 py-4 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p class="text-gray-600 mt-2">Loading fraud alerts...</p>
                  </td>
                </tr>
                <tr v-else-if="fraudAlerts.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No fraud alerts found
                  </td>
                </tr>
                <tr v-else v-for="alert in fraudAlerts" :key="alert.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <AlertTriangle :class="getRiskColor(alert.risk_level)" class="h-5 w-5 mr-2" />
                      <span class="text-sm font-medium text-gray-900">{{ formatAlertType(alert.alert_type) }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ alert.user_name || 'Unknown User' }}</div>
                    <div class="text-sm text-gray-500">{{ alert.order_number || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getRiskBadgeColor(alert.risk_level)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ alert.risk_level.toUpperCase() }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate">{{ alert.details }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDateTime(alert.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewAlertDetails(alert)"
                        class="text-green-600 hover:text-green-900"
                        title="View Details"
                      >
                        <Eye class="h-4 w-4" />
                      </button>
                      <button
                        @click="resolveAlert(alert.id)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Mark Resolved"
                      >
                        <Check class="h-4 w-4" />
                      </button>
                      <button
                        v-if="alert.risk_level === 'high'"
                        @click="blockUser(alert.user_id)"
                        class="text-red-600 hover:text-red-900"
                        title="Block User"
                      >
                        <Ban class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fraud Detection Settings -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Fraud Detection Settings</h3>
          <form @submit.prevent="updateFraudSettings">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="max_cancellations" class="block text-sm font-medium text-gray-700 mb-1">
                  Max Cancellations per Day
                </label>
                <input
                  id="max_cancellations"
                  v-model.number="fraudSettings.maxCancellations"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="max_failed_deliveries" class="block text-sm font-medium text-gray-700 mb-1">
                  Max Failed Deliveries per Week
                </label>
                <input
                  id="max_failed_deliveries"
                  v-model.number="fraudSettings.maxFailedDeliveries"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="suspicious_address_threshold" class="block text-sm font-medium text-gray-700 mb-1">
                  Suspicious Address Threshold
                </label>
                <input
                  id="suspicious_address_threshold"
                  v-model.number="fraudSettings.suspiciousAddressThreshold"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="rapid_order_threshold" class="block text-sm font-medium text-gray-700 mb-1">
                  Rapid Order Threshold (minutes)
                </label>
                <input
                  id="rapid_order_threshold"
                  v-model.number="fraudSettings.rapidOrderThreshold"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div class="mt-6 flex items-center">
              <input
                id="auto_block_high_risk"
                v-model="fraudSettings.autoBlockHighRisk"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="auto_block_high_risk" class="ml-2 block text-sm text-gray-900">
                Automatically block high-risk users
              </label>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="updatingFraudSettings"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {{ updatingFraudSettings ? 'Updating...' : 'Update Fraud Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Alert Details Modal -->
      <div v-if="selectedAlert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Fraud Alert Details</h3>
            <button @click="selectedAlert = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900">Alert Type</h4>
                <p class="text-gray-600">{{ formatAlertType(selectedAlert.alert_type) }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Risk Level</h4>
                <span :class="getRiskBadgeColor(selectedAlert.risk_level)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedAlert.risk_level.toUpperCase() }}
                </span>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Details</h4>
                <p class="text-gray-600">{{ selectedAlert.details }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">User Information</h4>
                <p class="text-gray-600">{{ selectedAlert.user_name || 'Unknown User' }}</p>
                <p class="text-sm text-gray-500">User ID: {{ selectedAlert.user_id }}</p>
              </div>
              <div v-if="selectedAlert.order_number">
                <h4 class="font-medium text-gray-900">Order Information</h4>
                <p class="text-gray-600">Order #{{ selectedAlert.order_number }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Detection Time</h4>
                <p class="text-gray-600">{{ formatDateTime(selectedAlert.created_at) }}</p>
              </div>
            </div>
            <div class="mt-6 flex space-x-2">
              <button
                @click="resolveAlert(selectedAlert.id)"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Mark as Resolved
              </button>
              <button
                v-if="selectedAlert.risk_level === 'high'"
                @click="blockUser(selectedAlert.user_id)"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Block User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  DollarSign, TrendingUp, Clock, Users, AlertTriangle, Shield, Ban, 
  CheckCircle, Eye, Check, X 
} from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { pricingAI } from '@/utils/pricingAI'
import { fraudDetection } from '@/utils/fraudDetection'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const { supabase } = useSupabase()
const toast = useToast()

const activeTab = ref('pricing')
const updatingPricing = ref(false)
const updatingFraudSettings = ref(false)
const loadingRecommendations = ref(false)
const loadingFraudAlerts = ref(false)

const pricingConfig = ref({
  baseFee: 50,
  distanceMultiplier: 15,
  timeMultiplier: 1.2,
  demandMultiplier: 1.0,
  driverAvailabilityFactor: 1.1,
  peakHoursMultiplier: 1.5
})

const pricingForm = ref({ ...pricingConfig.value })
const pricingRecommendations = ref([])

const fraudStats = ref({
  activeAlerts: 0,
  flaggedUsers: 0,
  blockedOrders: 0,
  detectionRate: 95.2
})

const fraudAlerts = ref([])
const selectedAlert = ref(null)

const fraudSettings = ref({
  maxCancellations: 3,
  maxFailedDeliveries: 5,
  suspiciousAddressThreshold: 10,
  rapidOrderThreshold: 5,
  autoBlockHighRisk: true
})

const loadPricingConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', 'pricing')

    if (error) throw error

    if (data && data.length > 0) {
      const settings = {}
      data.forEach(setting => {
        settings[setting.key] = parseFloat(setting.value)
      })
      pricingConfig.value = { ...pricingConfig.value, ...settings }
      pricingForm.value = { ...pricingConfig.value }
    }
  } catch (error) {
    console.error('Error loading pricing config:', error)
  }
}

const updatePricingConfig = async () => {
  try {
    updatingPricing.value = true

    // Update each setting
    const updates = Object.entries(pricingForm.value).map(([key, value]) => ({
      category: 'pricing',
      key,
      value: value.toString(),
      updated_at: new Date().toISOString()
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('system_settings')
        .upsert(update, { onConflict: 'category,key' })

      if (error) throw error
    }

    pricingConfig.value = { ...pricingForm.value }
    toast.success('Pricing configuration updated successfully!')
  } catch (error) {
    console.error('Error updating pricing config:', error)
    toast.error('Failed to update pricing configuration')
  } finally {
    updatingPricing.value = false
  }
}

const getAIPricingRecommendations = async () => {
  try {
    loadingRecommendations.value = true

    // Get current market data
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const { data: drivers } = await supabase
      .from('drivers')
      .select('*')
      .eq('status', 'approved')

    const marketData = {
      orders: orders || [],
      drivers: drivers || [],
      currentConfig: pricingConfig.value
    }

    const recommendations = await pricingAI.generateRecommendations(marketData)
    pricingRecommendations.value = recommendations

    toast.success('AI recommendations generated!')
  } catch (error) {
    console.error('Error getting AI recommendations:', error)
    toast.error('Failed to get AI recommendations')
  } finally {
    loadingRecommendations.value = false
  }
}

const applyRecommendation = (recommendation) => {
  // Apply the recommendation to the form
  Object.assign(pricingForm.value, recommendation.changes)
  toast.success('Recommendation applied to form. Click "Update" to save.')
}

const loadFraudStats = async () => {
  try {
    // Get active alerts count
    const { count: activeAlerts } = await supabase
      .from('fraud_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get flagged users count
    const { count: flaggedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_flagged', true)

    // Get blocked orders count (last 30 days)
    const { count: blockedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'blocked')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    fraudStats.value = {
      ...fraudStats.value,
      activeAlerts: activeAlerts || 0,
      flaggedUsers: flaggedUsers || 0,
      blockedOrders: blockedOrders || 0
    }
  } catch (error) {
    console.error('Error loading fraud stats:', error)
  }
}

const loadFraudAlerts = async () => {
  try {
    loadingFraudAlerts.value = true

    const { data, error } = await supabase
      .from('fraud_alerts')
      .select(`
        *,
        users(first_name, last_name),
        orders(order_number)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    fraudAlerts.value = (data || []).map(alert => ({
      ...alert,
      user_name: alert.users ? `${alert.users.first_name} ${alert.users.last_name}` : null,
      order_number: alert.orders?.order_number
    }))
  } catch (error) {
    console.error('Error loading fraud alerts:', error)
    toast.error('Failed to load fraud alerts')
  } finally {
    loadingFraudAlerts.value = false
  }
}

const refreshFraudAlerts = () => {
  loadFraudAlerts()
}

const loadFraudSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', 'fraud_detection')

    if (error) throw error

    if (data && data.length > 0) {
      const settings = {}
      data.forEach(setting => {
        if (setting.key === 'autoBlockHighRisk') {
          settings[setting.key] = setting.value === 'true'
        } else {
          settings[setting.key] = parseInt(setting.value)
        }
      })
      fraudSettings.value = { ...fraudSettings.value, ...settings }
    }
  } catch (error) {
    console.error('Error loading fraud settings:', error)
  }
}

const updateFraudSettings = async () => {
  try {
    updatingFraudSettings.value = true

    // Update each setting
    const updates = Object.entries(fraudSettings.value).map(([key, value]) => ({
      category: 'fraud_detection',
      key,
      value: value.toString(),
      updated_at: new Date().toISOString()
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('system_settings')
        .upsert(update, { onConflict: 'category,key' })

      if (error) throw error
    }

    toast.success('Fraud detection settings updated successfully!')
  } catch (error) {
    console.error('Error updating fraud settings:', error)
    toast.error('Failed to update fraud settings')
  } finally {
    updatingFraudSettings.value = false
  }
}

const viewAlertDetails = (alert) => {
  selectedAlert.value = alert
}

const resolveAlert = async (alertId) => {
  try {
    const { error } = await supabase
      .from('fraud_alerts')
      .update({ 
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId)

    if (error) throw error

    toast.success('Alert marked as resolved')
    await loadFraudStats()
    await loadFraudAlerts()
    if (selectedAlert.value?.id === alertId) {
      selectedAlert.value = null
    }
  } catch (error) {
    console.error('Error resolving alert:', error)
    toast.error('Failed to resolve alert')
  }
}

const blockUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'banned',
        is_flagged: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    toast.success('User has been blocked')
    await loadFraudStats()
    if (selectedAlert.value?.user_id === userId) {
      selectedAlert.value = null
    }
  } catch (error) {
    console.error('Error blocking user:', error)
    toast.error('Failed to block user')
  }
}

const formatAlertType = (type) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getRiskColor = (level) => {
  const colors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  }
  return colors[level] || 'text-gray-500'
}

const getRiskBadgeColor = (level) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
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

onMounted(async () => {
  await loadPricingConfig()
  await loadFraudStats()
  await loadFraudAlerts()
  await loadFraudSettings()
})
</script>
