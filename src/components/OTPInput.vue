<template>
  <div class="flex justify-center space-x-2">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="el => inputRefs[index] = el"
      v-model="digits[index]"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      @paste="handlePaste"
      type="text"
      maxlength="1"
      class="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors duration-200"
      :class="{
        'border-red-500': error,
        'border-green-500': success
      }"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  length: {
    type: Number,
    default: 6
  },
  error: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'complete'])

const digits = ref(Array(props.length).fill(''))
const inputRefs = ref([])

const handleInput = (index, event) => {
  const value = event.target.value
  
  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    event.target.value = digits.value[index]
    return
  }

  digits.value[index] = value

  // Move to next input if current is filled
  if (value && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }

  updateValue()
}

const handleKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }

  if (event.key === 'ArrowRight' && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const pastedDigits = pastedData.replace(/\D/g, '').split('').slice(0, props.length)
  
  pastedDigits.forEach((digit, index) => {
    if (index < props.length) {
      digits.value[index] = digit
    }
  })

  // Focus on the next empty input or the last input
  const nextEmptyIndex = digits.value.findIndex(digit => !digit)
  const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : props.length - 1
  
  nextTick(() => {
    inputRefs.value[focusIndex]?.focus()
  })

  updateValue()
}

const updateValue = () => {
  const value = digits.value.join('')
  emit('update:modelValue', value)
  
  if (value.length === props.length) {
    emit('complete', value)
  }
}

// Clear all inputs
const clear = () => {
  digits.value = Array(props.length).fill('')
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
  updateValue()
}

// Focus first input on mount
nextTick(() => {
  inputRefs.value[0]?.focus()
})

defineExpose({ clear })
</script>
