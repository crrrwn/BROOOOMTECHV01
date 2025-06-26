<template>
  <div class="file-uploader">
    <!-- File Drop Zone -->
    <div
      @drop="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragenter.prevent="isDragging = true"
      @dragleave="isDragging = false"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
      :class="{ 'border-green-500 bg-green-50': isDragging }"
      @click="fileInputClick"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="text-sm text-gray-600">
          <span class="font-medium text-green-600 hover:text-green-500">
            Drag and drop files here or click to browse
          </span>
        </div>
        <p class="text-xs text-gray-500">{{ acceptText }}</p>
      </div>
    </div>

    <!-- Selected Files -->
    <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
      <h4 class="text-sm font-medium text-gray-900">Selected Files:</h4>
      <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg v-if="isImageFile(file)" class="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }} • {{ file.type || 'Unknown type' }}</p>
          </div>
        </div>
        <button
          @click="removeFile(index)"
          class="text-red-500 hover:text-red-700 p-1"
          type="button"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="selectedFiles.length > 0" class="mt-4">
      <button
        @click="uploadFiles"
        :disabled="uploading"
        class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="uploading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 100-16 8 8 0 000 16h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ uploading ? 'Uploading...' : 'Upload Files' }}
      </button>
      <p class="mt-1 text-xs text-gray-500 text-center">Files will be saved to Supabase Storage</p>
    </div>

    <!-- Upload Status -->
    <div v-if="uploadStatus" class="mt-4">
      <div v-if="uploadStatus === 'success'" class="bg-green-50 border border-green-200 rounded-md p-3">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">Upload successful!</p>
            <p class="text-xs text-green-600">Files saved to Supabase Storage</p>
          </div>
        </div>
      </div>
      
      <div v-else-if="uploadStatus === 'error'" class="bg-red-50 border border-red-200 rounded-md p-3">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            <p class="text-xs text-red-600 mt-1">{{ errorSolution }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupabase'

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*,.pdf'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  bucket: {
    type: String,
    required: true
  },
  folder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['uploaded', 'error'])

const { uploadFile, supabase } = useSupabase()

const fileInput = ref(null)
const selectedFiles = ref([])
const uploading = ref(false)
const uploadStatus = ref(null)
const errorMessage = ref('')
const errorSolution = ref('')
const isDragging = ref(false)

const acceptText = computed(() => {
  if (props.accept.includes('image')) {
    return 'PNG, JPG, GIF, WebP images and PDF files up to 5MB'
  }
  return 'Files up to 5MB'
})

const isImageFile = (file) => {
  return file.type.startsWith('image/')
}

const isValidFileType = (file) => {
  const acceptTypes = props.accept.split(',').map(type => type.trim())
  
  for (const acceptType of acceptTypes) {
    if (acceptType === '*') return true
    
    if (acceptType.includes('*')) {
      const baseType = acceptType.split('/')[0]
      if (file.type.startsWith(baseType + '/')) return true
    }
    
    if (file.type === acceptType) return true
    
    if (acceptType.startsWith('.')) {
      const extension = acceptType.toLowerCase()
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith(extension)) return true
    }
  }
  
  return false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

const addFiles = (files) => {
  const validFiles = []
  const errors = []
  
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      errors.push(`${file.name} is too large (${formatFileSize(file.size)}). Maximum size is 5MB.`)
      continue
    }
    
    if (!isValidFileType(file)) {
      errors.push(`${file.name} is not supported. Please use ${props.accept} files.`)
      continue
    }
    
    validFiles.push(file)
  }
  
  if (errors.length > 0) {
    errorMessage.value = errors.join(' ')
    errorSolution.value = 'Please select supported file types and ensure they are under 5MB.'
    uploadStatus.value = 'error'
  } else {
    uploadStatus.value = null
    errorMessage.value = ''
    errorSolution.value = ''
  }
  
  if (validFiles.length > 0) {
    if (props.multiple) {
      selectedFiles.value = [...selectedFiles.value, ...validFiles]
    } else {
      selectedFiles.value = validFiles.slice(0, 1)
    }
  }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
  uploadStatus.value = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  
  uploading.value = true
  uploadStatus.value = null
  
  try {
    const uploadedFiles = []
    
    for (const file of selectedFiles.value) {
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}_${randomString}.${fileExtension}`
      const filePath = props.folder ? `${props.folder}/${fileName}` : fileName
      
      console.log(`Uploading file to: ${props.bucket}/${filePath}`)
      
      const { data, error } = await uploadFile(props.bucket, filePath, file)
      
      if (error) {
        throw error
      }
      
      const { data: urlData } = supabase.storage
        .from(props.bucket)
        .getPublicUrl(filePath)
      
      uploadedFiles.push({
        name: file.name,
        path: filePath,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type
      })
    }
    
    uploadStatus.value = 'success'
    emit('uploaded', uploadedFiles)
    selectedFiles.value = []
    
  } catch (error) {
    console.error('Upload error:', error)
    uploadStatus.value = 'error'
    
    if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
      errorMessage.value = 'Storage bucket not found'
      errorSolution.value = 'Please run the SQL script to create storage buckets in Supabase.'
    } else if (error.message.includes('File size') || error.message.includes('size')) {
      errorMessage.value = 'File too large'
      errorSolution.value = 'Please use files smaller than 5MB'
    } else if (error.message.includes('not allowed') || error.message.includes('mime')) {
      errorMessage.value = 'File type not supported'
      errorSolution.value = `Please use ${props.accept} files only`
    } else {
      errorMessage.value = error.message || 'Upload failed'
      errorSolution.value = 'Please try again or contact support if the problem persists'
    }
    
    emit('error', error)
  } finally {
    uploading.value = false
  }
}

const fileInputClick = () => {
  fileInput.value.click()
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
}
</style>
