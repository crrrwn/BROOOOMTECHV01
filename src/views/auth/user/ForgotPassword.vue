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
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Reset Password</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Remember your password?
        <router-link to="/auth/user/login" class="font-medium text-primary-600 hover:text-primary-500">
          Sign in here
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Step 1: Email Input -->
        <div v-if="step === 1">
          <form @submit.prevent="sendResetCode" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="Enter your email address"
                />
              </div>
              <p class="mt-2 text-sm text-gray-500">
                We'll send a verification code to this email address.
              </p>
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-primary flex justify-center items-center"
              >
                <div v-if="loading" class="spinner mr-2"></div>
                {{ loading ? 'Sending Code...' : 'Send Reset Code' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-else-if="step === 2">
          <div class="text-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">Enter Verification Code</h3>
            <p class="mt-2 text-sm text-gray-600">
              We sent a 6-digit code to <span class="font-medium">{{ email }}</span>
            </p>
          </div>

          <form @submit.prevent="verifyCode" class="space-y-6">
            <div>
              <OTPInput
                v-model="otpCode"
                :length="6"
                :error="otpError"
                @complete="verifyCode"
              />
              <p v-if="otpError" class="mt-2 text-sm text-red-600 text-center">{{ otpError }}</p>
            </div>

            <div class="flex flex-col space-y-3">
              <button
                type="submit"
                :disabled="loading || otpCode.length !== 6"
                class="w-full btn-primary flex justify-center items-center"
              >
                <div v-if="loading" class="spinner mr-2"></div>
                {{ loading ? 'Verifying...' : 'Verify Code' }}
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
        </div>

        <!-- Step 3: New Password -->
        <div v-else-if="step === 3">
          <div class="text-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">Set New Password</h3>
            <p class="mt-2 text-sm text-gray-600">
              Create a strong password for your account
            </p>
          </div>

          <form @submit.prevent="resetPassword" class="space-y-6">
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <div class="mt-1 relative">
                <input
                  id="newPassword"
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input-field pr-10"
                  :class="{ 'border-red-500': passwordError }"
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
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="input-field"
                  :class="{ 'border-red-500': confirmPasswordError }"
                />
              </div>
              <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-primary flex justify-center items-center"
              >
                <div v-if="loading" class="spinner mr-2"></div>
                {{ loading ? 'Updating Password...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useOTP } from '@/composables/useOTP'
import OTPInput from '@/components/OTPInput.vue'

const router = useRouter()
const { forgotPassword, resetPassword: authResetPassword, loading } = useAuth()
const { verifyOTP, resendOTP } = useOTP()

const step = ref(1)
const email = ref('')
const otpCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const otpError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const resendLoading = ref(false)
const resendCooldown = ref(0)
let resendTimer = null

const sendResetCode = async () => {
  const result = await forgotPassword(email.value, 'user')
  if (result.success) {
    step.value = 2
    startResendCooldown()
  }
}

const verifyCode = async () => {
  otpError.value = ''
  
  const result = await verifyOTP(email.value, otpCode.value, 'user')
  if (result.success) {
    step.value = 3
  } else {
    otpError.value = 'Invalid or expired verification code'
  }
}

const resendCode = async () => {
  resendLoading.value = true
  const result = await resendOTP(email.value, 'user')
  if (result.success) {
    startResendCooldown()
  }
  resendLoading.value = false
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

const validatePassword = () => {
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (newPassword.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return false
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword.value)) {
    passwordError.value = 'Password must contain uppercase, lowercase, and number'
    return false
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return false
  }

  return true
}

const resetPassword = async () => {
  if (!validatePassword()) return

  const result = await authResetPassword(email.value, otpCode.value, newPassword.value, 'user')
  if (result.success) {
    router.push('/auth/user/login')
  }
}

onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>
