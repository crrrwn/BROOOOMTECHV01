<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">BroomTech</h1>
        </div>
      </div>
      
      <!-- Success State -->
      <div v-if="!hasError">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Confirmed!</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Your email has been successfully verified. You can now log in to your account.
        </p>
      </div>
      
      <!-- Error State -->
      <div v-else>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-red-600">Confirmation Failed</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success Content -->
        <div v-if="!hasError" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">Account Activated</h3>
          <p class="text-sm text-gray-500 mb-6">
            Your email address has been confirmed and your account is now active.
          </p>

          <div class="space-y-3">
            <button
              @click="goToLogin('user')"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue to Customer Login
            </button>
            
            <button
              @click="goToLogin('driver')"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Driver Login
            </button>
            
            <button
              @click="goToLogin('admin')"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Admin Login
            </button>
          </div>
        </div>
        
        <!-- Error Content -->
        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">Confirmation Failed</h3>
          <p class="text-sm text-gray-500 mb-6">
            {{ errorMessage }}
          </p>

          <div class="space-y-3">
            <button
              @click="requestNewLink"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {{ loading ? 'Sending...' : 'Request New Verification Link' }}
            </button>
            
            <button
              @click="goToLogin('user')"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const hasError = ref(false)
const errorMessage = ref('')
const loading = ref(false)

// Check URL parameters for errors immediately
const error = route.query.error
const errorDescription = route.query.error_description
const errorCode = route.query.error_code

if (error) {
  hasError.value = true

  if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
    errorMessage.value = 'Your verification link has expired. Please request a new one.'
  } else if (errorDescription?.includes('invalid')) {
    errorMessage.value = 'The verification link is invalid. Please request a new one.'
  } else {
    errorMessage.value = errorDescription || 'Email verification failed. Please try again.'
  }

  toast.error(errorMessage.value)
} else {
  // Success case
  toast.success('Email verified successfully! You can now log in.')
}

const goToLogin = (userType) => {
  router.push(`/auth/${userType}/login?verified=true`)
}

const requestNewLink = () => {
  router.push('/auth/user/register')
}

// onMounted(() => {
//   // Check URL parameters for errors
//   const error = route.query.error
//   const errorDescription = route.query.error_description
//   const errorCode = route.query.error_code

//   if (error) {
//     hasError.value = true
    
//     if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
//       errorMessage.value = 'Your verification link has expired. Please request a new one.'
//     } else if (errorDescription?.includes('invalid')) {
//       errorMessage.value = 'The verification link is invalid. Please request a new one.'
//     } else {
//       errorMessage.value = errorDescription || 'Email verification failed. Please try again.'
//     }
    
//     toast.error(errorMessage.value)
//   } else {
//     // Success case
//     toast.success('Email verified successfully! You can now log in.')
//   }
// })
</script>
