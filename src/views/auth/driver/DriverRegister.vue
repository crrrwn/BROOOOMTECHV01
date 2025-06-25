<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
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
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Driver Application</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/auth/driver/login" class="font-medium text-primary-600 hover:text-primary-500">
          Sign in here
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
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

              <div>
                <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name (Optional)</label>
                <input
                  id="middleName"
                  v-model="form.middleName"
                  type="text"
                  class="input-field"
                />
              </div>

              <div>
                <label for="contact" class="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  id="contact"
                  v-model="form.contact"
                  type="tel"
                  required
                  placeholder="+63 9XX XXX XXXX"
                  class="input-field"
                  :class="{ 'border-red-500': errors.contact }"
                />
                <p v-if="errors.contact" class="mt-1 text-sm text-red-600">{{ errors.contact }}</p>
              </div>

              <div class="md:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="input-field"
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700">Complete Address</label>
                <textarea
                  id="address"
                  v-model="form.address"
                  rows="3"
                  required
                  placeholder="House/Unit Number, Street, Barangay, City, Province"
                  class="input-field"
                  :class="{ 'border-red-500': errors.address }"
                ></textarea>
                <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
              </div>
            </div>
          </div>

          <!-- Password Section -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>

          <!-- Motorcycle Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Motorcycle Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="motorcyclePlate" class="block text-sm font-medium text-gray-700">Plate Number</label>
                <input
                  id="motorcyclePlate"
                  v-model="form.motorcyclePlate"
                  type="text"
                  required
                  placeholder="ABC-1234"
                  class="input-field"
                  :class="{ 'border-red-500': errors.motorcyclePlate }"
                />
                <p v-if="errors.motorcyclePlate" class="mt-1 text-sm text-red-600">{{ errors.motorcyclePlate }}</p>
              </div>

              <div>
                <label for="motorcycleBrand" class="block text-sm font-medium text-gray-700">Brand & Model</label>
                <input
                  id="motorcycleBrand"
                  v-model="form.motorcycleBrand"
                  type="text"
                  required
                  placeholder="Honda Click 150i"
                  class="input-field"
                  :class="{ 'border-red-500': errors.motorcycleBrand }"
                />
                <p v-if="errors.motorcycleBrand" class="mt-1 text-sm text-red-600">{{ errors.motorcycleBrand }}</p>
              </div>

              <div class="md:col-span-2">
                <label for="experience" class="block text-sm font-medium text-gray-700">Driving Experience</label>
                <textarea
                  id="experience"
                  v-model="form.experience"
                  rows="3"
                  placeholder="Describe your driving experience, years of riding, etc."
                  class="input-field"
                ></textarea>
              </div>

              <div class="md:col-span-2">
                <label for="availability" class="block text-sm font-medium text-gray-700">Availability</label>
                <textarea
                  id="availability"
                  v-model="form.availability"
                  rows="2"
                  placeholder="What days and hours are you available to work?"
                  class="input-field"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Document Uploads -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
            <div class="space-y-6">
              <!-- Driver's License -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Driver's License</label>
                <FileUploader
                  accept="image/*,.pdf"
                  :multiple="false"
                  bucket="driver-documents"
                  folder="licenses"
                  @uploaded="handleLicenseUpload"
                  @error="handleUploadError"
                />
                <p class="mt-1 text-xs text-gray-500">Upload a clear photo or scan of your valid driver's license</p>
              </div>

              <!-- ORCR -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Official Receipt & Certificate of Registration (ORCR)</label>
                <FileUploader
                  accept="image/*,.pdf"
                  :multiple="false"
                  bucket="driver-documents"
                  folder="orcr"
                  @uploaded="handleOrcrUpload"
                  @error="handleUploadError"
                />
                <p class="mt-1 text-xs text-gray-500">Upload your motorcycle's ORCR document</p>
              </div>

              <!-- Selfie with ID -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Selfie with Valid ID</label>
                <FileUploader
                  accept="image/*"
                  :multiple="false"
                  bucket="driver-documents"
                  folder="selfies"
                  @uploaded="handleSelfieUpload"
                  @error="handleUploadError"
                />
                <p class="mt-1 text-xs text-gray-500">Take a clear selfie while holding your valid government ID</p>
              </div>

              <!-- Profile Picture -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <FileUploader
                  accept="image/*"
                  :multiple="false"
                  bucket="driver-documents"
                  folder="profiles"
                  @uploaded="handleProfileUpload"
                  @error="handleUploadError"
                />
                <p class="mt-1 text-xs text-gray-500">Upload a professional profile photo</p>
              </div>
            </div>
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
              <a href="#" class="text-primary-600 hover:text-primary-500">Terms and Conditions</a>,
              <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>,
              and understand that my application will be reviewed by BroomTech administrators.
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !allDocumentsUploaded"
              class="w-full btn-primary flex justify-center items-center"
              :class="{ 'opacity-50 cursor-not-allowed': !allDocumentsUploaded }"
            >
              <div v-if="loading" class="spinner mr-2"></div>
              {{ loading ? 'Submitting Application...' : 'Submit Driver Application' }}
            </button>
            <p v-if="!allDocumentsUploaded" class="mt-2 text-sm text-red-600 text-center">
              Please upload all required documents before submitting
            </p>
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
              to="/auth/admin/register"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Admin Registration
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toastification'
import FileUploader from '@/components/FileUploader.vue'

