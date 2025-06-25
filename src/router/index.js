"use client"

import { createRouter, createWebHistory } from "vue-router"
import { useAuth } from "@/composables/useAuth"
import { useToast } from "vue-toastification" // Import useToast

// Public routes
import Home from "@/views/public/Home.vue"
import About from "@/views/public/About.vue"
import Services from "@/views/public/Services.vue"

// Auth routes
import UserLogin from "@/views/auth/user/UserLogin.vue"
import UserRegister from "@/views/auth/user/UserRegister.vue"
import ForgotPassword from "@/views/auth/user/ForgotPassword.vue"

import DriverLogin from "@/views/auth/driver/DriverLogin.vue"
import DriverRegister from "@/views/auth/driver/DriverRegister.vue"

import AdminLogin from "@/views/auth/admin/AdminLogin.vue"
import AdminRegister from "@/views/auth/admin/AdminRegister.vue"

// Dashboard routes
import UserDashboard from "@/views/dashboard/user/UserDashboard.vue"
import BookService from "@/views/dashboard/user/BookService.vue"
import MyOrders from "@/views/dashboard/user/MyOrders.vue"
import UploadPayment from "@/views/dashboard/user/UploadPayment.vue"
import UserProfile from "@/views/dashboard/user/Profile.vue"
import OrderChat from "@/views/dashboard/user/OrderChat.vue"

import DriverDashboard from "@/views/dashboard/driver/DriverDashboard.vue"
import AvailableBookings from "@/views/dashboard/driver/AvailableBookings.vue"
import MyAssignments from "@/views/dashboard/driver/MyAssignments.vue"
import ProofOfDelivery from "@/views/dashboard/driver/ProofOfDelivery.vue"
import DriverProfile from "@/views/dashboard/driver/Profile.vue"
import Earnings from "@/views/dashboard/driver/Earnings.vue"

import AdminDashboard from "@/views/dashboard/admin/AdminDashboard.vue"
import ManageOrders from "@/views/dashboard/admin/ManageOrders.vue"
import ManageDrivers from "@/views/dashboard/admin/ManageDrivers.vue"
import ManageUsers from "@/views/dashboard/admin/ManageUsers.vue"
import DriverApplications from "@/views/dashboard/admin/DriverApplications.vue"
import PricingFraudPanel from "@/views/dashboard/admin/PricingFraudPanel.vue"
import SystemSettings from "@/views/dashboard/admin/SystemSettings.vue"
import OrderChatMonitor from "@/views/dashboard/admin/OrderChatMonitor.vue"

const routes = [
  // Public routes
  { path: "/", name: "Home", component: Home },
  { path: "/about", name: "About", component: About },
  { path: "/services", name: "Services", component: Services },

  // User auth routes
  { path: "/auth/user/login", name: "UserLogin", component: UserLogin },
  { path: "/auth/user/register", name: "UserRegister", component: UserRegister },
  { path: "/auth/user/forgot-password", name: "ForgotPassword", component: ForgotPassword },

  // Driver auth routes
  { path: "/auth/driver/login", name: "DriverLogin", component: DriverLogin },
  { path: "/auth/driver/register", name: "DriverRegister", component: DriverRegister },

  // Admin auth routes
  { path: "/auth/admin/login", name: "AdminLogin", component: AdminLogin },
  { path: "/auth/admin/register", name: "AdminRegister", component: AdminRegister },

  // User dashboard routes
  {
    path: "/dashboard/user",
    meta: { requiresAuth: true, role: "user" },
    children: [
      { path: "", name: "UserDashboard", component: UserDashboard },
      { path: "book-service", name: "BookService", component: BookService },
      { path: "my-orders", name: "MyOrders", component: MyOrders },
      { path: "upload-payment", name: "UploadPayment", component: UploadPayment },
      { path: "profile", name: "UserProfile", component: UserProfile },
      { path: "order-chat/:orderId", name: "OrderChat", component: OrderChat },
    ],
  },

  // Driver dashboard routes
  {
    path: "/dashboard/driver",
    meta: { requiresAuth: true, role: "driver" },
    children: [
      { path: "", name: "DriverDashboard", component: DriverDashboard },
      { path: "available-bookings", name: "AvailableBookings", component: AvailableBookings },
      { path: "my-assignments", name: "MyAssignments", component: MyAssignments },
      { path: "proof-of-delivery", name: "ProofOfDelivery", component: ProofOfDelivery },
      { path: "profile", name: "DriverProfile", component: DriverProfile },
      { path: "earnings", name: "Earnings", component: Earnings },
    ],
  },

  // Admin dashboard routes
  {
    path: "/dashboard/admin",
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "", name: "AdminDashboard", component: AdminDashboard },
      { path: "manage-orders", name: "ManageOrders", component: ManageOrders },
      { path: "manage-drivers", name: "ManageDrivers", component: ManageDrivers },
      { path: "manage-users", name: "ManageUsers", component: ManageUsers },
      { path: "driver-applications", name: "DriverApplications", component: DriverApplications },
      { path: "pricing-fraud-panel", name: "PricingFraudPanel", component: PricingFraudPanel },
      { path: "system-settings", name: "SystemSettings", component: SystemSettings },
      { path: "order-chat-monitor", name: "OrderChatMonitor", component: OrderChatMonitor },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { user, userRole, checkAuth } = useAuth()
  const toast = useToast() // Declare useToast here

  // Check authentication status
  await checkAuth()

  // Handle email verification success
  if (to.query.verified === "true") {
    // Show success message and redirect to login
    setTimeout(() => {
      toast.success("Email verified successfully! You can now log in.")
    }, 100)
  }

  if (to.meta.requiresAuth) {
    if (!user.value) {
      // Redirect to appropriate login page based on role
      const role = to.meta.role
      next(`/auth/${role}/login`)
      return
    }

    if (to.meta.role && userRole.value !== to.meta.role) {
      // Redirect to appropriate dashboard if role doesn't match
      next(`/dashboard/${userRole.value}`)
      return
    }
  }

  // Redirect authenticated users away from auth pages
  if (to.path.includes("/auth/") && user.value) {
    next(`/dashboard/${userRole.value}`)
    return
  }

  next()
})

export default router
