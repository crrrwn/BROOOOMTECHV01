<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation (same as Home) -->
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
            <router-link to="/about" class="text-primary-600 font-medium">About</router-link>
            <router-link to="/services" class="text-gray-700 hover:text-primary-600 font-medium">Services</router-link>
            <router-link to="/auth/user/login" class="text-gray-700 hover:text-primary-600 font-medium">Login</router-link>
            <router-link to="/auth/user/register" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">Register</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">About BroomTech</h1>
        <p class="text-xl text-primary-100 max-w-3xl mx-auto">
          We're revolutionizing the delivery industry with AI-powered technology, professional drivers, and exceptional customer service.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p class="text-lg text-gray-600 mb-6">
              At BroomTech, we believe that technology should make life easier. Our mission is to provide fast, reliable, and affordable delivery services that connect communities and support local businesses.
            </p>
            <p class="text-lg text-gray-600 mb-6">
              We leverage artificial intelligence, real-time tracking, and a network of professional drivers to ensure every delivery is handled with care and precision.
            </p>
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <div class="text-gray-600">Happy Customers</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div class="text-gray-600">Professional Drivers</div>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 rounded-lg p-8">
            <div class="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <svg class="w-16 h-16 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <p class="text-primary-700 font-semibold">BroomTech Delivery</p>
                <p class="text-primary-600 text-sm">Fast & Reliable Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            These core values guide everything we do and shape our commitment to excellence.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Reliability</h3>
            <p class="text-gray-600">We keep our promises and deliver on time, every time. Your trust is our foundation.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Innovation</h3>
            <p class="text-gray-600">We continuously improve our technology and services to provide the best experience.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Care</h3>
            <p class="text-gray-600">We treat every delivery with care and respect, as if it were our own.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate people behind BroomTech who make it all possible.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-1">John Doe</h3>
            <p class="text-primary-600 mb-2">CEO & Founder</p>
            <p class="text-gray-600 text-sm">Visionary leader with 10+ years in logistics and technology.</p>
          </div>

          <div class="text-center">
            <div class="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-1">Jane Smith</h3>
            <p class="text-primary-600 mb-2">CTO</p>
            <p class="text-gray-600 text-sm">Tech expert specializing in AI and mobile applications.</p>
          </div>

          <div class="text-center">
            <div class="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-1">Mike Johnson</h3>
            <p class="text-primary-600 mb-2">COO</p>
            <p class="text-gray-600 text-sm">Operations specialist ensuring smooth daily operations.</p>
          </div>
        </div>
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
