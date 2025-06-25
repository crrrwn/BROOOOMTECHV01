<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">System Settings</h1>
        <p class="text-gray-600 mt-2">Manage service categories, payment QR codes, and promotional offers</p>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'services'"
            :class="activeTab === 'services' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Service Categories
          </button>
          <button
            @click="activeTab = 'payments'"
            :class="activeTab === 'payments' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Payment QR Codes
          </button>
          <button
            @click="activeTab = 'promos'"
            :class="activeTab === 'promos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Promotional Offers
          </button>
          <button
            @click="activeTab = 'general'"
            :class="activeTab === 'general' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            General Settings
          </button>
        </nav>
      </div>

      <!-- Service Categories Tab -->
      <div v-if="activeTab === 'services'">
        <!-- Add New Service Category -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Add New Service Category</h3>
          <form @submit.prevent="addServiceCategory">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="service_name" class="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  id="service_name"
                  v-model="serviceForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Food Delivery"
                />
              </div>
              <div>
                <label for="service_description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  id="service_description"
                  v-model="serviceForm.description"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description of the service"
                />
              </div>
              <div>
                <label for="service_icon" class="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Lucide Icon Name)
                </label>
                <input
                  id="service_icon"
                  v-model="serviceForm.icon"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., UtensilsCrossed"
                />
              </div>
              <div>
                <label for="service_base_price" class="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (₱)
                </label>
                <input
                  id="service_base_price"
                  v-model.number="serviceForm.basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div class="md:col-span-2">
                <label for="service_fields" class="block text-sm font-medium text-gray-700 mb-1">
                  Required Fields (JSON format)
                </label>
                <textarea
                  id="service_fields"
                  v-model="serviceForm.requiredFields"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder='["pickup_address", "delivery_address", "items"]'
                ></textarea>
              </div>
              <div class="flex items-center">
                <input
                  id="service_active"
                  v-model="serviceForm.isActive"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label for="service_active" class="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="addingService"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {{ addingService ? 'Adding...' : 'Add Service Category' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Service Categories List -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Service Categories</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loadingServices">
                  <td colspan="5" class="px-6 py-4 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p class="text-gray-600 mt-2">Loading services...</p>
                  </td>
                </tr>
                <tr v-else-if="serviceCategories.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    No service categories found
                  </td>
                </tr>
                <tr v-else v-for="service in serviceCategories" :key="service.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="p-2 rounded-full bg-green-100 mr-3">
                        <component :is="getIconComponent(service.icon)" class="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                        <div class="text-sm text-gray-500">{{ service.slug }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ service.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">₱{{ service.base_price?.toFixed(2) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ service.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="editService(service)"
                        class="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <Edit class="h-4 w-4" />
                      </button>
                      <button
                        @click="toggleServiceStatus(service.id, !service.is_active)"
                        :class="service.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        :title="service.is_active ? 'Deactivate' : 'Activate'"
                      >
                        <component :is="service.is_active ? 'EyeOff' : 'Eye'" class="h-4 w-4" />
                      </button>
                      <button
                        @click="deleteService(service.id)"
                        class="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Payment QR Codes Tab -->
      <div v-if="activeTab === 'payments'">
        <!-- Upload QR Codes -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Payment QR Codes</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- GCash QR -->
            <div class="text-center">
              <h4 class="font-medium text-gray-900 mb-4">GCash QR Code</h4>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <img
                  v-if="qrCodes.gcash"
                  :src="qrCodes.gcash"
                  alt="GCash QR"
                  class="w-32 h-32 mx-auto object-cover rounded"
                />
                <div v-else class="w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded">
                  <QrCode class="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <FileUploader
                @file-uploaded="(url) => updateQRCode('gcash', url)"
                accept="image/*"
                :max-size="5"
                class="w-full"
              >
                <template #default="{ uploading }">
                  <button
                    :disabled="uploading"
                    class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {{ uploading ? 'Uploading...' : 'Upload GCash QR' }}
                  </button>
                </template>
              </FileUploader>
            </div>

            <!-- PayMaya QR -->
            <div class="text-center">
              <h4 class="font-medium text-gray-900 mb-4">PayMaya QR Code</h4>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <img
                  v-if="qrCodes.paymaya"
                  :src="qrCodes.paymaya"
                  alt="PayMaya QR"
                  class="w-32 h-32 mx-auto object-cover rounded"
                />
                <div v-else class="w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded">
                  <QrCode class="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <FileUploader
                @file-uploaded="(url) => updateQRCode('paymaya', url)"
                accept="image/*"
                :max-size="5"
                class="w-full"
              >
                <template #default="{ uploading }">
                  <button
                    :disabled="uploading"
                    class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {{ uploading ? 'Uploading...' : 'Upload PayMaya QR' }}
                  </button>
                </template>
              </FileUploader>
            </div>

            <!-- GoTyme QR -->
            <div class="text-center">
              <h4 class="font-medium text-gray-900 mb-4">GoTyme QR Code</h4>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <img
                  v-if="qrCodes.gotyme"
                  :src="qrCodes.gotyme"
                  alt="GoTyme QR"
                  class="w-32 h-32 mx-auto object-cover rounded"
                />
                <div v-else class="w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded">
                  <QrCode class="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <FileUploader
                @file-uploaded="(url) => updateQRCode('gotyme', url)"
                accept="image/*"
                :max-size="5"
                class="w-full"
              >
                <template #default="{ uploading }">
                  <button
                    :disabled="uploading"
                    class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {{ uploading ? 'Uploading...' : 'Upload GoTyme QR' }}
                  </button>
                </template>
              </FileUploader>
            </div>
          </div>
        </div>
      </div>

      <!-- Promotional Offers Tab -->
      <div v-if="activeTab === 'promos'">
        <!-- Add New Promo -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Create Promotional Offer</h3>
          <form @submit.prevent="addPromo">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="promo_code" class="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code
                </label>
                <input
                  id="promo_code"
                  v-model="promoForm.code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., WELCOME20"
                />
              </div>
              <div>
                <label for="promo_title" class="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="promo_title"
                  v-model="promoForm.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Welcome Discount"
                />
              </div>
              <div class="md:col-span-2">
                <label for="promo_description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="promo_description"
                  v-model="promoForm.description"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe the promotional offer"
                ></textarea>
              </div>
              <div>
                <label for="promo_type" class="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  id="promo_type"
                  v-model="promoForm.discountType"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label for="promo_value" class="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value
                </label>
                <input
                  id="promo_value"
                  v-model.number="promoForm.discountValue"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :placeholder="promoForm.discountType === 'percentage' ? 'e.g., 20 (for 20%)' : 'e.g., 50 (for ₱50)'"
                />
              </div>
              <div>
                <label for="promo_min_order" class="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount (₱)
                </label>
                <input
                  id="promo_min_order"
                  v-model.number="promoForm.minOrderAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="promo_max_discount" class="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Discount (₱)
                </label>
                <input
                  id="promo_max_discount"
                  v-model.number="promoForm.maxDiscount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="promo_usage_limit" class="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  id="promo_usage_limit"
                  v-model.number="promoForm.usageLimit"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <label for="promo_start_date" class="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="promo_start_date"
                  v-model="promoForm.startDate"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="promo_end_date" class="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  id="promo_end_date"
                  v-model="promoForm.endDate"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div class="flex items-center">
                <input
                  id="promo_active"
                  v-model="promoForm.isActive"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label for="promo_active" class="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="addingPromo"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {{ addingPromo ? 'Creating...' : 'Create Promo' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Promos List -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Promotional Offers</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promo Code
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loadingPromos">
                  <td colspan="6" class="px-6 py-4 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p class="text-gray-600 mt-2">Loading promos...</p>
                  </td>
                </tr>
                <tr v-else-if="promos.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No promotional offers found
                  </td>
                </tr>
                <tr v-else v-for="promo in promos" :key="promo.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ promo.code }}</div>
                    <div class="text-sm text-gray-500">{{ promo.title }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ promo.description }}</div>
                    <div class="text-xs text-gray-500">
                      {{ formatDateTime(promo.start_date) }} - {{ formatDateTime(promo.end_date) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `₱${promo.discount_value}` }}
                    </div>
                    <div class="text-xs text-gray-500">
                      Min: ₱{{ promo.min_order_amount || 0 }}
                      <span v-if="promo.max_discount">| Max: ₱{{ promo.max_discount }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ promo.usage_count || 0 }}{{ promo.usage_limit ? `/${promo.usage_limit}` : '' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getPromoStatusColor(promo)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getPromoStatus(promo) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="editPromo(promo)"
                        class="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <Edit class="h-4 w-4" />
                      </button>
                      <button
                        @click="togglePromoStatus(promo.id, !promo.is_active)"
                        :class="promo.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        :title="promo.is_active ? 'Deactivate' : 'Activate'"
                      >
                        <component :is="promo.is_active ? 'EyeOff' : 'Eye'" class="h-4 w-4" />
                      </button>
                      <button
                        @click="deletePromo(promo.id)"
                        class="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- General Settings Tab -->
      <div v-if="activeTab === 'general'">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">General System Settings</h3>
          <form @submit.prevent="updateGeneralSettings">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="app_name" class="block text-sm font-medium text-gray-700 mb-1">
                  Application Name
                </label>
                <input
                  id="app_name"
                  v-model="generalSettings.appName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="support_email" class="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  id="support_email"
                  v-model="generalSettings.supportEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="support_phone" class="block text-sm font-medium text-gray-700 mb-1">
                  Support Phone
                </label>
                <input
                  id="support_phone"
                  v-model="generalSettings.supportPhone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="admin_code" class="block text-sm font-medium text-gray-700 mb-1">
                  Admin Registration Code
                </label>
                <input
                  id="admin_code"
                  v-model="generalSettings.adminCode"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="order_cancel_time" class="block text-sm font-medium text-gray-700 mb-1">
                  Order Cancel Time Limit (seconds)
                </label>
                <input
                  id="order_cancel_time"
                  v-model.number="generalSettings.orderCancelTimeLimit"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="driver_radius" class="block text-sm font-medium text-gray-700 mb-1">
                  Driver Search Radius (km)
                </label>
                <input
                  id="driver_radius"
                  v-model.number="generalSettings.driverSearchRadius"
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div class="md:col-span-2">
                <label for="terms_conditions" class="block text-sm font-medium text-gray-700 mb-1">
                  Terms and Conditions
                </label>
                <textarea
                  id="terms_conditions"
                  v-model="generalSettings.termsConditions"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>
              <div class="md:col-span-2">
                <label for="privacy_policy" class="block text-sm font-medium text-gray-700 mb-1">
                  Privacy Policy
                </label>
                <textarea
                  id="privacy_policy"
                  v-model="generalSettings.privacyPolicy"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="updatingSettings"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {{ updatingSettings ? 'Updating...' : 'Update Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Service Modal -->
      <div v-if="editingService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Edit Service Category</h3>
            <button @click="editingService = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateService">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="edit_service_name" class="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input
                    id="edit_service_name"
                    v-model="editingService.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_service_description" class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    id="edit_service_description"
                    v-model="editingService.description"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_service_icon" class="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Lucide Icon Name)
                  </label>
                  <input
                    id="edit_service_icon"
                    v-model="editingService.icon"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_service_base_price" class="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (₱)
                  </label>
                  <input
                    id="edit_service_base_price"
                    v-model.number="editingService.base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div class="md:col-span-2">
                  <label for="edit_service_fields" class="block text-sm font-medium text-gray-700 mb-1">
                    Required Fields (JSON format)
                  </label>
                  <textarea
                    id="edit_service_fields"
                    v-model="editingService.required_fields"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div class="flex items-center">
                  <input
                    id="edit_service_active"
                    v-model="editingService.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label for="edit_service_active" class="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>
              <div class="mt-6 flex space-x-2">
                <button
                  type="submit"
                  :disabled="updatingService"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {{ updatingService ? 'Updating...' : 'Update Service' }}
                </button>
                <button
                  type="button"
                  @click="editingService = null"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Promo Modal -->
      <div v-if="editingPromo" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Edit Promotional Offer</h3>
            <button @click="editingPromo = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="updatePromo">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="edit_promo_code" class="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                  </label>
                  <input
                    id="edit_promo_code"
                    v-model="editingPromo.code"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_promo_title" class="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="edit_promo_title"
                    v-model="editingPromo.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div class="md:col-span-2">
                  <label for="edit_promo_description" class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit_promo_description"
                    v-model="editingPromo.description"
                    rows="3"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <label for="edit_promo_type" class="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    id="edit_promo_type"
                    v-model="editingPromo.discount_type"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label for="edit_promo_value" class="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    id="edit_promo_value"
                    v-model.number="editingPromo.discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_promo_min_order" class="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount (₱)
                  </label>
                  <input
                    id="edit_promo_min_order"
                    v-model.number="editingPromo.min_order_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_promo_max_discount" class="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Discount (₱)
                  </label>
                  <input
                    id="edit_promo_max_discount"
                    v-model.number="editingPromo.max_discount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_promo_usage_limit" class="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    id="edit_promo_usage_limit"
                    v-model.number="editingPromo.usage_limit"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_promo_start_date" class="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="edit_promo_start_date"
                    v-model="editingPromo.start_date"
                    type="datetime-local"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label for="edit_promo_end_date" class="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    id="edit_promo_end_date"
                    v-model="editingPromo.end_date"
                    type="datetime-local"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    id="edit_promo_active"
                    v-model="editingPromo.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label for="edit_promo_active" class="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>
              <div class="mt-6 flex space-x-2">
                <button
                  type="submit"
                  :disabled="updatingPromo"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {{ updatingPromo ? 'Updating...' : 'Update Promo' }}
                </button>
                <button
                  type="button"
                  @click="editingPromo = null"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Edit, Eye, EyeOff, Trash2, QrCode, X,
  UtensilsCrossed, Package, Pill, ShoppingCart, Gift, MapPin
} from 'lucide-vue-next'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'
import FileUploader from '@/components/FileUploader.vue'

const { supabase } = useSupabase()
const toast = useToast()

const activeTab = ref('services')
const loadingServices = ref(false)
const loadingPromos = ref(false)
const addingService = ref(false)
const addingPromo = ref(false)
const updatingService = ref(false)
const updatingPromo = ref(false)
const updatingSettings = ref(false)

const serviceCategories = ref([])
const promos = ref([])
const editingService = ref(null)
const editingPromo = ref(null)

const serviceForm = ref({
  name: '',
  description: '',
  icon: '',
  basePrice: 0,
  requiredFields: '',
  isActive: true
})

const promoForm = ref({
  code: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscount: null,
  usageLimit: null,
  startDate: '',
  endDate: '',
  isActive: true
})

const qrCodes = ref({
  gcash: '',
  paymaya: '',
  gotyme: ''
})

const generalSettings = ref({
  appName: 'BroomTech Delivery',
  supportEmail: 'support@broomtech.com',
  supportPhone: '+63 912 345 6789',
  adminCode: 'BROOMTECH2024',
  orderCancelTimeLimit: 30,
  driverSearchRadius: 10,
  termsConditions: '',
  privacyPolicy: ''
})

// Icon components mapping
const iconComponents = {
  UtensilsCrossed,
  Package,
  Pill,
  ShoppingCart,
  Gift,
  MapPin
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Package
}

const loadServiceCategories = async () => {
  try {
    loadingServices.value = true
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    serviceCategories.value = data || []
  } catch (error) {
    console.error('Error loading service categories:', error)
    toast.error('Failed to load service categories')
  } finally {
    loadingServices.value = false
  }
}

const addServiceCategory = async () => {
  try {
    addingService.value = true

    const slug = serviceForm.value.name.toLowerCase().replace(/\s+/g, '_')
    
    const { error } = await supabase
      .from('service_categories')
      .insert({
        name: serviceForm.value.name,
        slug,
        description: serviceForm.value.description,
        icon: serviceForm.value.icon,
        base_price: serviceForm.value.basePrice,
        required_fields: serviceForm.value.requiredFields,
        is_active: serviceForm.value.isActive
      })

    if (error) throw error

    toast.success('Service category added successfully!')
    serviceForm.value = {
      name: '',
      description: '',
      icon: '',
      basePrice: 0,
      requiredFields: '',
      isActive: true
    }
    await loadServiceCategories()
  } catch (error) {
    console.error('Error adding service category:', error)
    toast.error('Failed to add service category')
  } finally {
    addingService.value = false
  }
}

const editService = (service) => {
  editingService.value = { ...service }
  if (typeof editingService.value.required_fields === 'object') {
    editingService.value.required_fields = JSON.stringify(editingService.value.required_fields)
  }
}

const updateService = async () => {
  try {
    updatingService.value = true

    const slug = editingService.value.name.toLowerCase().replace(/\s+/g, '_')
    
    const { error } = await supabase
      .from('service_categories')
      .update({
        name: editingService.value.name,
        slug,
        description: editingService.value.description,
        icon: editingService.value.icon,
        base_price: editingService.value.base_price,
        required_fields: editingService.value.required_fields,
        is_active: editingService.value.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingService.value.id)

    if (error) throw error

    toast.success('Service category updated successfully!')
    editingService.value = null
    await loadServiceCategories()
  } catch (error) {
    console.error('Error updating service category:', error)
    toast.error('Failed to update service category')
  } finally {
    updatingService.value = false
  }
}

const toggleServiceStatus = async (serviceId, isActive) => {
  try {
    const { error } = await supabase
      .from('service_categories')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)

    if (error) throw error

    toast.success(`Service ${isActive ? 'activated' : 'deactivated'} successfully!`)
    await loadServiceCategories()
  } catch (error) {
    console.error('Error updating service status:', error)
    toast.error('Failed to update service status')
  }
}

const deleteService = async (serviceId) => {
  if (!confirm('Are you sure you want to delete this service category?')) return

  try {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', serviceId)

    if (error) throw error

    toast.success('Service category deleted successfully!')
    await loadServiceCategories()
  } catch (error) {
    console.error('Error deleting service category:', error)
    toast.error('Failed to delete service category')
  }
}

const loadQRCodes = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', 'payment_qr')

    if (error) throw error

    if (data) {
      data.forEach(setting => {
        qrCodes.value[setting.key] = setting.value
      })
    }
  } catch (error) {
    console.error('Error loading QR codes:', error)
  }
}