const router = useRouter()
const toast = useToast()
const { register, loading } = useAuth()
const { insert } = useSupabase()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
  contact: '',
  email: '',
  address: '',
  password: '',
  confirmPassword: '',
  motorcyclePlate: '',
  motorcycleBrand: '',
  experience: '',
  availability: '',
  agreeTerms: false
})

const uploadedFiles = reactive({
  license: null,
  orcr: null,
  selfie: null,
  profile: null
})

const errors = reactive({
  firstName: '',
  lastName: '',
  contact: '',
  email: '',
  address: '',
  password: '',
  confirmPassword: '',
  motorcyclePlate: '',
  motorcycleBrand: ''
})

const allDocumentsUploaded = computed(() => {
  return uploadedFiles.license && uploadedFiles.orcr && uploadedFiles.selfie && uploadedFiles.profile
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  // Name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  // Contact validation
  if (!form.contact.trim()) {
    errors.contact = 'Contact number is required'
    isValid = false
  } else if (!/^(\+63|0)?9\d{9}$/.test(form.contact.replace(/\s/g, ''))) {
    errors.contact = 'Please enter a valid Philippine mobile number'
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

  // Address validation
  if (!form.address.trim()) {
    errors.address = 'Address is required'
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

  // Motorcycle validation
  if (!form.motorcyclePlate.trim()) {
    errors.motorcyclePlate = 'Motorcycle plate number is required'
    isValid = false
  }

  if (!form.motorcycleBrand.trim()) {
    errors.motorcycleBrand = 'Motorcycle brand and model is required'
    isValid = false
  }

  return isValid
}

const handleLicenseUpload = (files) => {
  uploadedFiles.license = files[0]
  toast.success('Driver\'s license uploaded successfully')
}

const handleOrcrUpload = (files) => {
  uploadedFiles.orcr = files[0]
  toast.success('ORCR uploaded successfully')
}

const handleSelfieUpload = (files) => {
  uploadedFiles.selfie = files[0]
  toast.success('Selfie with ID uploaded successfully')
}

const handleProfileUpload = (files) => {
  uploadedFiles.profile = files[0]
  toast.success('Profile picture uploaded successfully')
}

const handleUploadError = (error) => {
  toast.error('Upload failed: ' + error.message)
}

const handleSubmit = async () => {
  if (!validateForm()) return

  if (!allDocumentsUploaded.value) {
    toast.error('Please upload all required documents')
    return
  }

  try {
    // Create driver application
    const applicationData = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      middle_name: form.middleName.trim() || null,
      contact: form.contact.trim(),
      email: form.email.trim().toLowerCase(),
      address: form.address.trim(),
      password_hash: form.password, // This should be hashed in production
      motorcycle_plate: form.motorcyclePlate.trim(),
      motorcycle_info: `${form.motorcycleBrand.trim()}`,
      experience: form.experience.trim(),
      availability: form.availability.trim(),
      license_url: uploadedFiles.license.url,
      orcr_url: uploadedFiles.orcr.url,
      selfie_with_id_url: uploadedFiles.selfie.url,
      profile_image_url: uploadedFiles.profile.url,
      status: 'pending'
    }

    const { data, error } = await insert('driver_applications', applicationData)

    if (error) throw error

    toast.success('Driver application submitted successfully!')
    router.push({
      name: 'DriverOTPVerification',
      query: { email: form.email, type: 'driver' }
    })

  } catch (error) {
    console.error('Application submission error:', error)
    toast.error('Failed to submit application: ' + error.message)
  }
}
</script>
