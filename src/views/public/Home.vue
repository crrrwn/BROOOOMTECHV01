<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-800">BroomTech</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-primary-600 font-medium">Home</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-primary-600 font-medium">About</router-link>
            <router-link to="/services" class="text-gray-700 hover:text-primary-600 font-medium">Services</router-link>
            
            <!-- Login Dropdown -->
            <div class="relative" ref="loginDropdown">
              <button
                @click="toggleLoginDropdown"
                class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium"
              >
                <span>Login</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div
                v-if="showLoginDropdown"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <router-link
                  to="/auth/user/login"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Customer Login
                </router-link>
                <router-link
                  to="/auth/driver/login"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Driver Login
                </router-link>
                <router-link
                  to="/auth/admin/login"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin Login
                </router-link>
              </div>
            </div>

            <!-- Register Dropdown -->
            <div class="relative" ref="registerDropdown">
              <button
                @click="toggleRegisterDropdown"
                class="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <span>Register</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div
                v-if="showRegisterDropdown"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <router-link
                  to="/auth/user/register"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Customer Register
                </router-link>
                <router-link
                  to="/auth/driver/register"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Driver Register
                </router-link>
                <router-link
                  to="/auth/admin/register"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin Register
                </router-link>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
          <div class="space-y-2">
            <router-link to="/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Home</router-link>
            <router-link to="/about" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">About</router-link>
            <router-link to="/services" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Services</router-link>
            
            <div class="border-t border-gray-200 pt-2 mt-2">
              <p class="px-4 py-2 text-sm font-medium text-gray-500">Login</p>
              <router-link to="/auth/user/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Customer</router-link>
              <router-link to="/auth/driver/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Driver</router-link>
              <router-link to="/auth/admin/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Admin</router-link>
            </div>
            
            <div class="border-t border-gray-200 pt-2 mt-2">
              <p class="px-4 py-2 text-sm font-medium text-gray-500">Register</p>
              <router-link to="/auth/user/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Customer</router-link>
              <router-link to="/auth/driver/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Driver</router-link>
              <router-link to="/auth/admin/register" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Admin</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Fast & Reliable
            <span class="block text-primary-200">Delivery Service</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            From food delivery to grocery shopping, we've got you covered. Professional drivers, real-time tracking, and AI-powered service.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/auth/user/register"
              class="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Get Started
            </router-link>
            <router-link
              to="/services"
              class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              View Services
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose BroomTech?</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with reliable service to deliver the best experience.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h3>
            <p class="text-gray-600">Quick delivery times with our optimized routing system and dedicated drivers.</p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">100% Reliable</h3>
            <p class="text-gray-600">Trusted by thousands of customers with our verified and professional drivers.</p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Real-time Tracking</h3>
            <p class="text-gray-600">Track your orders in real-time with live GPS tracking and instant notifications.</p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Smart Pricing</h3>
            <p class="text-gray-600">AI-powered dynamic pricing ensures fair rates based on distance, time, and demand.</p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
            <p class="text-gray-600">AI-powered chatbot and human support available around the clock for assistance.</p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Secure & Safe</h3>
            <p class="text-gray-600">Advanced fraud detection and secure payment processing for your peace of mind.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            From everyday essentials to special deliveries, we handle it all with care and efficiency.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Food Delivery</h3>
            <p class="text-gray-600 text-sm">Hot meals delivered fresh from your favorite restaurants.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Grocery Shopping</h3>
            <p class="text-gray-600 text-sm">Fresh groceries and household items delivered to your door.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Bill Payments</h3>
            <p class="text-gray-600 text-sm">Convenient bill payment services for utilities and more.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Special Deliveries</h3>
            <p class="text-gray-600 text-sm">Surprise gifts, medicines, and custom pickup services.</p>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/services"
            class="btn-primary text-lg px-8 py-3"
          >
            View All Services
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust BroomTech for their delivery needs.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/auth/user/register"
            class="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Sign Up as Customer
          </router-link>
          <router-link
            to="/auth/driver/register"
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Become a Driver
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span class="text-xl font-bold">BroomTech</span>
            </div>
            <p class="text-gray-400 text-sm">
              Professional delivery service powered by AI technology for fast, reliable, and secure deliveries.
            </p>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Services</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white">Food Delivery</a></li>
              <li><a href="#" class="hover:text-white">Grocery Shopping</a></li>
              <li><a href="#" class="hover:text-white">Bill Payments</a></li>
              <li><a href="#" class="hover:text-white">Special Deliveries</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Company</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><router-link to="/about" class="hover:text-white">About Us</router-link></li>
              <li><a href="#" class="hover:text-white">Contact</a></li>
              <li><a href="#" class="hover:text-white">Careers</a></li>
              <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white">Help Center</a></li>
              <li><a href="#" class="hover:text-white">Safety</a></li>
              <li><a href="#" class="hover:text-white">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white">Driver Support</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 BroomTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showLoginDropdown = ref(false)
const showRegisterDropdown = ref(false)
const showMobileMenu = ref(false)
const loginDropdown = ref(null)
const registerDropdown = ref(null)

const toggleLoginDropdown = () => {
  showLoginDropdown.value = !showLoginDropdown.value
  showRegisterDropdown.value = false
}

const toggleRegisterDropdown = () => {
  showRegisterDropdown.value = !showRegisterDropdown.value
  showLoginDropdown.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleClickOutside = (event) => {
  if (loginDropdown.value && !loginDropdown.value.contains(event.target)) {
    showLoginDropdown.value = false
  }
  if (registerDropdown.value && !registerDropdown.value.contains(event.target)) {
    showRegisterDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
