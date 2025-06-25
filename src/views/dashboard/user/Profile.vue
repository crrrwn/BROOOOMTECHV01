<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p class="mt-1 text-sm text-gray-600">Manage your account information and preferences</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Profile Picture Section -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
          
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img
                  v-if="profileData.profile_picture"
                  :src="profileData.profile_picture"
                  alt="Profile picture"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-semibold"
                >
                  {{ getInitials() }}
                </div>
              </div>
              
              <label
                for="profile-picture"
                class="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 cursor-pointer hover:bg-green-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </label>
              
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                @change="handleProfilePictureChange"
                class="hidden"
              />
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ profileData.first_name }} {{ profileData.last_name }}
              </h3>
              <p class="text-sm text-gray-600">{{ profileData.email }}</p>
              <p class="text-sm text-gray-500 mt-1">
                Member since {{ formatDate(profileData.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
            <button
              @click="editingPersonal = !editingPersonal"
              class="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              {{ editingPersonal ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <form @submit.prevent="updatePersonalInfo" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  v-model="personalForm.first_name"
                  type="text"
                  :disabled="!editingPersonal"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  v-model="personalForm.last_name"
                  type="text"
                  :disabled="!editingPersonal"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  v-model="personalForm.middle_name"
                  type="text"
                  :disabled="!editingPersonal"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  v-model="personalForm.contact_number"
                  type="tel"
                  :disabled="!editingPersonal"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                v-model="personalForm.address"
                :disabled="!editingPersonal"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                required
              ></textarea>
            </div>

            <div v-if="editingPersonal" class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelPersonalEdit"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updatingPersonal"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="updatingPersonal" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Security Settings -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b">
              <div>
                <h3 class="font-medium text-gray-900">Email Address</h3>
                <p class="text-sm text-gray-600">{{ profileData.email }}</p>
              </div>
              <span class="text-sm text-green-600 font-medium">Verified</span>
            </div>
            
            <div class="flex items-center justify-between py-3 border-b">
              <div>
                <h3 class="font-medium text-gray-900">Password</h3>
                <p class="text-sm text-gray-600">Last changed {{ formatDate(profileData.updated_at) }}</p>
              </div>
              <button
                @click="showPasswordModal = true"
                class="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        <!-- Notification Preferences -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Order Updates</h3>
                <p class="text-sm text-gray-600">Receive notifications about your order status</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.order_updates"
                  type="checkbox"
                  class="sr-only peer"
                  @change="updateNotificationSettings"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Promotional Emails</h3>
                <p class="text-sm text-gray-600">Receive emails about promotions and offers</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.promotional_emails"
                  type="checkbox"
                  class="sr-only peer"
                  @change="updateNotificationSettings"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">SMS Notifications</h3>
                <p class="text-sm text-gray-600">Receive SMS updates for urgent notifications</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="notificationSettings.sms_notifications"
                  type="checkbox"
                  class="sr-only peer"
                  @change="updateNotificationSettings"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Account Statistics -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ accountStats.total_orders }}</div>
              <div class="text-sm text-gray-600">Total Orders</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">₱{{ accountStats.total_spent }}</div>
              <div class="text-sm text-gray-600">Total Spent</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ accountStats.completed_orders }}</div>
              <div class="text-sm text-gray-600">Completed Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closePasswordModal"
    >
      <div
        class="bg-white rounded-lg max-w-md w-full p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Change Password</h3>
          <button
            @click="closePasswordModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              v-model="passwordForm.new_password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              minlength="6"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              v-model="passwordForm.confirm_password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              minlength="6"
            />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closePasswordModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="changingPassword"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="changingPassword" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Changing...
              </span>
              <span v-else>Change Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'

const { supabase } = useSupabase()
const { user } = useAuth()
const toast = useToast()

// Data
const profileData = ref({})
const editingPersonal = ref(false)
const updatingPersonal = ref(false)
const showPasswordModal = ref(false)
const changingPassword = ref(false)
const accountStats = ref({
  total_orders: 0,
  total_spent: 0,
  completed_orders: 0
})

const personalForm = reactive({
  first_name: '',
  last_name: '',
  middle_name: '',
  contact_number: '',
  address: ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const notificationSettings = reactive({
  order_updates: true,
  promotional_emails: false,
  sms_notifications: true
})

// Methods
const fetchProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) throw error
    
    profileData.value = data
    
    // Populate form
    personalForm.first_name = data.first_name || ''
    personalForm.last_name = data.last_name || ''
    personalForm.middle_name = data.middle_name || ''
    personalForm.contact_number = data.contact_number || ''
    personalForm.address = data.address || ''
    
    // Load notification settings
    if (data.notification_settings) {
      Object.assign(notificationSettings, data.notification_settings)
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    toast.error('Failed to load profile')
  }
}

const fetchAccountStats = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount')
      .eq('user_id', user.value.id)

    if (error) throw error

    const orders = data || []
    accountStats.value = {
      total_orders: orders.length,
      total_spent: orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0),
      completed_orders: orders.filter(order => order.status === 'delivered').length
    }
  } catch (error) {
    console.error('Error fetching account stats:', error)
  }
}

const getInitials = () => {
  const first = profileData.value.first_name || ''
  const last = profileData.value.last_name || ''
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const handleProfilePictureChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file')
    return
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image size must be less than 2MB')
    return
  }

  try {
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `profile-${user.value.id}-${Date.now()}.${fileExt}`
    const filePath = `profile-pictures/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath)

    // Update user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: urlData.publicUrl })
      .eq('id', user.value.id)

    if (updateError) throw updateError

    profileData.value.profile_picture = urlData.publicUrl
    toast.success('Profile picture updated successfully!')

  } catch (error) {
    console.error('Error uploading profile picture:', error)
    toast.error('Failed to update profile picture')
  }
}

const updatePersonalInfo = async () => {
  try {
    updatingPersonal.value = true

    const { error } = await supabase
      .from('users')
      .update({
        first_name: personalForm.first_name,
        last_name: personalForm.last_name,
        middle_name: personalForm.middle_name,
        contact_number: personalForm.contact_number,
        address: personalForm.address,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.value.id)

    if (error) throw error

    // Update local data
    Object.assign(profileData.value, personalForm)
    
    editingPersonal.value = false
    toast.success('Profile updated successfully!')

  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('Failed to update profile')
  } finally {
    updatingPersonal.value = false
  }
}

const cancelPersonalEdit = () => {
  // Reset form to original values
  personalForm.first_name = profileData.value.first_name || ''
  personalForm.last_name = profileData.value.last_name || ''
  personalForm.middle_name = profileData.value.middle_name || ''
  personalForm.contact_number = profileData.value.contact_number || ''
  personalForm.address = profileData.value.address || ''
  
  editingPersonal.value = false
}

const changePassword = async () => {
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    toast.error('New passwords do not match')
    return
  }

  try {
    changingPassword.value = true

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.new_password
    })

    if (error) throw error

    toast.success('Password changed successfully!')
    closePasswordModal()

  } catch (error) {
    console.error('Error changing password:', error)
    toast.error('Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.current_password = ''
  passwordForm.new_password = ''
  passwordForm.confirm_password = ''
}

const updateNotificationSettings = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        notification_settings: notificationSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.value.id)

    if (error) throw error

    toast.success('Notification preferences updated!')

  } catch (error) {
    console.error('Error updating notification settings:', error)
    toast.error('Failed to update notification preferences')
  }
}

// Lifecycle
onMounted(async () => {
  await fetchProfile()
  await fetchAccountStats()
})
</script>
