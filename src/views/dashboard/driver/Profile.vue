<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Driver Profile</h1>
        <p class="text-gray-600 mt-2">Manage your profile information and documents</p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading profile...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Picture & Basic Info -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="text-center">
              <div class="relative inline-block">
                <img
                  :src="profileData.profile_picture || '/placeholder.svg?height=120&width=120'"
                  alt="Profile"
                  class="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                />
                <button
                  @click="$refs.profilePictureInput.click()"
                  class="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors"
                >
                  <Camera class="h-4 w-4" />
                </button>
                <input
                  ref="profilePictureInput"
                  type="file"
                  accept="image/*"
                  @change="handleProfilePictureUpload"
                  class="hidden"
                />
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mt-4">
                {{ profileData.first_name }} {{ profileData.last_name }}
              </h2>
              <p class="text-gray-600">{{ profileData.email }}</p>
              <div class="mt-4 flex justify-center">
                <span :class="getStatusColor(profileData.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ formatStatus(profileData.status) }}
                </span>
              </div>
            </div>

            <!-- Driver Stats -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-green-600">{{ stats.total_deliveries }}</p>
                  <p class="text-sm text-gray-600">Total Deliveries</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-600">{{ stats.rating.toFixed(1) }}</p>
                  <p class="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div class="p-6">
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="first_name"
                      v-model="profileData.first_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="last_name"
                      v-model="profileData.last_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="contact_number" class="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      id="contact_number"
                      v-model="profileData.contact_number"
                      type="tel"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      v-model="profileData.email"
                      type="email"
                      disabled
                      class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    v-model="profileData.address"
                    rows="3"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="motorcycle_plate" class="block text-sm font-medium text-gray-700 mb-2">
                      Motorcycle Plate Number *
                    </label>
                    <input
                      id="motorcycle_plate"
                      v-model="profileData.motorcycle_plate"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label for="motorcycle_model" class="block text-sm font-medium text-gray-700 mb-2">
                      Motorcycle Model
                    </label>
                    <input
                      id="motorcycle_model"
                      v-model="profileData.motorcycle_model"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="updating"
                    class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save v-if="!updating" class="h-4 w-4 mr-2" />
                    <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {{ updating ? 'Updating...' : 'Update Profile' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="bg-white rounded-lg shadow-md mt-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Documents</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- License -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Driver's License
                  </label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      ref="licenseInput"
                      type="file"
                      accept="image/*"
                      @change="handleDocumentUpload('license', $event)"
                      class="hidden"
                    />
                    <div v-if="!profileData.license_url" @click="$refs.licenseInput.click()" class="cursor-pointer">
                      <FileText class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p class="text-sm text-gray-600">Upload License</p>
                    </div>
                    <div v-else class="relative">
                      <img :src="profileData.license_url" alt="License" class="max-h-32 mx-auto rounded" />
                      <button
                        type="button"
                        @click="$refs.licenseInput.click()"
                        class="mt-2 text-sm text-green-600 hover:text-green-700"
                      >
                        Change License
                      </button>
                    </div>
                  </div>
                </div>

                <!-- ORCR -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    ORCR (Official Receipt/Certificate of Registration)
                  </label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      ref="orcrInput"
                      type="file"
                      accept="image/*"
                      @change="handleDocumentUpload('orcr', $event)"
                      class="hidden"
                    />
                    <div v-if="!profileData.orcr_url" @click="$refs.orcrInput.click()" class="cursor-pointer">
                      <FileText class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p class="text-sm text-gray-600">Upload ORCR</p>
                    </div>
                    <div v-else class="relative">
                      <img :src="profileData.orcr_url" alt="ORCR" class="max-h-32 mx-auto rounded" />
                      <button
                        type="button"
                        @click="$refs.orcrInput.click()"
                        class="mt-2 text-sm text-green-600 hover:text-green-700"
                      >
                        Change ORCR
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Selfie with ID -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Selfie with ID
                  </label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      ref="selfieInput"
                      type="file"
                      accept="image/*"
                      @change="handleDocumentUpload('selfie', $event)"
                      class="hidden"
                    />
                    <div v-if="!profileData.selfie_with_id_url" @click="$refs.selfieInput.click()" class="cursor-pointer">
                      <Camera class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p class="text-sm text-gray-600">Upload Selfie with ID</p>
                    </div>
                    <div v-else class="relative">
                      <img :src="profileData.selfie_with_id_url" alt="Selfie with ID" class="max-h-32 mx-auto rounded" />
                      <button
                        type="button"
                        @click="$refs.selfieInput.click()"
                        class="mt-2 text-sm text-green-600 hover:text-green-700"
                      >
                        Change Selfie
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Camera, Save, FileText } from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'

const { supabase } = useSupabase()
const { user } = useAuth()
const toast = useToast()

const loading = ref(true)
const updating = ref(false)
const profileData = ref({
  first_name: '',
  last_name: '',
  email: '',
  contact_number: '',
  address: '',
  motorcycle_plate: '',
  motorcycle_model: '',
  profile_picture: '',
  license_url: '',
  orcr_url: '',
  selfie_with_id_url: '',
  status: 'pending'
})

const stats = ref({
  total_deliveries: 0,
  rating: 0
})

const fetchProfile = async () => {
  try {
    loading.value = true
    
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) throw error

    if (data) {
      profileData.value = { ...data }
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    toast.error('Failed to load profile')
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    // Get total deliveries
    const { count: deliveries } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('driver_id', user.value.id)
      .eq('status', 'delivered')

    // Get average rating
    const { data: ratings } = await supabase
      .from('driver_ratings')
      .select('rating')
      .eq('driver_id', user.value.id)

    const avgRating = ratings?.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0

    stats.value = {
      total_deliveries: deliveries || 0,
      rating: avgRating
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const updateProfile = async () => {
  try {
    updating.value = true

    const { error } = await supabase
      .from('drivers')
      .update({
        first_name: profileData.value.first_name,
        last_name: profileData.value.last_name,
        contact_number: profileData.value.contact_number,
        address: profileData.value.address,
        motorcycle_plate: profileData.value.motorcycle_plate,
        motorcycle_model: profileData.value.motorcycle_model,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.value.id)

    if (error) throw error

    toast.success('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('Failed to update profile')
  } finally {
    updating.value = false
  }
}

const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await uploadFile(file, 'profile_picture', 'profile-pictures')
  }
}

const handleDocumentUpload = async (type, event) => {
  const file = event.target.files[0]
  if (file) {
    const folder = type === 'license' ? 'licenses' : type === 'orcr' ? 'orcr' : 'selfies'
    const field = type === 'license' ? 'license_url' : type === 'orcr' ? 'orcr_url' : 'selfie_with_id_url'
    await uploadFile(file, field, folder)
  }
}

const uploadFile = async (file, field, folder) => {
  try {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.value.id}-${Date.now()}.${fileExt}`
    
    const { data, error: uploadError } = await supabase.storage
      .from('driver-documents')
      .upload(`${folder}/${fileName}`, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('driver-documents')
      .getPublicUrl(`${folder}/${fileName}`)

    // Update profile data
    profileData.value[field] = publicUrl

    // Update database
    const { error: updateError } = await supabase
      .from('drivers')
      .update({ [field]: publicUrl })
      .eq('id', user.value.id)

    if (updateError) throw updateError

    toast.success('File uploaded successfully!')
  } catch (error) {
    console.error('Error uploading file:', error)
    toast.error('Failed to upload file')
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
    rejected: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  await fetchProfile()
  await fetchStats()
})
</script>
