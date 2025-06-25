<template>
  <div class="w-full">
    <!-- Upload Area -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        
        <div>
          <button
            @click="triggerFileSelect"
            type="button"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Click to upload
          </button>
          <span class="text-gray-500"> or drag and drop</span>
        </div>
        
        <p class="text-xs text-gray-500">
          {{ acceptText }}
        </p>
      </div>
    </div>

    <!-- File Preview -->
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <!-- File Icon -->
          <div class="flex-shrink-0">
            <svg v-if="file.type.startsWith('image/')" class="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- File Info -->
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        
        <!-- Remove Button -->
        <button
          @click="removeFile(index)"
          class="text-red-500 hover:text-red-700 p-1"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-4">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Uploading...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Upload Button -->
    <button
      v-if="files.length > 0 && !uploading"
      @click="uploadFiles"
      class="mt-4 w-full btn-primary"
      :disabled="uploading"
    >
      Upload {{ files.length }} {{ files.length === 1 ? 'File' : 'Files' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toastification'

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
    default: 'uploads'
  },
  folder: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  }
})

const emit = defineEmits(['uploaded', 'error'])

const { uploadFile, getPublicUrl } = useSupabase()
const toast = useToast()

const fileInput = ref(null)
const files = ref([])
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const acceptText = computed(() => {
  if (props.accept.includes('image/*')) {
    return 'PNG, JPG, GIF up to 5MB'
  }
  return 'Files up to 5MB'
})

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  addFiles(selectedFiles)
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const droppedFiles = Array.from(event.dataTransfer.files)
  addFiles(droppedFiles)
}

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    // Check file size
    if (file.size > props.maxSize) {
      toast.error(`File ${file.name} is too large. Maximum size is ${formatFileSize(props.maxSize)}`)
      return false
    }
    
    // Check file type if accept is specified
    if (props.accept && props.accept !== '*') {
      const acceptTypes = props.accept.split(',').map(type => type.trim())
      const isValidType = acceptTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.includes('/*')) {
          const mainType = type.split('/')[0]
          return file.type.startsWith(mainType)
        }
        return file.type === type
      })
      
      if (!isValidType) {
        toast.error(`File ${file.name} is not a supported file type`)
        return false
      }
    }
    
    return true
  })

  if (props.multiple) {
    files.value = [...files.value, ...validFiles]
  } else {
    files.value = validFiles.slice(0, 1)
  }
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const uploadFiles = async () => {
  if (files.value.length === 0) return

  uploading.value = true
  uploadProgress.value = 0
  
  try {
    const uploadedFiles = []
    
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]
      const fileName = `${Date.now()}-${file.name}`
      const filePath = props.folder ? `${props.folder}/${fileName}` : fileName
      
      const { data, error } = await uploadFile(props.bucket, filePath, file)
      
      if (error) throw error
      
      const publicUrl = getPublicUrl(props.bucket, filePath)
      
      uploadedFiles.push({
        name: file.name,
        path: filePath,
        url: publicUrl,
        size: file.size,
        type: file.type
      })
      
      uploadProgress.value = Math.round(((i + 1) / files.value.length) * 100)
    }
    
    emit('uploaded', uploadedFiles)
    toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`)
    
    // Clear files after successful upload
    files.value = []
    
  } catch (error) {
    console.error('Upload error:', error)
    toast.error('Upload failed: ' + error.message)
    emit('error', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
