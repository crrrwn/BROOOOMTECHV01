<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-800">BroomTech</span>
        </div>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Admin Registration</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/auth/admin/login" class="font-medium text-primary-600 hover:text-primary-500">
          Sign in here
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Security Warning -->
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Restricted Access</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>Admin registration requires a special authorization code. Only authorized personnel should proceed.</p>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Admin Code -->
          <div>
            <label for="adminCode" class="block text-sm font-medium text-gray-700">Admin Authorization Code</label>
            <input
              id="adminCode"
              v-model="form.adminCode"
              type="password"
              required
              placeholder="Enter admin authorization code"
              class="input-field"
              :class="{ 'border-red-500': errors.adminCode }"
            />
            <p v-if="errors.adminCode" class="mt-1 text-sm text-red-600">{{ errors.adminCode }}</p>
            <p class="mt-1 text-xs text-gray-500">Contact system administrator for the authorization code</p>
          </div>

          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Official Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="admin@broomtech.com"
              class="input-field"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            <p class="mt-1 text-xs text-gray-500">Use your official company email address</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="input-field"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Profile Picture Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture (Optional)</label>
            <FileUploader
              accept="image/*"
              :multiple="false"
              bucket="admin-profiles"
              folder="avatars"
              @uploaded="handleProfileUpload"
              @error="handleUploadError"
            />
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-center">
            <input
              id="agreeTerms"
              v-model="form.agreeTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="agreeTerms" class="ml-2 block text-sm text-gray-900">
              I agree to the
              <a href="#" class="text-primary-600 hover:text-primary-500">Admin Terms of Service</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-primary flex justify-center items-center"
            >
              <div v-if="loading" class="spinner mr-2"></div>
              {{ loading ? 'Creating Admin Account...' : 'Create Admin Account' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Other registration options</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <router-link
              to="/auth/user/register"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Customer Registration
            </router-link>
            <router-link
              to="/auth/driver/register"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Driver Registration
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toastification'
import FileUploader from '@/components/FileUploader.vue'

const router = useRouter()
const toast = useToast()
const { register, loading } = useAuth()
const { select } = useSupabase()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const profileImageUrl = ref('')

const form = reactive({
  adminCode: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = reactive({
  adminCode: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = async () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  // Admin code validation
  if (!form.adminCode.trim()) {
    errors.adminCode = 'Admin authorization code is required'
    isValid = false
  } else {
    // Check admin code against system settings
    try {
      const { data } = await select('system_settings', 'setting_value')
        .eq('setting_key', 'admin_code')
        .single()
      
      if (!data || data.setting_value !== form.adminCode.trim()) {
        errors.adminCode = 'Invalid admin authorization code'
        isValid = false
      }
    } catch (error) {
      errors.adminCode = 'Unable to verify admin code'
      isValid = false
    }
  }

  // Name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Password must contain uppercase, lowercase, and number'
    isValid = false
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleProfileUpload = (files) => {
  profileImageUrl.value = files[0].url
  toast.success('Profile picture uploaded successfully')
}

const handleUploadError = (error) => {
  toast.error('Upload failed: ' + error.message)
}

const handleRegister = async () => {
  if (!(await validateForm())) return

  const userData = {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    password_hash: form.password, // This should be hashed in production
    admin_code: form.adminCode.trim(),
    profile_image_url: profileImageUrl.value || null
  }

  const result = await register(userData, 'admin')
  
  if (result.success) {
    router.push({
      name: 'AdminOTPVerification',
      query: { email: form.email, type: 'admin' }
    })
  }
}
</script>