const updateQRCode = async (provider, url) => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        category: 'payment_qr',
        key: provider,
        value: url,
        updated_at: new Date().toISOString()
      }, { onConflict: 'category,key' })

    if (error) throw error

    qrCodes.value[provider] = url
    toast.success(`${provider.toUpperCase()} QR code updated successfully!`)
  } catch (error) {
    console.error('Error updating QR code:', error)
    toast.error('Failed to update QR code')
  }
}

const loadPromos = async () => {
  try {
    loadingPromos.value = true
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    promos.value = data || []
  } catch (error) {
    console.error('Error loading promos:', error)
    toast.error('Failed to load promotional offers')
  } finally {
    loadingPromos.value = false
  }
}

const addPromo = async () => {
  try {
    addingPromo.value = true

    const { error } = await supabase
      .from('promos')
      .insert({
        code: promoForm.value.code.toUpperCase(),
        title: promoForm.value.title,
        description: promoForm.value.description,
        discount_type: promoForm.value.discountType,
        discount_value: promoForm.value.discountValue,
        min_order_amount: promoForm.value.minOrderAmount || null,
        max_discount: promoForm.value.maxDiscount || null,
        usage_limit: promoForm.value.usageLimit || null,
        usage_count: 0,
        start_date: promoForm.value.startDate,
        end_date: promoForm.value.endDate,
        is_active: promoForm.value.isActive
      })

    if (error) throw error

    toast.success('Promotional offer created successfully!')
    promoForm.value = {
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: null,
      usageLimit: null,
      startDate: '',
      endDate: '',
      isActive: true
    }
    await loadPromos()
  } catch (error) {
    console.error('Error adding promo:', error)
    toast.error('Failed to create promotional offer')
  } finally {
    addingPromo.value = false
  }
}

