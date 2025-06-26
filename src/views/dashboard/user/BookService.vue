<template>
<div class="min-h-screen bg-gray-50">
  <!-- Mobile Header -->
  <div class="lg:hidden bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between px-4 py-3">
      <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">Book Service</h1>
      <div class="w-10"></div>
    </div>
  </div>

  <div class="flex">
    <!-- Sidebar -->
    <Sidebar :isOpen="sidebarOpen" @close="closeSidebar" />

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64">
      <div class="p-4 lg:p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
          <p class="text-gray-600">Choose from our wide range of delivery services</p>
        </div>

        <!-- Step Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div class="flex items-center">
              <div class="flex items-center text-green-600">
                <div class="flex items-center justify-center w-8 h-8 border-2 border-green-600 rounded-full bg-green-600 text-white text-sm font-medium">
                  1
                </div>
                <span class="ml-2 text-sm font-medium">Select Service</span>
              </div>
              <div class="flex-1 h-0.5 mx-4" :class="currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'"></div>
              <div class="flex items-center" :class="currentStep >= 2 ? 'text-green-600' : 'text-gray-400'">
                <div class="flex items-center justify-center w-8 h-8 border-2 rounded-full text-sm font-medium" 
                     :class="currentStep >= 2 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'">
                  2
                </div>
                <span class="ml-2 text-sm font-medium">Service Details</span>
              </div>
              <div class="flex-1 h-0.5 mx-4" :class="currentStep >= 3 ? 'bg-green-600' : 'bg-gray-300'"></div>
              <div class="flex items-center" :class="currentStep >= 3 ? 'text-green-600' : 'text-gray-400'">
                <div class="flex items-center justify-center w-8 h-8 border-2 rounded-full text-sm font-medium"
                     :class="currentStep >= 3 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'">
                  3
                </div>
                <span class="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Service Selection -->
        <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Choose Your Service</h2>
          
          <!-- View Toggle -->
          <div class="flex justify-end mb-6">
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Grid
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                List
              </button>
            </div>
          </div>

          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              class="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              :class="{ 'border-green-500 bg-green-50': selectedService?.id === service.id }"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 rounded-lg flex items-center justify-center mb-4" :class="service.iconBg">
                  <svg class="w-8 h-8" :class="service.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.iconPath"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ service.name }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ service.description }}</p>
                <div class="text-green-600 font-semibold">Starting at ₱{{ service.basePrice }}</div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="space-y-4">
            <div
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              class="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              :class="{ 'border-green-500 bg-green-50': selectedService?.id === service.id }"
            >
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4" :class="service.iconBg">
                  <svg class="w-6 h-6" :class="service.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.iconPath"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ service.name }}</h3>
                  <p class="text-sm text-gray-600">{{ service.description }}</p>
                </div>
                <div class="text-green-600 font-semibold">₱{{ service.basePrice }}+</div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end mt-8">
            <button
              @click="nextStep"
              :disabled="!selectedService"
              class="btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': !selectedService }"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Step 2: Service Details -->
        <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Service Details</h2>
            <button @click="previousStep" class="btn-secondary">Back</button>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6">
            <!-- Service Type Display -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4" :class="selectedService?.iconBg">
                  <svg class="w-6 h-6" :class="selectedService?.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="selectedService?.iconPath"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ selectedService?.name }}</h3>
                  <p class="text-sm text-gray-600">{{ selectedService?.description }}</p>
                </div>
              </div>
            </div>

            <!-- Address Fields with Google Maps Integration -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Pickup Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                <div class="space-y-2">
                  <div class="relative">
                    <input
                      ref="pickupInput"
                      v-model="orderForm.pickupAddress"
                      type="text"
                      required
                      placeholder="Enter pickup address"
                      class="input-field pr-10"
                      @input="handleAddressInput('pickup')"
                      @focus="initializeAutocomplete('pickup')"
                    />
                    <button
                      type="button"
                      @click="getCurrentLocation('pickup')"
                      :disabled="gettingLocation"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg v-if="!gettingLocation" class="w-5 h-5 text-gray-400 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    </button>
                  </div>
                  <!-- My Location Button for Pickup -->
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="getCurrentLocation('pickup')"
                      :disabled="gettingLocation"
                      class="flex-1 flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <svg v-if="!gettingLocation" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      {{ gettingLocation ? 'Getting Location...' : 'Use My Location' }}
                    </button>
                    <button
                      type="button"
                      @click="showLocationTips"
                      class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                      title="Location Tips"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Delivery Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <div class="space-y-2">
                  <div class="relative">
                    <input
                      ref="deliveryInput"
                      v-model="orderForm.deliveryAddress"
                      type="text"
                      required
                      placeholder="Enter delivery address"
                      class="input-field pr-10"
                      @input="handleAddressInput('delivery')"
                      @focus="initializeAutocomplete('delivery')"
                    />
                    <button
                      type="button"
                      @click="getCurrentLocation('delivery')"
                      :disabled="gettingLocation"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg v-if="!gettingLocation" class="w-5 h-5 text-gray-400 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    </button>
                  </div>
                  <!-- My Location Button for Delivery -->
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="getCurrentLocation('delivery')"
                      :disabled="gettingLocation"
                      class="flex-1 flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <svg v-if="!gettingLocation" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      {{ gettingLocation ? 'Getting Location...' : 'Use My Location' }}
                    </button>
                    <button
                      type="button"
                      @click="showLocationTips"
                      class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                      title="Location Tips"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Google Maps Container - Show immediately in step 2 -->
            <div v-if="currentStep === 2" class="h-96 bg-gray-200 rounded-lg mb-6">
              <div id="booking-map" class="w-full h-full rounded-lg"></div>
            </div>

            <!-- Dynamic Service-Specific Fields -->
            
            <!-- Food Delivery -->
            <div v-if="selectedService?.id === 'food_delivery'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                <input
                  v-model="orderForm.restaurantName"
                  type="text"
                  placeholder="Enter restaurant name"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Food Order Details</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="4"
                  placeholder="List all food items, quantities, special instructions..."
                  class="input-field"
                  required
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Order Value</label>
                <input
                  v-model="orderForm.orderValue"
                  type="number"
                  placeholder="₱0.00"
                  class="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <!-- Grocery -->
            <div v-if="selectedService?.id === 'grocery'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Grocery Store</label>
                <select v-model="orderForm.groceryStore" class="input-field" required>
                  <option value="">Select grocery store</option>
                  <option value="SM Supermarket">SM Supermarket</option>
                  <option value="Robinsons Supermarket">Robinsons Supermarket</option>
                  <option value="Puregold">Puregold</option>
                  <option value="Mercury Drug">Mercury Drug</option>
                  <option value="7-Eleven">7-Eleven</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Grocery List</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="5"
                  placeholder="List all items with quantities:&#10;• 1kg rice&#10;• 2 bottles cooking oil&#10;• Fresh vegetables (tomato, onion)&#10;• 1 dozen eggs"
                  class="input-field"
                  required
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <select v-model="orderForm.budgetRange" class="input-field">
                  <option value="">Select budget range</option>
                  <option value="₱500-1000">₱500 - ₱1,000</option>
                  <option value="₱1000-2000">₱1,000 - ₱2,000</option>
                  <option value="₱2000-3000">₱2,000 - ₱3,000</option>
                  <option value="₱3000+">₱3,000+</option>
                </select>
              </div>
            </div>

            <!-- Pay Bills -->
            <div v-if="selectedService?.id === 'pay_bills'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bill Type</label>
                  <select v-model="orderForm.billType" class="input-field" required>
                    <option value="">Select bill type</option>
                    <option value="electricity">Electricity (Meralco)</option>
                    <option value="water">Water (Maynilad/Manila Water)</option>
                    <option value="internet">Internet/Cable</option>
                    <option value="phone">Phone/Mobile</option>
                    <option value="government">Government Fees</option>
                    <option value="insurance">Insurance</option>
                    <option value="loan">Loan Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    v-model="orderForm.accountNumber"
                    type="text"
                    placeholder="Enter account number"
                    class="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount to Pay</label>
                <input
                  v-model="orderForm.billAmount"
                  type="number"
                  placeholder="₱0.00"
                  class="input-field"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Location</label>
                <select v-model="orderForm.paymentLocation" class="input-field" required>
                  <option value="">Select payment center</option>
                  <option value="bayad_center">Bayad Center</option>
                  <option value="mlhuillier">M Lhuillier</option>
                  <option value="cebuana">Cebuana Lhuillier</option>
                  <option value="sm_bills">SM Bills Payment</option>
                  <option value="robinson_bills">Robinsons Bills Payment</option>
                  <option value="other">Other (specify in notes)</option>
                </select>
              </div>
            </div>

            <!-- Medicines -->
            <div v-if="selectedService?.id === 'medicines'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pharmacy</label>
                <select v-model="orderForm.pharmacy" class="input-field" required>
                  <option value="">Select pharmacy</option>
                  <option value="mercury_drug">Mercury Drug</option>
                  <option value="watsons">Watsons</option>
                  <option value="rose_pharmacy">Rose Pharmacy</option>
                  <option value="generika">Generika Drugstore</option>
                  <option value="southstar_drug">SouthStar Drug</option>
                  <option value="other">Other (specify in notes)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicine List</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="4"
                  placeholder="List medicines needed:&#10;• Paracetamol 500mg (1 box)&#10;• Amoxicillin 250mg (1 bottle)&#10;• Vitamins (specify brand)"
                  class="input-field"
                  required
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prescription Upload</label>
                <FileUploader
                  accept="image/*,.pdf"
                  :multiple="true"
                  bucket="prescriptions"
                  folder="user-prescriptions"
                  @uploaded="handlePrescriptionUpload"
                  @error="handleUploadError"
                />
                <p class="mt-1 text-xs text-gray-500">Upload prescription images or PDF (required for prescription medicines)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                <input
                  v-model="orderForm.patientName"
                  type="text"
                  placeholder="Enter patient name"
                  class="input-field"
                  required
                />
              </div>
            </div>

            <!-- Pabili (General Purchase) -->
            <div v-if="selectedService?.id === 'pabili'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Store/Location</label>
                <input
                  v-model="orderForm.storeName"
                  type="text"
                  placeholder="Enter store name or location"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Items to Purchase</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="4"
                  placeholder="Describe what you need to buy:&#10;• Specific items, brands, sizes&#10;• Alternatives if not available&#10;• Budget constraints"
                  class="input-field"
                  required
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
                <input
                  v-model="orderForm.estimatedBudget"
                  type="number"
                  placeholder="₱0.00"
                  class="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <!-- Pickup Service -->
            <div v-if="selectedService?.id === 'pickup'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Item Description</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="3"
                  placeholder="Describe the item(s) to be picked up (size, weight, fragility, etc.)"
                  class="input-field"
                  required
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Item Weight (kg)</label>
                  <input
                    v-model="orderForm.itemWeight"
                    type="number"
                    placeholder="0.0"
                    class="input-field"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Item Value</label>
                  <input
                    v-model="orderForm.itemValue"
                    type="number"
                    placeholder="₱0.00"
                    class="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label class="flex items-center">
                  <input
                    v-model="orderForm.isFragile"
                    type="checkbox"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Item is fragile/requires special handling</span>
                </label>
              </div>
            </div>

            <!-- Surprise Delivery -->
            <div v-if="selectedService?.id === 'surprise_delivery'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Surprise Type</label>
                <select v-model="orderForm.surpriseType" class="input-field" required>
                  <option value="">Select surprise type</option>
                  <option value="flowers">Flowers</option>
                  <option value="cake">Cake/Pastries</option>
                  <option value="gift">Gift Items</option>
                  <option value="food">Food Surprise</option>
                  <option value="custom">Custom Surprise</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Surprise Details</label>
                <textarea
                  v-model="orderForm.itemsDescription"
                  rows="4"
                  placeholder="Describe the surprise:&#10;• What to buy/deliver&#10;• Occasion (birthday, anniversary, etc.)&#10;• Special message to include&#10;• Budget range"
                  class="input-field"
                  required
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input
                  v-model="orderForm.recipientName"
                  type="text"
                  placeholder="Enter recipient's name"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Special Message</label>
                <textarea
                  v-model="orderForm.specialMessage"
                  rows="2"
                  placeholder="Message to include with the surprise"
                  class="input-field"
                ></textarea>
              </div>
            </div>

            <!-- Common Fields -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
              <textarea
                v-model="orderForm.specialInstructions"
                rows="3"
                placeholder="Any special instructions for the driver (contact person, landmarks, delivery time preferences, etc.)"
                class="input-field"
              ></textarea>
            </div>

            <!-- Additional Images Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Images (Optional)</label>
              <FileUploader
                accept="image/*"
                :multiple="true"
                bucket="order-images"
                folder="user-uploads"
                @uploaded="handleImageUpload"
                @error="handleUploadError"
              />
              <p class="mt-1 text-xs text-gray-500">Upload reference images, receipts, or any helpful photos</p>
            </div>

            <!-- AI Dynamic Pricing Display -->
            <div v-if="pricingCalculated" class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                AI Dynamic Pricing
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Base Fee:</span>
                    <span class="font-medium">₱{{ pricing.baseFee }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Distance ({{ distance.toFixed(1) }} km):</span>
                    <span class="font-medium">₱{{ (pricing.deliveryFee - pricing.baseFee).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Service Multiplier:</span>
                    <span class="font-medium">{{ (pricing.factors.multiplier || 1).toFixed(1) }}x</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div v-if="pricing.factors.isPeakHour" class="flex justify-between text-orange-600">
                    <span>Peak Hour Surcharge:</span>
                    <span class="font-medium">+20%</span>
                  </div>
                  <div class="flex justify-between text-blue-600">
                    <span>Driver Availability:</span>
                    <span class="font-medium">{{ pricing.factors.driverCount }} online</span>
                  </div>
                  <div class="flex justify-between text-purple-600">
                    <span>Demand Factor:</span>
                    <span class="font-medium">{{ getDemandLevel(pricing.factors.driverCount) }}</span>
                  </div>
                </div>
              </div>
              <div class="border-t border-green-300 pt-3 mt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900">Total Delivery Fee:</span>
                  <span class="text-2xl font-bold text-green-600">₱{{ pricing.totalAmount }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  *Final price may vary based on actual items and additional services
                </p>
              </div>
            </div>

            <div class="flex justify-between">
              <button type="button" @click="previousStep" class="btn-secondary">Back</button>
              <button
                type="submit"
                :disabled="!orderForm.pickupAddress || !orderForm.deliveryAddress || calculating"
                class="btn-primary flex items-center"
              >
                <div v-if="calculating" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ calculating ? 'Calculating...' : 'Continue to Payment' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Payment -->
        <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Payment Method</h2>
            <button @click="previousStep" class="btn-secondary">Back</button>
          </div>

          <!-- Order Summary -->
          <div class="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Service:</span>
                  <span class="font-medium">{{ selectedService?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Distance:</span>
                  <span class="font-medium">{{ distance.toFixed(1) }} km</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Estimated Duration:</span>
                  <span class="font-medium">{{ estimatedDuration }} mins</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">From:</span>
                  <span class="font-medium text-xs">{{ orderForm.pickupAddress.substring(0, 30) }}...</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">To:</span>
                  <span class="font-medium text-xs">{{ orderForm.deliveryAddress.substring(0, 30) }}...</span>
                </div>
              </div>
            </div>
            <div class="border-t border-gray-300 pt-3 mt-3">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span class="text-2xl font-bold text-green-600">₱{{ pricing.totalAmount }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="space-y-4 mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
            
            <!-- GCash -->
            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="GCash"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div class="ml-3 flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-sm font-bold text-blue-600">G</span>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900">GCash</span>
                    <p class="text-xs text-gray-500">Pay via GCash QR Code - Instant & Secure</p>
                  </div>
                </div>
              </label>
              <div v-if="orderForm.paymentMethod === 'GCash'" class="mt-4 pl-7">
                <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <div class="w-64 h-64 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-48 h-48 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <div class="text-white text-center">
                          <div class="text-2xl font-bold mb-2">GCash</div>
                          <div class="text-xs">QR Code</div>
                          <div class="text-xs mt-2">₱{{ pricing.totalAmount }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-900">Scan QR code with GCash app</p>
                    <p class="text-xs text-gray-500">Account: BroomTech Delivery</p>
                    <p class="text-xs text-gray-500">Reference: {{ generatePaymentReference() }}</p>
                    <p class="text-lg font-semibold text-green-600">Amount: ₱{{ pricing.totalAmount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- PayMaya -->
            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="PayMaya"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div class="ml-3 flex items-center">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-sm font-bold text-green-600">PM</span>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900">PayMaya</span>
                    <p class="text-xs text-gray-500">Pay via PayMaya QR Code - Fast & Reliable</p>
                  </div>
                </div>
              </label>
              <div v-if="orderForm.paymentMethod === 'PayMaya'" class="mt-4 pl-7">
                <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <div class="w-64 h-64 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-48 h-48 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <div class="text-white text-center">
                          <div class="text-2xl font-bold mb-2">PayMaya</div>
                          <div class="text-xs">QR Code</div>
                          <div class="text-xs mt-2">₱{{ pricing.totalAmount }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-900">Scan QR code with PayMaya app</p>
                    <p class="text-xs text-gray-500">Account: BroomTech Delivery</p>
                    <p class="text-xs text-gray-500">Reference: {{ generatePaymentReference() }}</p>
                    <p class="text-lg font-semibold text-green-600">Amount: ₱{{ pricing.totalAmount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- GoTyme -->
            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="GoTyme"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div class="ml-3 flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-sm font-bold text-purple-600">GT</span>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900">GoTyme Bank</span>
                    <p class="text-xs text-gray-500">Pay via GoTyme QR Code - New & Convenient</p>
                  </div>
                </div>
              </label>
              <div v-if="orderForm.paymentMethod === 'GoTyme'" class="mt-4 pl-7">
                <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <div class="w-64 h-64 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-48 h-48 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <div class="text-white text-center">
                          <div class="text-2xl font-bold mb-2">GoTyme</div>
                          <div class="text-xs">QR Code</div>
                          <div class="text-xs mt-2">₱{{ pricing.totalAmount }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-900">Scan QR code with GoTyme app</p>
                    <p class="text-xs text-gray-500">Account: BroomTech Delivery</p>
                    <p class="text-xs text-gray-500">Reference: {{ generatePaymentReference() }}</p>
                    <p class="text-lg font-semibold text-green-600">Amount: ₱{{ pricing.totalAmount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cash on Delivery -->
            <div class="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  value="COD"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div class="ml-3 flex items-center">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900">Cash on Delivery</span>
                    <p class="text-xs text-gray-500">Pay when your order is delivered - No advance payment needed</p>
                  </div>
                </div>
              </label>
              <div v-if="orderForm.paymentMethod === 'COD'" class="mt-4 pl-7">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-yellow-800">Cash on Delivery Selected</p>
                      <p class="text-xs text-yellow-600">Please prepare exact amount: ₱{{ pricing.totalAmount }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Proof Upload (for non-COD) -->
          <div v-if="orderForm.paymentMethod && orderForm.paymentMethod !== 'COD'" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload Payment Proof</label>
            <FileUploader
              accept="image/*,.pdf"
              :multiple="false"
              bucket="payment-proofs"
              folder="user-payments"
              @uploaded="handlePaymentProofUpload"
              @error="handleUploadError"
            />
            <p class="mt-1 text-xs text-gray-500">
              Upload screenshot or receipt of your {{ orderForm.paymentMethod }} payment
            </p>
            
            <!-- Show upload status -->
            <div v-if="!paymentProofUrl" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p class="text-sm text-yellow-700 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Please select a file and click Upload to proceed
              </p>
            </div>
            
            <div v-if="paymentProofUrl" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p class="text-sm text-green-700 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Payment proof uploaded successfully
              </p>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-start">
              <input
                id="agreeTerms"
                v-model="orderForm.agreeTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
              />
              <label for="agreeTerms" class="ml-3 block text-sm text-gray-900">
                I agree to the
                <a href="#" class="text-green-600 hover:text-green-500 underline">Terms and Conditions</a>
                and understand that:
                <ul class="mt-2 text-xs text-gray-600 space-y-1">
                  <li>• My order will be reviewed and approved before assignment to a driver</li>
                  <li>• Payment verification may take 5-15 minutes for digital payments</li>
                  <li>• I can cancel my order within 30 seconds after placing it</li>
                  <li>• Delivery times are estimates and may vary based on traffic and availability</li>
                </ul>
              </label>
            </div>
          </div>

          <div class="flex justify-between">
            <button type="button" @click="previousStep" class="btn-secondary">Back</button>
            <button
              @click="submitOrder"
              :disabled="!orderForm.paymentMethod || !orderForm.agreeTerms || submitting || (orderForm.paymentMethod !== 'COD' && !paymentProofUrl)"
              class="btn-primary flex items-center"
              :class="{ 'opacity-50 cursor-not-allowed': !orderForm.paymentMethod || !orderForm.agreeTerms || (orderForm.paymentMethod !== 'COD' && !paymentProofUrl) }"
            >
              <div v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ submitting ? 'Placing Order...' : 'Place Order' }}
            </button>
          </div>
        </div>

        <!-- Order Success Modal -->
        <div
          v-if="orderSuccess"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div class="bg-white rounded-lg max-w-md w-full p-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p class="text-sm text-gray-600 mb-4">
                Your order #{{ orderNumber }} has been submitted and is pending approval.
              </p>
              
              <!-- Order Barcode -->
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <BarcodeViewer :orderNumber="orderNumber" />
              </div>
              
              <div class="space-y-3">
                <button
                  @click="goToOrders"
                  class="w-full btn-primary"
                >
                  View My Orders
                </button>
                <button
                  @click="bookAnother"
                  class="w-full btn-secondary"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Chat Support -->
  <ChatBox />
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useSupabase } from '@/composables/useSupabase'
import { useMap } from '@/composables/useMap'
import { useDynamicPricing } from '@/composables/useDynamicPricing'
import { useToast } from 'vue-toastification'
import Sidebar from '@/components/Sidebar.vue'
import FileUploader from '@/components/FileUploader.vue'
import BarcodeViewer from '@/components/BarcodeViewer.vue'
import ChatBox from '@/components/ChatBox.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { userProfile } = useAuth()
const { select, insert } = useSupabase()
const { initializeMap, addMarker, calculateDistance, geocodeAddress, getCurrentLocation: getLocation } = useMap()
const { calculateDeliveryFee } = useDynamicPricing()

// Refs
const pickupInput = ref(null)
const deliveryInput = ref(null)

// Data
const sidebarOpen = ref(false)
const currentStep = ref(1)
const viewMode = ref('grid')
const showMap = ref(false)
const calculating = ref(false)
const submitting = ref(false)
const pricingCalculated = ref(false)
const orderSuccess = ref(false)
const distance = ref(0)
const estimatedDuration = ref(0)
const orderNumber = ref('')

const selectedService = ref(null)
const uploadedImages = ref([])
const prescriptionUrls = ref([])
const paymentProofUrl = ref('')

let map = null
let pickupMarker = null
let deliveryMarker = null
let pickupAutocomplete = null
let deliveryAutocomplete = null
let directionsRenderer = null

const services = ref([
  {
    id: 'food_delivery',
    name: 'Food Delivery',
    description: 'Order food from restaurants and have it delivered to you',
    basePrice: 50,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 'grocery',
    name: 'Grocery',
    description: 'Shop for groceries and household items',
    basePrice: 70,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  {
    id: 'pay_bills',
    name: 'Pay Bills',
    description: 'Pay your bills at payment centers',
    basePrice: 40,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    id: 'medicines',
    name: 'Medicines',
    description: 'Buy medicines and health products from pharmacies',
    basePrice: 60,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  {
    id: 'pabili',
    name: 'Pabili',
    description: 'General shopping and errands service',
    basePrice: 55,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  {
    id: 'pickup',
    name: 'Pick-up',
    description: 'Pick up and deliver items from one location to another',
    basePrice: 55,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath: 'M5 8h14l-1 9H6L5 8zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v2'
  },
  {
    id: 'surprise_delivery',
    name: 'Surprise Delivery',
    description: 'Send surprise gifts and special deliveries',
    basePrice: 65,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    iconPath: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
  }
])

const orderForm = reactive({
  pickupAddress: '',
  deliveryAddress: '',
  pickupLat: null,
  pickupLng: null,
  deliveryLat: null,
  deliveryLng: null,
  itemsDescription: '',
  specialInstructions: '',
  
  // Food Delivery
  restaurantName: '',
  orderValue: '',
  
  // Grocery
  groceryStore: '',
  budgetRange: '',
  
  // Pay Bills
  billType: '',
  accountNumber: '',
  billAmount: '',
  paymentLocation: '',
  
  // Medicines
  pharmacy: '',
  patientName: '',
  
  // Pabili
  storeName: '',
  estimatedBudget: '',
  
  // Pickup
  itemWeight: '',
  itemValue: '',
  isFragile: false,
  
  // Surprise Delivery
  surpriseType: '',
  recipientName: '',
  specialMessage: '',
  
  paymentMethod: '',
  agreeTerms: false
})

const pricing = reactive({
  baseFee: 0,
  deliveryFee: 0,
  totalAmount: 0,
  factors: {}
})

// Add to data section
const gettingLocation = ref(false)

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = true
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const selectService = (service) => {
  selectedService.value = service
}

const nextStep = async () => {
  if (currentStep.value === 1 && selectedService.value) {
    currentStep.value = 2
    await nextTick()
    initializeGoogleMaps()
  } else if (currentStep.value === 2) {
    await calculatePricing()
    if (pricingCalculated.value) {
      currentStep.value = 3
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

let initMap;
let initAutocomplete;
const initializeGoogleMaps = async () => {
  showMap.value = true
  
  // Check if Google Maps is already loaded
  if (typeof window.google !== 'undefined' && window.google.maps) {
    initMap()
    initAutocomplete()
    return
  }
  
  // Load Google Maps API with your key
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=places&callback=initGoogleMapsCallback`
  script.async = true
  script.defer = true
  
  // Create global callback
  window.initGoogleMapsCallback = () => {
    console.log('Google Maps API loaded successfully')
    initMap()
    initAutocomplete()
  }
  
  script.onerror = () => {
    console.error('Failed to load Google Maps API')
    toast.error('Failed to load maps. Please check your internet connection.')
  }
  
  document.head.appendChild(script)
}

initMap = () => {
  const mapElement = document.getElementById('booking-map')
  if (mapElement && typeof google !== 'undefined') {
    map = new google.maps.Map(mapElement, {
      center: { lat: 13.4119, lng: 121.1803 }, // Calapan City, Oriental Mindoro
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })
  }
}

initAutocomplete = () => {
  if (typeof google !== 'undefined' && pickupInput.value && deliveryInput.value) {
    // Define Calapan City bounds
    const calapanBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(13.3500, 121.1200), // Southwest
      new google.maps.LatLng(13.4700, 121.2400)  // Northeast
    )

    // Pickup autocomplete
    pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput.value, {
      componentRestrictions: { country: 'ph' },
      bounds: calapanBounds,
      strictBounds: true,
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    })
    
    pickupAutocomplete.addListener('place_changed', () => {
      const place = pickupAutocomplete.getPlace()
      if (place.geometry) {
        orderForm.pickupAddress = place.formatted_address
        orderForm.pickupLat = place.geometry.location.lat()
        orderForm.pickupLng = place.geometry.location.lng()
        updateMapMarkers()
        toast.success('Pickup location set successfully!')
      }
    })

    // Delivery autocomplete
    deliveryAutocomplete = new google.maps.places.Autocomplete(deliveryInput.value, {
      componentRestrictions: { country: 'ph' },
      bounds: calapanBounds,
      strictBounds: true,
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    })
    
    deliveryAutocomplete.addListener('place_changed', () => {
      const place = deliveryAutocomplete.getPlace()
      if (place.geometry) {
        orderForm.deliveryAddress = place.formatted_address
        orderForm.deliveryLat = place.geometry.location.lat()
        orderForm.deliveryLng = place.geometry.location.lng()
        updateMapMarkers()
        toast.success('Delivery location set successfully!')
      }
    })
  }
}

const initializeAutocomplete = (type) => {
  // This method is called when input is focused
  if (!pickupAutocomplete || !deliveryAutocomplete) {
    setTimeout(() => {
      initAutocomplete()
    }, 100)
  }
}

// Handle manual address input
const handleAddressInput = async (type) => {
  const address = type === 'pickup' ? orderForm.pickupAddress : orderForm.deliveryAddress
  
  // Only geocode if address is substantial (more than 10 characters)
  if (address && address.length > 10) {
    try {
      await geocodeAndUpdateLocation(address, type)
    } catch (error) {
      console.log('Geocoding failed for manual input:', error)
    }
  }
}

// Improved geocoding function
const geocodeAndUpdateLocation = async (address, type) => {
  if (typeof google === 'undefined') return

  const geocoder = new google.maps.Geocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({
      address: address,
      componentRestrictions: { country: 'PH' },
      region: 'PH'
    }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        // Find the best result (prefer Calapan results)
        let bestResult = results[0]
        
        const calapanResult = results.find(result => 
          result.formatted_address.toLowerCase().includes('calapan') ||
          result.formatted_address.toLowerCase().includes('oriental mindoro') ||
          result.formatted_address.includes('5200')
        )
        
        if (calapanResult) {
          bestResult = calapanResult
        }
        
        const location = bestResult.geometry.location
        
        if (type === 'pickup') {
          orderForm.pickupLat = location.lat()
          orderForm.pickupLng = location.lng()
          orderForm.pickupAddress = bestResult.formatted_address
        } else {
          orderForm.deliveryLat = location.lat()
          orderForm.deliveryLng = location.lng()
          orderForm.deliveryAddress = bestResult.formatted_address
        }
        
        updateMapMarkers()
        resolve(bestResult)
      } else {
        reject(new Error('Geocoding failed: ' + status))
      }
    })
  })
}

const updateMapMarkers = () => {
  if (!map) return

  // Clear existing markers and routes
  if (pickupMarker) pickupMarker.setMap(null)
  if (deliveryMarker) deliveryMarker.setMap(null)
  if (directionsRenderer) directionsRenderer.setMap(null)

  const bounds = new google.maps.LatLngBounds()

  // Add pickup marker
  if (orderForm.pickupLat && orderForm.pickupLng) {
    pickupMarker = new google.maps.Marker({
      position: { lat: orderForm.pickupLat, lng: orderForm.pickupLng },
      map: map,
      title: 'Pickup Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">P</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32)
      }
    })
    bounds.extend({ lat: orderForm.pickupLat, lng: orderForm.pickupLng })
  }

  // Add delivery marker
  if (orderForm.deliveryLat && orderForm.deliveryLng) {
    deliveryMarker = new google.maps.Marker({
      position: { lat: orderForm.deliveryLat, lng: orderForm.deliveryLng },
      map: map,
      title: 'Delivery Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">D</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32)
      }
    })
    bounds.extend({ lat: orderForm.deliveryLat, lng: orderForm.deliveryLng })
  }

  // Fit map to show both markers
  if (orderForm.pickupLat && orderForm.deliveryLat) {
    map.fitBounds(bounds)
    
    // Add some padding to the bounds
    setTimeout(() => {
      const currentZoom = map.getZoom()
      if (currentZoom > 16) {
        map.setZoom(16)
      }
    }, 100)
    
    // Draw route if both locations are set
    drawRoute()
  } else if (orderForm.pickupLat || orderForm.deliveryLat) {
    // If only one location is set, center on it
    const singleLocation = orderForm.pickupLat ? 
      { lat: orderForm.pickupLat, lng: orderForm.pickupLng } :
      { lat: orderForm.deliveryLat, lng: orderForm.deliveryLng }
    
    map.setCenter(singleLocation)
    map.setZoom(15)
  }
}

const drawRoute = () => {
  if (!map || !orderForm.pickupLat || !orderForm.deliveryLat) return

  const directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true, // We have custom markers
    polylineOptions: {
      strokeColor: '#10B981',
      strokeWeight: 4,
      strokeOpacity: 0.8
    }
  })

  directionsRenderer.setMap(map)

  directionsService.route({
    origin: { lat: orderForm.pickupLat, lng: orderForm.pickupLng },
    destination: { lat: orderForm.deliveryLat, lng: orderForm.deliveryLng },
    travelMode: google.maps.TravelMode.DRIVING
  }, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)
      
      // Update distance and duration
      const route = result.routes[0]
      if (route.legs[0]) {
        distance.value = route.legs[0].distance.value / 1000 // Convert to km
        estimatedDuration.value = Math.ceil(route.legs[0].duration.value / 60) // Convert to minutes
        
        console.log(`Route calculated: ${distance.value.toFixed(2)} km, ${estimatedDuration.value} minutes`)
      }
    } else {
      console.error('Directions request failed due to ' + status)
    }
  })
}

// Update the getCurrentLocation method with better accuracy handling
const getCurrentLocation = async (type) => {
  gettingLocation.value = true
  let attempts = 0
  const maxAttempts = 3
  
  const tryGetLocation = async (attempt) => {
    try {
      console.log(`Location attempt ${attempt + 1}/${maxAttempts}`)
      
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'))
          return
        }

        // Use different options based on attempt
        const options = {
          enableHighAccuracy: true,
          timeout: attempt === 0 ? 10000 : (attempt === 1 ? 15000 : 20000),
          maximumAge: 0
        }

        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          options
        )
      })

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      console.log(`GPS Location (attempt ${attempt + 1}):`, location)
      console.log('Accuracy:', position.coords.accuracy, 'meters')

      // Check accuracy - if too poor, try again or use fallback
      if (position.coords.accuracy > 1000 && attempt < maxAttempts - 1) {
        console.log(`Poor accuracy (${position.coords.accuracy}m), retrying...`)
        toast.info(`Location accuracy is poor (${Math.round(position.coords.accuracy)}m). Retrying...`)
        return await tryGetLocation(attempt + 1)
      }

      // If still poor accuracy after all attempts, ask user
      if (position.coords.accuracy > 1000) {
        const useAnyway = confirm(
          `Location accuracy is very poor (${Math.round(position.coords.accuracy)} meters). ` +
          `This may not be your exact location.\n\n` +
          `Click OK to use this location anyway, or Cancel to enter address manually.`
        )
        
        if (!useAnyway) {
          gettingLocation.value = false
          toast.info('Please enter your address manually for better accuracy')
          return
        }
      }

      // Check if location is within reasonable bounds of Philippines
      const isInPhilippines = (
        location.lat >= 4.0 && location.lat <= 21.0 &&
        location.lng >= 116.0 && location.lng <= 127.0
      )

      if (!isInPhilippines) {
        console.log('Location outside Philippines bounds')
        toast.error('Location detected outside Philippines. Please enter address manually.')
        gettingLocation.value = false
        return
      }

      // Check if location is within reasonable bounds of Calapan area
      const calapanLat = 13.4119
      const calapanLng = 121.1803
      
      // Calculate distance from Calapan center
      const latDiff = Math.abs(location.lat - calapanLat)
      const lngDiff = Math.abs(location.lng - calapanLng)
      
      // Allow reasonable range for Calapan City and surrounding areas (about 50km radius)
      const maxLatDiff = 0.45 // About 50km
      const maxLngDiff = 0.45 // About 50km
      
      let finalLocation = location
      let isNearCalapan = (latDiff <= maxLatDiff && lngDiff <= maxLngDiff)
      
      if (!isNearCalapan) {
        const useAnyway = confirm(
          `Location detected seems to be far from Calapan City area.\n\n` +
          `Detected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}\n` +
          `Distance from Calapan: ~${Math.round(Math.sqrt(latDiff*latDiff + lngDiff*lngDiff) * 111)}km\n\n` +
          `Click OK to use this location anyway, or Cancel to use Calapan City center.`
        )
        
        if (!useAnyway) {
          finalLocation = { lat: calapanLat, lng: calapanLng }
          toast.info('Using Calapan City center as location')
        } else {
          toast.warning('Using detected location outside Calapan area')
        }
      }
      
      // Use Google Maps Geocoding API for accurate address
      if (typeof google !== 'undefined') {
        const geocoder = new google.maps.Geocoder()
        
        geocoder.geocode({ 
          location: finalLocation,
          region: 'PH'
        }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            // Find the best result
            let bestResult = results[0]
            
            // Prefer results with more specific addresses
            const specificResult = results.find(result => {
              const addr = result.formatted_address.toLowerCase()
              return (
                result.types.includes('street_address') ||
                result.types.includes('premise') ||
                addr.includes('calapan') ||
                addr.includes('oriental mindoro') ||
                addr.includes('5200')
              )
            })
            
            if (specificResult) {
              bestResult = specificResult
            }
            
            console.log('Geocoded address:', bestResult.formatted_address)
            
            if (type === 'pickup') {
              orderForm.pickupAddress = bestResult.formatted_address
              orderForm.pickupLat = finalLocation.lat
              orderForm.pickupLng = finalLocation.lng
            } else {
              orderForm.deliveryAddress = bestResult.formatted_address
              orderForm.deliveryLat = finalLocation.lat
              orderForm.deliveryLng = finalLocation.lng
            }
            
            updateMapMarkers()
            
            // Show accuracy feedback
            let accuracyMessage = ''
            if (position.coords.accuracy <= 10) {
              accuracyMessage = `${type === 'pickup' ? 'Pickup' : 'Delivery'} location set with excellent accuracy (${Math.round(position.coords.accuracy)}m)`
              toast.success(accuracyMessage)
            } else if (position.coords.accuracy <= 50) {
              accuracyMessage = `${type === 'pickup' ? 'Pickup' : 'Delivery'} location set with good accuracy (${Math.round(position.coords.accuracy)}m)`
              toast.success(accuracyMessage)
            } else if (position.coords.accuracy <= 200) {
              accuracyMessage = `${type === 'pickup' ? 'Pickup' : 'Delivery'} location set with fair accuracy (${Math.round(position.coords.accuracy)}m)`
              toast.info(accuracyMessage)
            } else {
              accuracyMessage = `${type === 'pickup' ? 'Pickup' : 'Delivery'} location set with low accuracy (${Math.round(position.coords.accuracy)}m). Please verify the address.`
              toast.warning(accuracyMessage)
            }
            
          } else {
            console.error('Geocoding failed:', status)
            // Fallback: use coordinates with a generic address
            const fallbackAddress = `${finalLocation.lat.toFixed(6)}, ${finalLocation.lng.toFixed(6)} (Calapan City Area, Oriental Mindoro)`
            
            if (type === 'pickup') {
              orderForm.pickupAddress = fallbackAddress
              orderForm.pickupLat = finalLocation.lat
              orderForm.pickupLng = finalLocation.lng
            } else {
              orderForm.deliveryAddress = fallbackAddress
              orderForm.deliveryLat = finalLocation.lat
              orderForm.deliveryLng = finalLocation.lng
            }
            
            updateMapMarkers()
            toast.warning('Location set using GPS coordinates. Please verify the address.')
          }
          
          gettingLocation.value = false
        })
      } else {
        // Google Maps not loaded, use coordinates directly
        const coordsAddress = `${finalLocation.lat.toFixed(6)}, ${finalLocation.lng.toFixed(6)} (Calapan Area)`
        
        if (type === 'pickup') {
          orderForm.pickupAddress = coordsAddress
          orderForm.pickupLat = finalLocation.lat
          orderForm.pickupLng = finalLocation.lng
        } else {
          orderForm.deliveryAddress = coordsAddress
          orderForm.deliveryLat = finalLocation.lat
          orderForm.deliveryLng = finalLocation.lng
        }
        
        updateMapMarkers()
        toast.info('Location set using GPS coordinates')
        gettingLocation.value = false
      }

    } catch (error) {
      console.error(`Geolocation error (attempt ${attempt + 1}):`, error)
      
      // If not the last attempt, try again with different settings
      if (attempt < maxAttempts - 1) {
        console.log('Retrying with different settings...')
        toast.info('Retrying location detection...')
        return await tryGetLocation(attempt + 1)
      }
      
      // Last attempt failed, show error and fallback
      gettingLocation.value = false
      
      let errorMessage = 'Unable to get your location. '
      
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage += 'Please allow location access in your browser settings.'
          toast.error(errorMessage)
          break
        case 2: // POSITION_UNAVAILABLE
          errorMessage += 'Location information is unavailable. Using Calapan City center.'
          toast.warning(errorMessage)
          useCalapanFallback(type)
          break
        case 3: // TIMEOUT
          errorMessage += 'Location request timed out. Using Calapan City center.'
          toast.warning(errorMessage)
          useCalapanFallback(type)
          break
        default:
          errorMessage += 'An unknown error occurred. Using Calapan City center.'
          toast.warning(errorMessage)
          useCalapanFallback(type)
          break
      }
    }
  }
  
  // Helper function to use Calapan fallback
  const useCalapanFallback = (type) => {
    const calapanCenter = { lat: 13.4119, lng: 121.1803 }
    
    if (typeof google !== 'undefined') {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: calapanCenter }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const fallbackAddress = 'Calapan City, Oriental Mindoro 5200, Philippines'
          
          if (type === 'pickup') {
            orderForm.pickupAddress = fallbackAddress
            orderForm.pickupLat = calapanCenter.lat
            orderForm.pickupLng = calapanCenter.lng
          } else {
            orderForm.deliveryAddress = fallbackAddress
            orderForm.deliveryLat = calapanCenter.lat
            orderForm.deliveryLng = calapanCenter.lng
          }
          updateMapMarkers()
          toast.info('Using Calapan City center as fallback location')
        }
      })
    } else {
      // Google Maps not available
      const fallbackAddress = 'Calapan City, Oriental Mindoro 5200, Philippines'
      
      if (type === 'pickup') {
        orderForm.pickupAddress = fallbackAddress
        orderForm.pickupLat = calapanCenter.lat
        orderForm.pickupLng = calapanCenter.lng
      } else {
        orderForm.deliveryAddress = fallbackAddress
        orderForm.deliveryLat = calapanCenter.lat
        orderForm.deliveryLng = calapanCenter.lng
      }
      updateMapMarkers()
      toast.info('Using Calapan City center as fallback location')
    }
  }
  
  // Start the location detection process
  await tryGetLocation(0)
}

// Add this method after getCurrentLocation
const showLocationTips = () => {
  const tips = `
📍 Location Tips for Better Accuracy:

✅ Make sure you're outdoors or near a window
✅ Enable "High Accuracy" location in your device settings
✅ Allow location access when prompted by your browser
✅ Wait a few seconds for GPS to stabilize
✅ Try refreshing the page if location seems wrong

🔧 If location is still inaccurate:
• Use the address search instead
• Type your specific address manually
• Look for nearby landmarks on the map
  `
  
  alert(tips)
}

const calculatePricing = async () => {
  if (!orderForm.pickupAddress || !orderForm.deliveryAddress) {
    toast.error('Please enter both pickup and delivery addresses')
    return
  }

  calculating.value = true
  try {
    // If coordinates not available, geocode addresses
    if (!orderForm.pickupLat || !orderForm.deliveryLat) {
      try {
        await geocodeAndUpdateLocation(orderForm.pickupAddress, 'pickup')
        await geocodeAndUpdateLocation(orderForm.deliveryAddress, 'delivery')
      } catch (error) {
        console.error('Geocoding failed:', error)
        toast.error('Unable to find the addresses. Please check and try again.')
        calculating.value = false
        return
      }
    }

    // Use Google Maps Distance Matrix for accurate calculation
    if (typeof google !== 'undefined') {
      const service = new google.maps.DistanceMatrixService()
      
      service.getDistanceMatrix({
        origins: [{ lat: orderForm.pickupLat, lng: orderForm.pickupLng }],
        destinations: [{ lat: orderForm.deliveryLat, lng: orderForm.deliveryLng }],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, async (response, status) => {
        if (status === 'OK') {
          const element = response.rows[0].elements[0]
          if (element.status === 'OK') {
            distance.value = element.distance.value / 1000 // Convert to km
            estimatedDuration.value = Math.ceil(element.duration.value / 60) // Convert to minutes
            
            // Calculate AI dynamic pricing
            const pricingResult = await calculateDeliveryFee(
              distance.value,
              selectedService.value.id,
              new Date()
            )

            Object.assign(pricing, pricingResult)
            pricingCalculated.value = true
            toast.success('Pricing calculated successfully!')
          } else {
            toast.error('Unable to calculate route between locations')
          }
        } else {
          toast.error('Failed to calculate distance. Please try again.')
        }
        calculating.value = false
      })
    } else {
      // Fallback to simple distance calculation
      const distanceResult = await calculateDistance(
        { lat: orderForm.pickupLat, lng: orderForm.pickupLng },
        { lat: orderForm.deliveryLat, lng: orderForm.deliveryLng }
      )

      distance.value = distanceResult.distance.value / 1000
      estimatedDuration.value = Math.ceil(distanceResult.duration.value / 60)

      const pricingResult = await calculateDeliveryFee(
        distance.value,
        selectedService.value.id,
        new Date()
      )

      Object.assign(pricing, pricingResult)
      pricingCalculated.value = true
      calculating.value = false
    }

  } catch (error) {
    console.error('Error calculating pricing:', error)
    toast.error('Failed to calculate pricing. Please try again.')
    calculating.value = false
  }
}

const getDemandLevel = (driverCount) => {
  if (driverCount < 5) return 'High'
  if (driverCount < 10) return 'Medium'
  return 'Low'
}

const generatePaymentReference = () => {
  return 'BT' + Date.now().toString().slice(-8)
}

const handleImageUpload = (files) => {
  uploadedImages.value = [...uploadedImages.value, ...files]
  toast.success(`${files.length} image(s) uploaded successfully`)
}

const handlePrescriptionUpload = (files) => {
  prescriptionUrls.value = [...prescriptionUrls.value, ...files.map(f => f.url)]
  toast.success('Prescription uploaded successfully')
}

const handlePaymentProofUpload = (files) => {
  paymentProofUrl.value = files[0].url
  toast.success('Payment proof uploaded successfully')
}

const handleUploadError = (error) => {
  console.error('Upload error:', error)
  if (error.message.includes('Bucket not found')) {
    toast.error('File storage not configured. Please contact support.')
  } else if (error.message.includes('File size')) {
    toast.error('File too large. Please use a file smaller than 5MB.')
  } else if (error.message.includes('not allowed')) {
    toast.error('File type not supported. Please use JPG, PNG, or PDF files.')
  } else {
    toast.error('Upload failed: ' + error.message)
  }
}

const submitOrder = async () => {
  if (!orderForm.paymentMethod || !orderForm.agreeTerms) {
    toast.error('Please complete all required fields')
    return
  }

  if (orderForm.paymentMethod !== 'COD' && !paymentProofUrl.value) {
    if (files.length > 0) {
      toast.error('Please click the Upload button to upload your selected file')
    } else {
      toast.error('Please select and upload payment proof')
    }
    return
  }

  submitting.value = true
  try {
    // Generate order number
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    orderNumber.value = `BT${timestamp.toString().slice(-6)}${randomNum}`

    // Prepare service details based on service type
    const serviceDetails = {
      service_type: selectedService.value.id,
      ...getServiceSpecificData()
    }

    const orderData = {
      user_id: userProfile.value.id,
      order_number: orderNumber.value,
      service_type: selectedService.value.id,
      service_details: serviceDetails,
      pickup_address: orderForm.pickupAddress,
      pickup_lat: orderForm.pickupLat,
      pickup_lng: orderForm.pickupLng,
      delivery_address: orderForm.deliveryAddress,
      delivery_lat: orderForm.deliveryLat,
      delivery_lng: orderForm.deliveryLng,
      items_description: orderForm.itemsDescription,
      special_instructions: orderForm.specialInstructions,
      images_urls: uploadedImages.value.map(img => img.url),
      prescription_urls: prescriptionUrls.value,
      distance_km: distance.value,
      estimated_duration: estimatedDuration.value,
      base_fee: pricing.baseFee,
      delivery_fee: pricing.deliveryFee,
      service_fee: pricing.baseFee,
      total_amount: pricing.totalAmount,
      payment_method: orderForm.paymentMethod,
      payment_proof_url: paymentProofUrl.value,
      payment_reference: generatePaymentReference(),
      payment_status: orderForm.paymentMethod === 'COD' ? 'approved' : 'pending',
      status: 'placed',
      created_at: new Date().toISOString()
    }

    const { data, error } = await insert('orders', orderData)
    if (error) throw error

    orderSuccess.value = true
    toast.success('Order placed successfully!')

  } catch (error) {
    console.error('Error submitting order:', error)
    toast.error('Failed to place order. Please try again.')
  } finally {
    submitting.value = false
  }
}

const getServiceSpecificData = () => {
  const data = {}
  
  switch (selectedService.value.id) {
    case 'food_delivery':
      data.restaurant_name = orderForm.restaurantName
      data.order_value = orderForm.orderValue
      break
    case 'grocery':
      data.grocery_store = orderForm.groceryStore
      data.budget_range = orderForm.budgetRange
      break
    case 'pay_bills':
      data.bill_type = orderForm.billType
      data.account_number = orderForm.accountNumber
      data.bill_amount = orderForm.billAmount
      data.payment_location = orderForm.paymentLocation
      break
    case 'medicines':
      data.pharmacy = orderForm.pharmacy
      data.patient_name = orderForm.patientName
      break
    case 'pabili':
      data.store_name = orderForm.storeName
      data.estimated_budget = orderForm.estimatedBudget
      break
    case 'pickup':
      data.item_weight = orderForm.itemWeight
      data.item_value = orderForm.itemValue
      data.is_fragile = orderForm.isFragile
      break
    case 'surprise_delivery':
      data.surprise_type = orderForm.surpriseType
      data.recipient_name = orderForm.recipientName
      data.special_message = orderForm.specialMessage
      break
  }
  
  return data
}

const goToOrders = () => {
  router.push('/dashboard/user/my-orders')
}

const bookAnother = () => {
  // Reset form
  Object.keys(orderForm).forEach(key => {
    if (typeof orderForm[key] === 'boolean') {
      orderForm[key] = false
    } else {
      orderForm[key] = ''
    }
  })
  
  selectedService.value = null
  currentStep.value = 1
  orderSuccess.value = false
  pricingCalculated.value = false
  uploadedImages.value = []
  prescriptionUrls.value = []
  paymentProofUrl.value = ''
  distance.value = 0
  estimatedDuration.value = 0
  
  Object.keys(pricing).forEach(key => {
    pricing[key] = key === 'factors' ? {} : 0
  })
}

// Lifecycle
onMounted(() => {
  // Pre-select service if specified in query
  if (route.query.service) {
    const preSelected = services.value.find(s => s.id === route.query.service)
    if (preSelected) {
      selectedService.value = preSelected
    }
  }
})

// Watch for address changes to trigger map updates
watch([() => orderForm.pickupAddress, () => orderForm.deliveryAddress], () => {
  if (orderForm.pickupAddress && orderForm.deliveryAddress && map) {
    // Debounce the geocoding to avoid too many API calls
    clearTimeout(window.addressUpdateTimeout)
    window.addressUpdateTimeout = setTimeout(() => {
      if (orderForm.pickupLat && orderForm.deliveryLat) {
        updateMapMarkers()
      }
    }, 500)
  }
})
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500;
}

.btn-primary {
  @apply px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200;
}

.spinner {
  @apply animate-spin rounded-full h-4 w-4 border-b-2 border-white;
}

/* Hide Google Maps controls */
.gm-style-cc {
  display: none !important;
}

.gm-bundled-control {
  display: none !important;
}

.gmnoprint {
  display: none !important;
}

#booking-map {
  height: 100%;
  width: 100%;
}
</style>
