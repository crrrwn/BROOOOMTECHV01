<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="text-center">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Barcode</h3>
      
      <!-- Barcode Display -->
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <canvas ref="barcodeCanvas" class="mx-auto"></canvas>
      </div>
      
      <!-- Order Number -->
      <p class="text-sm text-gray-600 mb-4">Order #{{ orderNumber }}</p>
      
      <!-- Action Buttons -->
      <div class="flex justify-center space-x-3">
        <button
          @click="downloadBarcode"
          class="btn-primary text-sm"
        >
          Download
        </button>
        <button
          @click="printBarcode"
          class="btn-secondary text-sm"
        >
          Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  orderNumber: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: 'CODE128'
  }
})

const barcodeCanvas = ref(null)

const generateBarcode = () => {
  if (barcodeCanvas.value && props.orderNumber) {
    JsBarcode(barcodeCanvas.value, props.orderNumber, {
      format: props.format,
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 14,
      textMargin: 10,
      background: '#ffffff',
      lineColor: '#000000'
    })
  }
}

const downloadBarcode = () => {
  if (barcodeCanvas.value) {
    const link = document.createElement('a')
    link.download = `barcode-${props.orderNumber}.png`
    link.href = barcodeCanvas.value.toDataURL()
    link.click()
  }
}

const printBarcode = () => {
  if (barcodeCanvas.value) {
    const printWindow = window.open('', '_blank')
    const canvas = barcodeCanvas.value
    const dataURL = canvas.toDataURL()
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode - ${props.orderNumber}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              text-align: center; 
              font-family: Arial, sans-serif; 
            }
            .barcode-container {
              border: 2px solid #000;
              padding: 20px;
              display: inline-block;
              margin: 20px;
            }
            h2 { margin-bottom: 20px; }
            p { margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <h2>BroomTech Delivery</h2>
            <img src="${dataURL}" alt="Barcode" />
            <p>Order #${props.orderNumber}</p>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.print()
  }
}

onMounted(() => {
  generateBarcode()
})

watch(() => props.orderNumber, () => {
  generateBarcode()
})
</script>
