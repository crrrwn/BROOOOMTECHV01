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
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Driver Login</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        New driver?
        <router-link to="/auth/driver/register" class="font-medium text-primary-600 hover:text-primary-500">
          Apply here
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Account Status Alert -->
        <div v-if="accountStatus" class="mb-6 p-4 rounded-lg" :class="statusClasses">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg v-if="accountStatus === 'pending'" class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="accountStatus === 'rejected'" class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium" :class="statusTextClass">
                {{ statusTitle }}
              </h3>
              <div class="mt-2 text-sm" :class="statusTextClass">
                <p>{{ statusMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="input-field"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
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
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || accountStatus === 'pending' || accountStatus === 'rejected'"
              class="w-full btn-primary flex justify-center items-center"
              :class="{ 'opacity-50 cursor-not-allowed': accountStatus === 'pending' || accountStatus === 'rejected' }"
            >
              <div v-if="loading" class="spinner mr-2"></div>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Other options</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <router-link
              to="/auth/user/login"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Customer Login
            </router-link>
            <router-link
              to="/auth/admin/login"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Admin Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'

const showPassword = ref(false)
const accountStatus = ref(null)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const { login, loading } = useAuth()
const { select } = useSupabase()

const statusClasses = computed(() => {
  switch (accountStatus.value) {
    case 'pending':
      return 'bg-yellow-50 border border-yellow-200'
    case 'rejected':
      return 'bg-red-50 border border-red-200'
    default:
      return 'bg-red-50 border border-red-200'
  }
})

const statusTextClass = computed(() => {
  switch (accountStatus.value) {
    case 'pending':
      return 'text-yellow-800'
    case 'rejected':
      return 'text-red-800'
    default:
      return 'text-red-800'
  }
})

const statusTitle = computed(() => {
  switch (accountStatus.value) {
    case 'pending':
      return 'Account Pending Approval'
    case 'rejected':
      return 'Account Application Rejected'
    default:
      return 'Account Not Approved'
  }
})

const statusMessage = computed(() => {
  switch (accountStatus.value) {
    case 'pending':
      return 'Your driver application is under review. You will be notified once approved.'
    case 'rejected':
      return 'Your driver application was rejected. Please contact support for more information.'
    default:
      return 'Your account is not approved for login. Please contact support.'
  }
})

const checkDriverStatus = async (email) => {
  try {
    const { data, error } = await select('drivers', 'is_approved, email_verified').eq('email', email).single()
    
    if (error) {
      // Check if driver exists in applications
      const { data: appData } = await select('driver_applications', 'status').eq('email', email).single()
      if (appData) {
        accountStatus.value = appData.status
      }
      return
    }

    if (!data.email_verified) {
      accountStatus.value = 'unverified'
    } else if (!data.is_approved) {
      accountStatus.value = 'pending'
    } else {
      accountStatus.value = null
    }
  } catch (error) {
    console.error('Error checking driver status:', error)
  }
}

const validateForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }

  return true
}

const handleLogin = async () => {
  if (!validateForm()) return

  // Check driver status before attempting login
  await checkDriverStatus(form.email)
  
  if (accountStatus.value && accountStatus.value !== null) {
    return // Don't proceed with login if account has issues
  }

  await login(form.email, form.password, 'driver')
}

// Check status when email changes
const handleEmailChange = () => {
  if (form.email && /\S+@\S+\.\S+/.test(form.email)) {
    checkDriverStatus(form.email)
  } else {
    accountStatus.value = null
  }
}

onMounted(() => {
  // Watch for email changes
  const emailInput = document.getElementById('email')
  if (emailInput) {
    emailInput.addEventListener('blur', handleEmailChange)
  }
})
</script>
