<template>
  <div class="bg-white shadow-lg h-full w-64 fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0" :class="{ '-translate-x-full': !isOpen }">
    <!-- Sidebar Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">BroomTech</h2>
          <p class="text-sm text-gray-500 capitalize">{{ userRole }} Dashboard</p>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="mt-6 px-4">
      <div class="space-y-2">
        <router-link
          v-for="link in navigationLinks"
          :key="link.name"
          :to="link.to"
          class="sidebar-link"
          :class="{ 'active': $route.name === link.name }"
        >
          <component :is="link.icon" class="w-5 h-5 mr-3" />
          <span>{{ link.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- User Profile Section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3 mb-4">
        <img
          :src="userProfile?.profile_image_url || '/placeholder.svg?height=40&width=40'"
          :alt="userProfile?.first_name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">
            {{ userProfile?.first_name }} {{ userProfile?.last_name }}
          </p>
          <p class="text-xs text-gray-500 truncate">{{ userProfile?.email }}</p>
        </div>
      </div>
      
      <button
        @click="handleLogout"
        class="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Logout
      </button>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

// Icons (you can replace these with your preferred icon library)
const HomeIcon = 'svg'
const BookIcon = 'svg'
const ListIcon = 'svg'
const UploadIcon = 'svg'
const UserIcon = 'svg'
const TruckIcon = 'svg'
const ClipboardIcon = 'svg'
const CameraIcon = 'svg'
const DollarIcon = 'svg'
const SettingsIcon = 'svg'
const UsersIcon = 'svg'
const ShieldIcon = 'svg'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { userRole, userProfile, logout } = useAuth()

const links = {
    user: [
      { name: 'UserDashboard', label: 'Dashboard', to: '/dashboard/user', icon: HomeIcon },
      { name: 'BookService', label: 'Book a Service', to: '/dashboard/user/book-service', icon: BookIcon },
      { name: 'MyOrders', label: 'My Orders', to: '/dashboard/user/my-orders', icon: ListIcon },
      { name: 'UploadPayment', label: 'Upload Payment', to: '/dashboard/user/upload-payment', icon: UploadIcon },
      { name: 'UserProfile', label: 'Profile', to: '/dashboard/user/profile', icon: UserIcon }
    ],
    driver: [
      { name: 'DriverDashboard', label: 'Dashboard', to: '/dashboard/driver', icon: HomeIcon },
      { name: 'AvailableBookings', label: 'Available Bookings', to: '/dashboard/driver/available-bookings', icon: ListIcon },
      { name: 'MyAssignments', label: 'My Assignments', to: '/dashboard/driver/my-assignments', icon: TruckIcon },
      { name: 'ProofOfDelivery', label: 'Proof of Delivery', to: '/dashboard/driver/proof-of-delivery', icon: CameraIcon },
      { name: 'DriverProfile', label: 'Profile', to: '/dashboard/driver/profile', icon: UserIcon },
      { name: 'Earnings', label: 'Earnings', to: '/dashboard/driver/earnings', icon: DollarIcon }
    ],
    admin: [
      { name: 'AdminDashboard', label: 'Dashboard', to: '/dashboard/admin', icon: HomeIcon },
      { name: 'ManageOrders', label: 'Manage Orders', to: '/dashboard/admin/manage-orders', icon: ClipboardIcon },
      { name: 'ManageDrivers', label: 'Manage Drivers', to: '/dashboard/admin/manage-drivers', icon: TruckIcon },
      { name: 'ManageUsers', label: 'Manage Users', to: '/dashboard/admin/manage-users', icon: UsersIcon },
      { name: 'DriverApplications', label: 'Driver Applications', to: '/dashboard/admin/driver-applications', icon: UserIcon },
      { name: 'PricingFraudPanel', label: 'Pricing & Fraud', to: '/dashboard/admin/pricing-fraud-panel', icon: ShieldIcon },
      { name: 'SystemSettings', label: 'System Settings', to: '/dashboard/admin/system-settings', icon: SettingsIcon }
    ]
  }

const navigationLinks = computed(() => {
  return links[userRole.value] || []
})

const closeSidebar = () => {
  emit('close')
}

const handleLogout = async () => {
  await logout()
}
</script>
