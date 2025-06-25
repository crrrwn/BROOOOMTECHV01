<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-800">BroomTech</span>
          </router-link>

          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-primary-600 font-medium">Home</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-primary-600 font-medium">About</router-link>
            <router-link to="/services" class="text-primary-600 font-medium">Services</router-link>
            <router-link to="/auth/user/login" class="text-gray-700 hover:text-primary-600 font-medium">Login</router-link>
            <router-link to="/auth/user/register" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">Register</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
        <p class="text-xl text-primary-100 max-w-3xl mx-auto">
          Comprehensive delivery solutions for all your needs, powered by AI technology and professional drivers.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Food Delivery -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Food Delivery</h3>
            <p class="text-gray-600 mb-4">Hot, fresh meals delivered from your favorite restaurants. Fast delivery with temperature-controlled transport.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Restaurant partnerships</li>
              <li>• Temperature monitoring</li>
              <li>• 30-45 minute delivery</li>
              <li>• Real-time tracking</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱50</div>
          </div>

          <!-- Grocery Shopping -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Grocery Shopping</h3>
            <p class="text-gray-600 mb-4">Fresh groceries and household essentials delivered to your doorstep. Our shoppers pick the best items for you.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Fresh produce selection</li>
              <li>• Quality guarantee</li>
              <li>• Same-day delivery</li>
              <li>• Bulk orders welcome</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱70</div>
          </div>

          <!-- Bill Payments -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Bill Payments</h3>
            <p class="text-gray-600 mb-4">Convenient bill payment services for utilities, internet, and other services. Never miss a payment again.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Utility bills</li>
              <li>• Internet & cable</li>
              <li>• Government fees</li>
              <li>• Receipt provided</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱40</div>
          </div>

          <!-- Pick-up Service -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14l-1 9H6L5 8zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v2"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Pick-up Service</h3>
            <p class="text-gray-600 mb-4">Need something picked up? We'll collect items from any location and deliver them safely to your destination.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Document pickup</li>
              <li>• Package collection</li>
              <li>• Store purchases</li>
              <li>• Secure handling</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱55</div>
          </div>

          <!-- Surprise Delivery -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Surprise Delivery</h3>
            <p class="text-gray-600 mb-4">Send surprise gifts, flowers, or special items to your loved ones. Make someone's day special with our surprise delivery.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Gift delivery</li>
              <li>• Flower arrangements</li>
              <li>• Special occasions</li>
              <li>• Personalized notes</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱65</div>
          </div>

          <!-- Medicine Delivery -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Medicine Delivery</h3>
            <p class="text-gray-600 mb-4">Prescription and over-the-counter medicines delivered safely. Upload your prescription for prescription medicines.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Prescription medicines</li>
              <li>• OTC medications</li>
              <li>• Pharmacy partnerships</li>
              <li>• Secure transport</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱60</div>
          </div>

          <!-- Pabili Service -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Pabili Service</h3>
            <p class="text-gray-600 mb-4">Need us to buy something specific for you? Just tell us what you need and where to get it, and we'll handle the rest.</p>
            <ul class="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Custom purchases</li>
              <li>• Store shopping</li>
              <li>• Item verification</li>
              <li>• Receipt included</li>
            </ul>
            <div class="text-primary-600 font-semibold">Starting at ₱55</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to get your delivery started
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Choose Service</h3>
            <p class="text-gray-600">Select the service you need from our comprehensive list of delivery options.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Provide Details</h3>
            <p class="text-gray-600">Fill in the pickup and delivery addresses, along with any special instructions.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Make Payment</h3>
            <p class="text-gray-600">Choose your preferred payment method and confirm your order.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Track & Receive</h3>
            <p class="text-gray-600">Track your order in real-time and receive your delivery at your doorstep.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and experience the convenience of BroomTech delivery services.
        </p>
        <router-link
          to="/auth/user/register"
          class="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
        >
          Start Your First Delivery
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="text-xl font-bold">BroomTech</span>
        </div>
        <p class="text-gray-400 text-sm">&copy; 2024 BroomTech. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
