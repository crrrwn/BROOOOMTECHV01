<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center">
          <button
            @click="goBack"
            class="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft class="h-6 w-6" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Proof of Delivery</h1>
            <p class="text-gray-600 mt-2">Upload delivery confirmation for Order #{{ order?.order_number }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading order details...</p>
      </div>

      <div v-else-if="!order" class="text-center py-8">
        <Package class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 text-lg">Order not found</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Order Details -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Order Details</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-gray-900 mb-2">Order Information</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span class="font-medium">Order Number:</span> {{ order.order_number }}</p>
                  <p><span class="font-medium">Service Type:</span> {{ formatServiceType(order.service_type) }}</p>
                  <p><span class="font-medium">Status:</span> 
                    <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded text-sm">
                      {{ formatStatus(order.status) }}
                    </span>
                  </p>
                  <p><span class="font-medium">Delivery Fee:</span> ₱{{ order.delivery_fee }}</p>
                </div>
              </div>

              <div>
                <h3 class="font-medium text-gray-900 mb-2">Customer Information</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span class="font-medium">Name:</span> {{ order.customer_name }}</p>
                  <p><span class="font-medium">Contact:</span> {{ order.customer_contact }}</p>
                </div>
              </div>

              <div>
                <h3 class="font-medium text-gray-900 mb-2">Delivery Information</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span class="font-medium">Pickup Address:</span></p>
                  <p class="text-sm text-gray-600">{{ order.pickup_address }}</p>
                  <p><span class="font-medium">Delivery Address:</span></p>
                  <p class="text-sm text-gray-600">{{ order.delivery_address }}</p>
                </div>
              </div>

              <div v-if="order.items_description">
                <h3 class="font-medium text-gray-900 mb-2">Items Description</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">{{ order.items_description }}</p>
                </div>
              </div>

              <div v-if="order.special_instructions">
                <h3 class="font-medium text-gray-900 mb-2">Special Instructions</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">{{ order.special_instructions }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Proof of Delivery Form -->
        <div class="bg-white rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Upload Proof of Delivery</h2>
          </div>
          <div class="p-6">
            <form @submit.prevent="submitProof" class="space-y-6">
              <!-- Photo Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Photo *
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    ref="photoInput"
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    class="hidden"
                  />
                  <div v-if="!photoPreview" @click="$refs.photoInput.click()" class="cursor-pointer">
                    <Camera class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-600">Click to upload delivery photo</p>
                    <p class="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                  <div v-else class="relative">
                    <img :src="photoPreview" alt="Delivery photo" class="max-h-48 mx-auto rounded-lg" />
                    <button
                      type="button"
                      @click="removePhoto"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Recipient Name -->
              <div>
                <label for="recipient_name" class="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  id="recipient_name"
                  v-model="proofData.recipient_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter recipient's name"
                />
              </div>

              <!-- Delivery Notes -->
              <div>
                <label for="delivery_notes" class="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Notes
                </label>
                <textarea
                  id="delivery_notes"
                  v-model="proofData.delivery_notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any additional notes about the delivery..."
                ></textarea>
              </div>

              <!-- Delivery Time -->
              <div>
                <label for="delivery_time" class="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time *
                </label>
                <input
                  id="delivery_time"
                  v-model="proofData.delivery_time"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  @click="goBack"
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting || !photoFile || !proofData.recipient_name"
                  class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Upload v-if="!submitting" class="h-4 w-4 mr-2" />
                  <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ submitting ? 'Uploading...' : 'Submit Proof' }}
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Camera, X, Upload, Package } from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()
const { user } = useAuth()
const toast = useToast()

const loading = ref(true)
const submitting = ref(false)
const order = ref(null)
const photoFile = ref(null)
const photoPreview = ref(null)
const photoInput = ref(null)

const proofData = ref({
  recipient_name: '',
  delivery_notes: '',
  delivery_time: new Date().toISOString().slice(0, 16)
})

const orderId = computed(() => route.params.id)

const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  await fetchOrder()
})

const fetchOrder = async () => {
  try {
    loading.value = true
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey(first_name, last_name, contact_number)
      `)
      .eq('id', orderId.value)
      .eq('driver_id', user.value.id)
      .single()

    if (error) throw error

    if (data) {
      order.value = {
        ...data,
        customer_name: `${data.users.first_name} ${data.users.last_name}`,
        customer_contact: data.users.contact_number
      }
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    toast.error('Failed to load order details')
  } finally {
    loading.value = false
  }
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  photoFile.value = null
  photoPreview.value = null
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

const submitProof = async () => {
  try {
    submitting.value = true

    // Upload photo to Supabase Storage
    const fileExt = photoFile.value.name.split('.').pop()
    const fileName = `proof-${orderId.value}-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('delivery-proofs')
      .upload(fileName, photoFile.value)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('delivery-proofs')
      .getPublicUrl(fileName)

    // Update order with proof of delivery
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'delivered',
        proof_of_delivery_photo: publicUrl,
        recipient_name: proofData.value.recipient_name,
        delivery_notes: proofData.value.delivery_notes,
        delivered_at: proofData.value.delivery_time,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId.value)

    if (updateError) throw updateError

    // Create delivery log
    await supabase
      .from('delivery_logs')
      .insert({
        order_id: orderId.value,
        driver_id: user.value.id,
        action: 'delivered',
        notes: proofData.value.delivery_notes,
        photo_url: publicUrl,
        created_at: new Date().toISOString()
      })

    toast.success('Proof of delivery uploaded successfully!')
    router.push('/driver/assignments')
  } catch (error) {
    console.error('Error submitting proof:', error)
    toast.error('Failed to submit proof of delivery')
  } finally {
    submitting.value = false
  }
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
</script>
