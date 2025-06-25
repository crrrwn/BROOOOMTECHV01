<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-gray-900">Upload Payment Proof</h1>
          <p class="mt-1 text-sm text-gray-600">Upload proof of payment for your pending orders</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Pending Orders -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading pending orders...</p>
      </div>

      <div v-else-if="pendingOrders.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">💳</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No pending payments</h3>
        <p class="text-gray-600 mb-6">You don't have any orders waiting for payment proof.</p>
        <router-link
          to="/dashboard/user/book-service"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Book a Service
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in pendingOrders"
          :key="order.id"
          class="bg-white rounded-lg shadow-sm border"
        >
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">
                    Order #{{ order.order_number }}
                  </h3>
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Pending Payment
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <p><span class="font-medium">Service:</span> {{ formatServiceType(order.service_type) }}</p>
                    <p><span class="font-medium">Date:</span> {{ formatDate(order.created_at) }}</p>
                  </div>
                  <div>
                    <p><span class="font-medium">Total:</span> ₱{{ order.total_amount }}</p>
                    <p><span class="font-medium">Payment Method:</span> {{ order.payment_method }}</p>
                  </div>
                </div>

                <!-- Payment QR Code -->
                <div v-if="order.payment_method !== 'COD'" class="mb-6">
                  <h4 class="font-medium text-gray-900 mb-3">Payment QR Code</h4>
                  <div class="bg-gray-50 rounded-lg p-4 text-center max-w-xs">
                    <div class="w-48 h-48 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border">
                      <img
                        :src="getPaymentQR(order.payment_method)"
                        :alt="`${order.payment_method} QR Code`"
                        class="w-40 h-40 object-contain"
                      />
                    </div>
                    <p class="text-sm text-gray-600">
                      Scan this QR code with your {{ order.payment_method }} app
                    </p>
                    <p class="text-lg font-semibold text-green-600 mt-2">
                      ₱{{ order.total_amount }}
                    </p>
                  </div>
                </div>

                <!-- Upload Section -->
                <div class="border-t pt-6">
                  <h4 class="font-medium text-gray-900 mb-3">Upload Payment Proof</h4>
                  
                  <div v-if="!order.payment_proof" class="space-y-4">
                    <div
                      @drop="handleDrop($event, order.id)"
                      @dragover.prevent
                      @dragenter.prevent
                      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors"
                    >
                      <input
                        :id="`file-${order.id}`"
                        type="file"
                        accept="image/*,.pdf"
                        @change="handleFileSelect($event, order.id)"
                        class="hidden"
                      />
                      <label
                        :for="`file-${order.id}`"
                        class="cursor-pointer"
                      >
                        <div class="text-gray-400 text-4xl mb-2">📎</div>
                        <p class="text-gray-600 mb-2">
                          Drop your payment proof here or click to browse
                        </p>
                        <p class="text-sm text-gray-500">
                          Supports: JPG, PNG, PDF (Max 5MB)
                        </p>
                      </label>
                    </div>

                    <!-- File Preview -->
                    <div v-if="uploadPreviews[order.id]" class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="font-medium text-gray-900">{{ uploadPreviews[order.id].name }}</p>
                            <p class="text-sm text-gray-500">{{ formatFileSize(uploadPreviews[order.id].size) }}</p>
                          </div>
                        </div>
                        <button
                          @click="removeFile(order.id)"
                          class="text-red-500 hover:text-red-700"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button
                      v-if="uploadPreviews[order.id]"
                      @click="uploadPaymentProof(order)"
                      :disabled="uploading[order.id]"
                      class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span v-if="uploading[order.id]" class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </span>
                      <span v-else>Upload Payment Proof</span>
                    </button>
                  </div>

                  <!-- Already Uploaded -->
                  <div v-else class="bg-green-50 rounded-lg p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-green-800">
                          Payment proof uploaded successfully
                        </p>
                        <p class="text-sm text-green-600">
                          Your payment is being reviewed by our admin team.
                        </p>
                      </div>
                    </div>
                    
                    <div class="mt-3">
                      <button
                        @click="viewPaymentProof(order.payment_proof)"
                        class="text-sm text-green-600 hover:text-green-800 underline"
                      >
                        View uploaded proof
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
        <div class="space-y-2 text-sm text-blue-800">
          <p>• Make sure your payment proof is clear and readable</p>
          <p>• Include the transaction reference number if available</p>
          <p>• Supported formats: JPG, PNG, PDF (Maximum 5MB)</p>
          <p>• Your order will be approved once payment is verified</p>
        </div>
        <div class="mt-4">
          <p class="text-sm text-blue-700">
            Having issues? Contact our support team at 
            <a href="mailto:support@broomtech.com" class="underline">support@broomtech.com</a>
          </p>
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
          alt="Payment proof"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'

const { supabase } = useSupabase()
const { user } = useAuth()
const toast = useToast()

// Data
const orders = ref([])
const loading = ref(true)
const uploadPreviews = ref({})
const uploading = ref({})
const selectedImage = ref(null)

// Computed
const pendingOrders = computed(() => {
  return orders.value.filter(order => 
    order.status === 'pending' && 
    order.payment_method !== 'COD'
  )
})

// Methods
const fetchPendingOrders = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('status', 'pending')
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

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getPaymentQR = (paymentMethod) => {
  // In a real app, these would be actual QR codes for each payment method
  const qrCodes = {
    'GCash': '/images/gcash-qr.png',
    'PayMaya': '/images/paymaya-qr.png',
    'GoTyme': '/images/gotyme-qr.png'
  }
  return qrCodes[paymentMethod] || '/images/default-qr.png'
}

const handleFileSelect = (event, orderId) => {
  const file = event.target.files[0]
  if (file) {
    validateAndPreviewFile(file, orderId)
  }
}

const handleDrop = (event, orderId) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndPreviewFile(file, orderId)
  }
}

const validateAndPreviewFile = (file, orderId) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Please upload a valid image (JPG, PNG) or PDF file')
    return
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB')
    return
  }

  uploadPreviews.value[orderId] = file
}

const removeFile = (orderId) => {
  delete uploadPreviews.value[orderId]
}

const uploadPaymentProof = async (order) => {
  const file = uploadPreviews.value[order.id]
  if (!file) return

  try {
    uploading.value[order.id] = true

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `payment-proof-${order.id}-${Date.now()}.${fileExt}`
    const filePath = `payment-proofs/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('order-files')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('order-files')
      .getPublicUrl(filePath)

    // Update order with payment proof
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        payment_proof: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    if (updateError) throw updateError

    toast.success('Payment proof uploaded successfully!')
    
    // Update local data
    const orderIndex = orders.value.findIndex(o => o.id === order.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex].payment_proof = urlData.publicUrl
    }

    // Clear preview
    delete uploadPreviews.value[order.id]

  } catch (error) {
    console.error('Error uploading payment proof:', error)
    toast.error('Failed to upload payment proof')
  } finally {
    uploading.value[order.id] = false
  }
}

const viewPaymentProof = (proofUrl) => {
  selectedImage.value = proofUrl
}

const closeImageViewer = () => {
  selectedImage.value = null
}

// Lifecycle
onMounted(() => {
  fetchPendingOrders()
})
</script>