const editPromo = (promo) => {
  editingPromo.value = { ...promo }
  // Format dates for datetime-local input
  if (editingPromo.value.start_date) {
    editingPromo.value.start_date = new Date(editingPromo.value.start_date).toISOString().slice(0, 16)
  }
  if (editingPromo.value.end_date) {
    editingPromo.value.end_date = new Date(editingPromo.value.end_date).toISOString().slice(0, 16)
  }
}

const updatePromo = async () => {
  try {
    updatingPromo.value = true

    const { error } = await supabase
      .from('promos')
      .update({
        code: editingPromo.value.code.toUpperCase(),
        title: editingPromo.value.title,
        description: editingPromo.value.description,
        discount_type: editingPromo.value.discount_type,
        discount_value: editingPromo.value.discount_value,
        min_order_amount: editingPromo.value.min_order_amount || null,
        max_discount: editingPromo.value.max_discount || null,
        usage_limit: editingPromo.value.usage_limit || null,
        start_date: editingPromo.value.start_date,
        end_date: editingPromo.value.end_date,
        is_active: editingPromo.value.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingPromo.value.id)

    if (error) throw error

    toast.success('Promotional offer updated successfully!')
    editingPromo.value = null
    await loadPromos()
  } catch (error) {
    console.error('Error updating promo:', error)
    toast.error('Failed to update promotional offer')
  } finally {
    updatingPromo.value = false
  }
}

const togglePromoStatus = async (promoId, isActive) => {
  try {
    const { error } = await supabase
      .from('promos')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', promoId)

    if (error) throw error

    toast.success(`Promo ${isActive ? 'activated' : 'deactivated'} successfully!`)
    await loadPromos()
  } catch (error) {
    console.error('Error updating promo status:', error)
    toast.error('Failed to update promo status')
  }
}

const deletePromo = async (promoId) => {
  if (!confirm('Are you sure you want to delete this promotional offer?')) return

  try {
    const { error } = await supabase
      .from('promos')
      .delete()
      .eq('id', promoId)

    if (error) throw error

    toast.success('Promotional offer deleted successfully!')
    await loadPromos()
  } catch (error) {
    console.error('Error deleting promo:', error)
    toast.error('Failed to delete promotional offer')
  }
}

const getPromoStatus = (promo) => {
  const now = new Date()
  const startDate = new Date(promo.start_date)
  const endDate = new Date(promo.end_date)

  if (!promo.is_active) return 'Inactive'
  if (now < startDate) return 'Scheduled'
  if (now > endDate) return 'Expired'
  if (promo.usage_limit && promo.usage_count >= promo.usage_limit) return 'Used Up'
  return 'Active'
}

const getPromoStatusColor = (promo) => {
  const status = getPromoStatus(promo)
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Scheduled': 'bg-blue-100 text-blue-800',
    'Expired': 'bg-red-100 text-red-800',
    'Used Up': 'bg-yellow-100 text-yellow-800',
    'Inactive': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const loadGeneralSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', 'general')

    if (error) throw error

    if (data) {
      data.forEach(setting => {
        if (setting.key === 'orderCancelTimeLimit' || setting.key === 'driverSearchRadius') {
          generalSettings.value[setting.key] = parseFloat(setting.value)
        } else {
          generalSettings.value[setting.key] = setting.value
        }
      })
    }
  } catch (error) {
    console.error('Error loading general settings:', error)
  }
}

const updateGeneralSettings = async () => {
  try {
    updatingSettings.value = true

    // Update each setting
    const updates = Object.entries(generalSettings.value).map(([key, value]) => ({
      category: 'general',
      key,
      value: value.toString(),
      updated_at: new Date().toISOString()
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('system_settings')
        .upsert(update, { onConflict: 'category,key' })

      if (error) throw error
    }

    toast.success('General settings updated successfully!')
  } catch (error) {
    console.error('Error updating general settings:', error)
    toast.error('Failed to update general settings')
  } finally {
    updatingSettings.value = false
  }
}

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await loadServiceCategories()
  await loadQRCodes()
  await loadPromos()
  await loadGeneralSettings()
})
</script>
