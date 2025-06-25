<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-800">Book Service</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar :isOpen="sidebarOpen" @close="closeSidebar" />

      <!-- Main Content -->
      <div class="flex-1 lg:ml-64">
        <div class="p-4 lg:p-8">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
            <p class="text-gray-600">Choose from our wide range of delivery services</p>
          </div>

          <!-- Step Indicator -->
          <div class="mb-8">
            <div class="flex items-center justify-center">
              <div class="flex items-center">
                <div class="flex items-center text-primary-600">
                  <div class="flex items-center justify-center w-8 h-8 border-2 border-primary-600 rounded-full bg-primary-600 text-white text-sm font-medium">
                    1
                  </div>
                  <span class="ml-2 text-sm font-medium">Select Service</span>
                </div>
                <div class="flex-1 h-0.5 mx-4" :class="currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'"></div>
                <div class="flex items-center" :class="currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'">
                  <div class="flex items-center justify-center w-8 h-8 border-2 rounded-full text-sm font-medium" 
                       :class="currentStep >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'">
                    2
                  </div>
                  <span class="ml-2 text-sm font-medium">Service Details</span>
                </div>
                <div class="flex-1 h-0.5 mx-4" :class="currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-300'"></div>
                <div class="flex items-center" :class="currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'">
                  <div class="flex items-center justify-center w-8 h-8 border-2 rounded-full text-sm font-medium"
                       :class="currentStep >= 3 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'">
                    3
                  </div>
                  <span class="ml-2 text-sm font-medium">Payment</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 1: Service Selection -->
          <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Choose Your Service</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="service in services"
                :key="service.id"
                @click="selectService(service)"
                class="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                :class="{ 'border-primary-500 bg-primary-50': selectedService?.id === service.id }"
              >
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 rounded-lg flex items-center justify-center mb-4" :class="service.iconBg">
                    <svg class="w-8 h-8" :class="service.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.iconPath"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ service.name }}</h3>
                  <p class="text-sm text-gray-600 mb-4">{{ service.description }}</p>
                  <div class="text-primary-600 font-semibold">Starting at ₱{{ service.basePrice }}</div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end mt-8">
              <button
                @click="nextStep"
                :disabled="!selectedService"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': !selectedService }"
              >
                Continue
              </button>
            </div>
          </div>

          <!-- Step 2: Service Details -->
          <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Service Details</h2>
              <button @click="previousStep" class="btn-secondary">Back</button>
            </div>

            <form @submit.prevent="nextStep" class="space-y-6">
              <!-- Service Type Display -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4" :class="selectedService?.iconBg">
                    <svg class="w-6 h-6" :class="selectedService?.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="selectedService?.iconPath"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ selectedService?.name }}</h3>
                    <p class="text-sm text-gray-600">{{ selectedService?.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Dynamic Form Fields -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Pickup Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                  <div class="relative">
                    <input
                      v-model="orderForm.pickupAddress"
                      type="text"
                      required
                      placeholder="Enter pickup address"
                      class="input-field pr-10"
                      @focus="initializeMap('pickup')"
                    />
                    <button
                      type="button"
                      @click="getCurrentLocation('pickup')"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg class="w-5 h-5 text-gray-400 hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Delivery Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <div class="relative">
                    <input
                      v-model="orderForm.deliveryAddress"
                      type="text"
                      required
                      placeholder="Enter delivery address"
                      class="input-field pr-10"
                      @focus="initializeMap('delivery')"
                    />
                    <button
                      type="button"
                      @click="getCurrentLocation('delivery')"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg class="w-5 h-5 text-gray-400 hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Map Container -->
              <div v-if="showMap" class="h-64 bg-gray-200 rounded-lg">
                <div id="booking-map" class="w-full h-full rounded-lg"></div>
              </div>

              <!-- Service-Specific Fields -->
              <div v-if="selectedService?.id === 'food_delivery'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant/Food Details</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="3"
                  placeholder="Specify restaurant name, food items, special instructions..."
                  class="input-field"
                ></textarea>
              </div>

              <div v-if="selectedService?.id === 'grocery'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Grocery List</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="4"
                  placeholder="List all items you need (e.g., 1kg rice, 2 bottles cooking oil, vegetables...)"
                  class="input-field"
                ></textarea>
              </div>

              <div v-if="selectedService?.id === 'pay_bills'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bill Type</label>
                    <select v-model="orderForm.billType" class="input-field">
                      <option value="">Select bill type</option>
                      <option value="electricity">Electricity</option>
                      <option value="water">Water</option>
                      <option value="internet">Internet</option>
                      <option value="phone">Phone</option>
                      <option value="government">Government Fees</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      v-model="orderForm.accountNumber"
                      type="text"
                      placeholder="Enter account number"
                      class="input-field"
                    />
                  </div>
                </div>
              </div>

              <div v-if="selectedService?.id === 'medicines'">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Medicine Details</label>
                    <textarea
                      v-model="orderForm.itemsDescription"
                      rows="3"
                      placeholder="List medicines needed, pharmacy name, special instructions..."
                      class="input-field"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Prescription Upload (if required)</label>
                    <FileUploader
                      accept="image/*,.pdf"
                      :multiple="false"
                      bucket="prescriptions"
                      folder="user-prescriptions"
                      @uploaded="handlePrescriptionUpload"
                      @error="handleUploadError"
                    />
                  </div>
                </div>
              </div>

              <!-- Special Instructions -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  v-model="orderForm.specialInstructions"
                  rows="3"
                  placeholder="Any special instructions for the driver..."
                  class="input-field"
                ></textarea>
              </div>

              <!-- Image Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Additional Images (Optional)</label>
                <FileUploader
                  accept="image/*"
                  :multiple="true"
                  bucket="order-images"
                  folder="user-uploads"
                  @uploaded="handleImageUpload"
                  @error="handleUploadError"
                />
              </div>

              <!-- Pricing Display -->
              <div v-if="pricingCalculated" class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Pricing Breakdown</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Base Fee:</span>
                    <span>₱{{ pricing.baseFee }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Delivery Fee ({{ distance.toFixed(1) }} km):</span>
                    <span>₱{{ pricing.deliveryFee }}</span>
                  </div>
                  <div v-if="pricing.factors.isPeakHour" class="flex justify-between text-orange-600">
                    <span>Peak Hour Surcharge:</span>
                    <span>+20%</span>
                  </div>
                  <div class="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₱{{ pricing.totalAmount }}</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-between">
                <button type="button" @click="previousStep" class="btn-secondary">Back</button>
                <button
                  type="submit"
                  :disabled="!orderForm.pickupAddress || !orderForm.deliveryAddress || calculating"
                  class="btn-primary"
                >
                  {{ calculating ? 'Calculating...' : 'Continue to Payment' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: Payment -->
          <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Payment Method</h2>
              <button @click="previousStep" class="btn-secondary">Back</button>
            </div>

            <!-- Order Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Service:</span>
                  <span class="font-medium">{{ selectedService?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span>From:</span>
                  <span class="text-sm">{{ orderForm.pickupAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span>To:</span>
                  <span class="text-sm">{{ orderForm.deliveryAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Distance:</span>
                  <span>{{ distance.toFixed(1) }} km</span>
                </div>
                <div class="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span class="text-primary-600">₱{{ pricing.totalAmount }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
              
              <!-- GCash -->
              <div class="border border-gray-200 rounded-lg p-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="orderForm.paymentMethod"
                    type="radio"
                    value="gcash"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="ml-3 flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                      <span class="text-xs font-bold text-blue-600">G</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-900">GCash</span>
                      <p class="text-xs text-gray-500">Pay via GCash QR Code</p>
                    </div>
                  </div>
                </label>
                <div v-if="orderForm.paymentMethod === 'gcash'" class="mt-4 pl-7">
                  <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div class="w-48 h-48 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-32 h-32 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <span class="text-white font-bold text-lg">GCash</span>
                        </div>
                        <p class="text-xs text-gray-500">QR Code will appear here</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">Scan QR code with GCash app</p>
                    <p class="text-xs text-gray-500 mt-1">Amount: ₱{{ pricing.totalAmount }}</p>
                  </div>
                </div>
              </div>

              <!-- PayMaya -->
              <div class="border border-gray-200 rounded-lg p-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="orderForm.paymentMethod"
                    type="radio"
                    value="paymaya"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="ml-3 flex items-center">
                    <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                      <span class="text-xs font-bold text-green-600">PM</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-900">PayMaya</span>
                      <p class="text-xs text-gray-500">Pay via PayMaya QR Code</p>
                    </div>
                  </div>
                </label>
                <div v-if="orderForm.paymentMethod === 'paymaya'" class="mt-4 pl-7">
                  <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div class="w-48 h-48 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-32 h-32 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <span class="text-white font-bold text-lg">PayMaya</span>
                        </div>
                        <p class="text-xs text-gray-500">QR Code will appear here</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">Scan QR code with PayMaya app</p>
                    <p class="text-xs text-gray-500 mt-1">Amount: ₱{{ pricing.totalAmount }}</p>
                  </div>
                </div>
              </div>

              <!-- GoTyme -->
              <div class="border border-gray-200 rounded-lg p-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="orderForm.paymentMethod"
                    type="radio"
                    value="gotyme"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="ml-3 flex items-center">
                    <div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
                      <span class="text-xs font-bold text-purple-600">GT</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-900">GoTyme</span>
                      <p class="text-xs text-gray-500">Pay via GoTyme Bank QR Code</p>
                    </div>
                  </div>
                </label>
                <div v-if="orderForm.paymentMethod === 'gotyme'" class="mt-4 pl-7">
                  <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div class="w-48 h-48 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <div class="w-32 h-32 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <span class="text-white font-bold text-lg">GoTyme</span>
                        </div>
                        <p class="text-xs text-gray-500">QR Code will appear here</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">Scan QR code with GoTyme app</p>
                    <p class="text-xs text-gray-500 mt-1">Amount: ₱{{ pricing.totalAmount }}</p>
                  </div>
                </div>
              </div>

              <!-- Cash on Delivery -->
              <div class="border border-gray-200 rounded-lg p-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="orderForm.paymentMethod"
                    type="radio"
                    value="cod"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="ml-3 flex items-center">
                    <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-900">Cash on Delivery</span>
                      <p class="text-xs text-gray-500">Pay when your order is delivered</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Payment Proof Upload -->
            <div v-if="orderForm.paymentMethod && orderForm.paymentMethod !== 'cod'" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Upload Payment Proof</label>
              <FileUploader
                accept="image/*,.pdf"
                :multiple="false"
                bucket="payment-proofs"
                folder="user-payments"
                @uploaded="handlePaymentProofUpload"
                @error="handleUploadError"
              />
              <p class="mt-1 text-xs text-gray-500">Upload screenshot or receipt of your payment</p>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-center mb-6">
              <input
                id="agreeTerms"
                v-model="orderForm.agreeTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="agreeTerms" class="ml-2 block text-sm text-gray-900">
                I agree to the
                <a href="#" class="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
                and understand that my order will be reviewed before assignment.
              </label>
            </div>

            <div class="flex justify-between">
              <button type="button" @click="previousStep" class="btn-secondary">Back</button>
              <button
                @click="submitOrder"
                :disabled="!orderForm.paymentMethod || !orderForm.agreeTerms || submitting"
                class="btn-primary"
              >
                <div v-if="submitting" class="spinner mr-2"></div>
                {{ submitting ? 'Placing Order...' : 'Place Order' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useMap } from '@/composables/useMap'
import { useDynamicPricing } from '@/composables/useDynamicPricing'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'
import FileUploader from '@/components/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { userProfile } = useAuth()
const { select, insert } = useSupabase()
const { initializeMap, addMarker, calculateDistance, geocodeAddress, getCurrentLocation: getLocation } = useMap()
const { calculateDeliveryFee } = useDynamicPricing()

const sidebarOpen = ref(false)
const currentStep = ref(1)
const showMap = ref(false)
const calculating = ref(false)
const submitting = ref(false)
const pricingCalculated = ref(false)
const distance = ref(0)

const selectedService = ref(null)
const services = ref([])
const uploadedImages = ref([])
const prescriptionUrl = ref('')
const paymentProofUrl = ref('')

const orderForm = reactive({
  pickupAddress: '',
  deliveryAddress: '',
  pickupLat: null,
  pickupLng: null,
  deliveryLat: null,
  deliveryLng: null,
  itemsDescription: '',
  specialInstructions: '',
  billType: '',
  accountNumber: '',
  paymentMethod: '',
  agreeTerms: false
})

const pricing = reactive({
  baseFee: 0,
  deliveryFee: 0,
  totalAmount: 0,
  factors: {}
})

const toggleSidebar = () => {
  sidebarOpen.value = true
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const loadServices = async () => {
  try {
    const { data, error } = await select('service_categories', '*').eq('is_active', true)
    if (error) throw error

    services.value = data.map(service => ({
      id: service.name.toLowerCase().replace(' ', '_'),
      name: service.name,
      description: service.description,
      basePrice: getBasePrice(service.name),
      iconBg: getIconBg(service.name),
      iconColor: getIconColor(service.name),
      iconPath: getIconPath(service.name)
    }))

    // Pre-select service if specified in query
    if (route.query.service) {
      const preSelected = services.value.find(s => s.id === route.query.service)
      if (preSelected) {
        selectedService.value = preSelected
      }
    }
  } catch (error) {
    console.error('Error loading services:', error)
    toast.error('Failed to load services')
  }
}

const getBasePrice = (serviceName) => {
  const prices = {
    'Food Delivery': 50,
    'Pay Bills': 40,
    'Pick-up': 55,
    'Surprise Delivery': 65,
    'Medicines': 60,
    'Grocery': 70,
    'Pabili': 55
  }
  return prices[serviceName] || 50
}

const getIconBg = (serviceName) => {
  const backgrounds = {
    'Food Delivery': 'bg-orange-100',
    'Pay Bills': 'bg-blue-100',
    'Pick-up': 'bg-purple-100',
    'Surprise Delivery': 'bg-pink-100',
    'Medicines': 'bg-red-100',
    'Grocery': 'bg-green-100',
    'Pabili': 'bg-yellow-100'
  }
  return backgrounds[serviceName] || 'bg-gray-100'
}

const getIconColor = (serviceName) => {
  const colors = {
    'Food Delivery': 'text-orange-600',
    'Pay Bills': 'text-blue-600',
    'Pick-up': 'text-purple-600',
    'Surprise Delivery': 'text-pink-600',
    'Medicines': 'text-red-600',
    'Grocery': 'text-green-600',
    'Pabili': 'text-yellow-600'
  }
  return colors[serviceName] || 'text-gray-600'
}

const getIconPath = (serviceName) => {
  const paths = {
    'Food Delivery': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    'Pay Bills': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Pick-up': 'M5 8h14l-1 9H6L5 8zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v2',
    'Surprise Delivery': 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    'Medicines': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    'Grocery': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    'Pabili': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  }
  return paths[serviceName] || 'M12 6v6m0 0v6m0-6h6m-6 0H6'
}

const selectService = (service) => {
  selectedService.value = service
}

const nextStep = async () => {
  if (currentStep.value === 1 && selectedService.value) {
    currentStep.value = 2
  } else if (currentStep.value === 2) {
    await calculatePricing()
    if (pricingCalculated.value) {
      currentStep.value = 3
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const calculatePricing = async () => {
  if (!orderForm.pickupAddress || !orderForm.deliveryAddress) {
    toast.error('Please enter both pickup and delivery addresses')
    return
  }

  calculating.value = true
  try {
    // Geocode addresses if coordinates not available
    if (!orderForm.pickupLat || !orderForm.deliveryLat) {
      const pickupCoords = await geocodeAddress(orderForm.pickupAddress)
      const deliveryCoords = await geocodeAddress(orderForm.deliveryAddress)
      
      orderForm.pickupLat = pickupCoords.lat
      orderForm.pickupLng = pickupCoords.lng
      orderForm.deliveryLat = deliveryCoords.lat
      orderForm.deliveryLng = deliveryCoords.lng
    }

    // Calculate distance
    const distanceResult = await calculateDistance(
      { lat: orderForm.pickupLat, lng: orderForm.pickupLng },
      { lat: orderForm.deliveryLat, lng: orderForm.deliveryLng }
    )

    distance.value = distanceResult.distance.value / 1000 // Convert to km

    // Calculate pricing
    const pricingResult = await calculateDeliveryFee(
      distance.value,
      selectedService.value.id,
      new Date()
    )

    Object.assign(pricing, pricingResult)
    pricingCalculated.value = true

  } catch (error) {
    console.error('Error calculating pricing:', error)
    toast.error('Failed to calculate pricing. Please try again.')
  } finally {
    calculating.value = false
  }
}

const getCurrentLocation = async (type) => {
  try {
    const location = await getLocation()
    const address = await geocodeAddress(`${location.lat},${location.lng}`)
    
    if (type === 'pickup') {
      orderForm.pickupAddress = address.formatted_address
      orderForm.pickupLat = location.lat
      orderForm.pickupLng = location.lng
    } else {
      orderForm.deliveryAddress = address.formatted_address
      orderForm.deliveryLat = location.lat
      orderForm.deliveryLng = location.lng
    }
  } catch (error) {
    toast.error('Unable to get current location')
  }
}

const handleImageUpload = (files) => {
  uploadedImages.value = [...uploadedImages.value, ...files]
  toast.success(`${files.length} image(s) uploaded successfully`)
}

const handlePrescriptionUpload = (files) => {
  prescriptionUrl.value = files[0].url
  toast.success('Prescription uploaded successfully')
}

const handlePaymentProofUpload = (files) => {
  paymentProofUrl.value = files[0].url
  toast.success('Payment proof uploaded successfully')
}

const handleUploadError = (error) => {
  toast.error('Upload failed: ' + error.message)
}

const submitOrder = async () => {
  if (!orderForm.paymentMethod || !orderForm.agreeTerms) {
    toast.error('Please complete all required fields')
    return
  }

  if (orderForm.paymentMethod !== 'cod' && !paymentProofUrl.value) {
    toast.error('Please upload payment proof')
    return
  }

  submitting.value = true
  try {
    const orderData = {
      user_id: userProfile.value.id,
      service_category_id: selectedService.value.id,
      service_type: selectedService.value.id,
      pickup_address: orderForm.pickupAddress,
      pickup_lat: orderForm.pickupLat,
      pickup_lng: orderForm.pickupLng,
      delivery_address: orderForm.deliveryAddress,
      delivery_lat: orderForm.deliveryLat,
      delivery_lng: orderForm.deliveryLng,
      items_description: orderForm.itemsDescription,
      special_instructions: orderForm.specialInstructions,
      images_urls: uploadedImages.value.map(img => img.url),
      base_fee: pricing.baseFee,
      delivery_fee: pricing.deliveryFee,
      total_amount: pricing.totalAmount,
      payment_method: orderForm.paymentMethod,
      payment_proof_url: paymentProofUrl.value,
      payment_status: orderForm.paymentMethod === 'cod' ? 'approved' : 'pending',
      status: 'placed'
    }

    const { data, error } = await insert('orders', orderData)
    if (error) throw error

    toast.success('Order placed successfully!')
    router.push('/dashboard/user/my-orders')

  } catch (error) {
    console.error('Error submitting order:', error)
    toast.error('Failed to place order. Please try again.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadServices()
})

// Watch for address changes to trigger map updates
watch([() => orderForm.pickupAddress, () => orderForm.deliveryAddress], () => {
  if (orderForm.pickupAddress && orderForm.deliveryAddress) {
    showMap.value = true
  }
})
</script>
