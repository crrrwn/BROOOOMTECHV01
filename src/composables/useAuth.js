"use client"

import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useToast } from "vue-toastification"
import { useSupabase } from "./useSupabase"

const user = ref(null)
const userProfile = ref(null)
const loading = ref(false)

export function useAuth() {
  const router = useRouter()
  const toast = useToast()
  const { supabase } = useSupabase()

  const userRole = computed(() => {
    if (!user.value) return null
    return user.value.user_metadata?.user_type || "user"
  })

  const isAuthenticated = computed(() => !!user.value)

  // Check current authentication status
  const checkAuth = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      user.value = currentUser

      if (currentUser) {
        await loadUserProfile()
      }
    } catch (error) {
      console.error("Auth check error:", error)
      user.value = null
      userProfile.value = null
    }
  }

  // Load user profile based on role
  const loadUserProfile = async () => {
    if (!user.value) return

    const userType = user.value.user_metadata?.user_type || "user"
    const table = userType === "user" ? "users" : userType === "driver" ? "drivers" : "admins"

    try {
      const { data, error } = await supabase.from(table).select("*").eq("id", user.value.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Profile load error:", error)
      } else if (data) {
        userProfile.value = data
      }
    } catch (error) {
      console.error("Profile load error:", error)
    }
  }

  // COMPLETELY SIMPLIFIED REGISTRATION - NO DATABASE OPERATIONS
  const register = async (userData, userType = "user") => {
    loading.value = true
    try {
      console.log("Starting registration for:", userData.email)

      // ONLY create Supabase auth user - NO database operations at all
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password_hash,
        options: {
          data: {
            user_type: userType,
            first_name: userData.first_name,
            last_name: userData.last_name,
            middle_name: userData.middle_name || null,
            contact: userData.contact,
            address: userData.address,
            email_verified: false,
            // Driver specific data
            ...(userType === "driver" && {
              motorcycle_plate: userData.motorcycle_plate || "",
              license_url: userData.license_url || "",
              orcr_url: userData.orcr_url || "",
              selfie_with_id_url: userData.selfie_with_id_url || "",
              is_approved: false,
              is_online: false,
              rating: 5.0,
              total_deliveries: 0,
            }),
            // Admin specific data
            ...(userType === "admin" && {
              admin_code: userData.admin_code,
            }),
          },
          emailRedirectTo: `${window.location.origin}/auth/${userType}/login`,
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw authError
      }

      console.log("Registration successful - auth user created:", authData.user?.id)

      toast.success(
        "Registration successful! Please check your email and click the confirmation link to activate your account.",
      )

      return { success: true, data: authData }
    } catch (error) {
      console.error("Registration failed:", error)

      let errorMessage = "Registration failed"
      if (error.message.includes("User already registered")) {
        errorMessage = "Email already registered. Please use a different email or try logging in."
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address."
      } else if (error.message.includes("Password")) {
        errorMessage = "Password must be at least 6 characters long."
      } else {
        errorMessage = error.message || "Registration failed"
      }

      toast.error(errorMessage)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // Create profile after successful login (lazy creation)
  const createProfileIfNeeded = async (user, userType) => {
    const table = userType === "user" ? "users" : userType === "driver" ? "drivers" : "admins"

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase.from(table).select("id").eq("id", user.id).single()

      if (!existingProfile) {
        // Create profile from user_metadata
        const metadata = user.user_metadata || {}
        const profileData = {
          id: user.id,
          email: user.email,
          first_name: metadata.first_name || "",
          last_name: metadata.last_name || "",
          middle_name: metadata.middle_name || null,
          contact: metadata.contact || "",
          address: metadata.address || "",
          email_verified: true, // User successfully logged in, so email is verified
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...(userType === "driver" && {
            motorcycle_plate: metadata.motorcycle_plate || "",
            license_url: metadata.license_url || "",
            orcr_url: metadata.orcr_url || "",
            selfie_with_id_url: metadata.selfie_with_id_url || "",
            is_approved: metadata.is_approved || false,
            is_online: false,
            rating: metadata.rating || 5.0,
            total_deliveries: metadata.total_deliveries || 0,
          }),
          ...(userType === "admin" && {
            admin_code: metadata.admin_code || "",
          }),
        }

        const { error: insertError } = await supabase.from(table).insert(profileData)

        if (insertError) {
          console.error("Profile creation error:", insertError)
          // Don't throw error, just log it
        } else {
          console.log("Profile created successfully on login")
        }
      }
    } catch (error) {
      console.error("Profile check/creation error:", error)
      // Don't throw error, just log it
    }
  }

  // Login user
  const login = async (email, password, userType = "user") => {
    loading.value = true
    try {
      console.log("Attempting login for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        throw error
      }

      console.log("Login successful")
      user.value = data.user

      // Create profile if it doesn't exist (lazy creation)
      await createProfileIfNeeded(data.user, userType)

      // Load profile
      await loadUserProfile()

      // Check driver approval
      if (userType === "driver" && userProfile.value && !userProfile.value.is_approved) {
        await supabase.auth.signOut()
        throw new Error("Your driver account is pending approval. Please wait for admin approval.")
      }

      toast.success("Login successful!")
      router.push(`/dashboard/${userType}`)
      return { success: true, data }
    } catch (error) {
      console.error("Login failed:", error)

      let errorMessage = "Login failed"
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials."
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email first. Check your inbox for the verification link."
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please wait a moment and try again."
      } else {
        errorMessage = error.message || "Login failed"
      }

      toast.error(errorMessage)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // Resend verification email
  const resendVerification = async (email) => {
    loading.value = true
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) throw error

      toast.success("Verification email sent! Please check your inbox.")
      return { success: true }
    } catch (error) {
      toast.error(error.message || "Failed to send verification email")
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      userProfile.value = null
      toast.success("Logged out successfully!")
      router.push("/")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    loading.value = true
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      toast.success("Password reset email sent! Please check your inbox.")
      return { success: true }
    } catch (error) {
      toast.error(error.message || "Failed to send reset password")
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    userProfile,
    userRole,
    isAuthenticated,
    loading,
    checkAuth,
    register,
    login,
    logout,
    resendVerification,
    forgotPassword,
    loadUserProfile,
  }
}
