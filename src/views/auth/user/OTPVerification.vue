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
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Verify Your Email</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        We sent a verification code to
        <span class="font-medium text-gray-900">{{ email }}</span>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleVerification" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 text-center mb-4">
              Enter 6-digit verification code
            </label>
            <OTPInput
              v-model="otpCode"
              :length="6"
              :error="error"
              @complete="handleVerification"
            />
            <p v-if="error" class="mt-2 text-sm text-red-600 text-center">{{ error }}</p>
          </div>

          <div class="flex flex-col space-y-3">
            <button
              type="submit"
              :disabled="loading || otpCode.length !== 6"
              class="w-full btn-primary flex justify-center items-center"
            >
              <div v-if="loading" class="spinner mr-2"></div>
              {{ loading ? 'Verifying...' : 'Verify Email' }}
            </button>

            <button
              type="button"
              @click="resendCode"
              :disabled="resendLoading || resendCooldown > 0"
              class="w-full btn-secondary flex justify-center items-center"
            >
              <div v-if="resendLoading" class="spinner mr-2"></div>
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Wrong email address?
            <router-link :to="backRoute" class="font-medium text-primary-600 hover:text-primary-500">
              Go back and change it
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useOTP } from '@/composables/useOTP'
import OTPInput from '@/components/OTPInput.vue'

const route = useRoute()
const router = useRouter()
const { verifyOTP: authVerifyOTP, loading } = useAuth()
const { resendOTP, loading: resendLoading } = useOTP()

const email = ref('')
const userType = ref('')
const otpCode = ref('')
const error = ref('')
const resendCooldown = ref(0)
let resendTimer = null

const backRoute = computed(() => {
  return `/auth/${userType.value}/register`
})

const handleVerification = async () => {
  if (otpCode.value.length !== 6) return

  error.value = ''
  const result = await authVerifyOTP(email.value, otpCode.value, userType.value)
  
  if (result.success) {
    router.push(`/auth/${userType.value}/login`)
  } else {
    error.value = 'Invalid or expired verification code'
  }
}

const resendCode = async () => {
  const result = await resendOTP(email.value, userType.value)
  if (result.success) {
    startResendCooldown()
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer)
    }
  }, 1000)
}

onMounted(() => {
  email.value = route.query.email || ''
  userType.value = route.query.type || 'user'
  if (!email.value) {
    router.push(`/auth/${userType.value}/register`)
    return
  }
  startResendCooldown()
})

onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>
