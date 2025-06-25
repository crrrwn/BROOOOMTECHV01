"use client"

import { ref } from "vue"
import { useToast } from "vue-toastification"
import { useSupabase } from "./useSupabase"

export function useOTP() {
  const loading = ref(false)
  const toast = useToast()
  const { update, select } = useSupabase()

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const sendOTP = async (email, userType = "user") => {
    loading.value = true
    try {
      const table = userType === "user" ? "users" : userType === "driver" ? "drivers" : "admins"
      const otpCode = generateOTP()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      const { error } = await update(table).eq("email", email).update({
        otp_code: otpCode,
        otp_expires_at: expiresAt,
      })

      if (error) throw error

      // In a real app, you would send this via email service
      console.log(`OTP for ${email}: ${otpCode}`)

      toast.success("OTP sent to your email!")
      return { success: true, otpCode }
    } catch (error) {
      toast.error("Failed to send OTP")
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const verifyOTP = async (email, otpCode, userType = "user") => {
    loading.value = true
    try {
      const table = userType === "user" ? "users" : userType === "driver" ? "drivers" : "admins"

      const { data, error } = await select(table, "otp_code, otp_expires_at").eq("email", email).single()

      if (error) throw error

      if (data.otp_code !== otpCode) {
        throw new Error("Invalid OTP code")
      }

      if (new Date() > new Date(data.otp_expires_at)) {
        throw new Error("OTP code has expired")
      }

      return { success: true }
    } catch (error) {
      toast.error(error.message || "OTP verification failed")
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const resendOTP = async (email, userType = "user") => {
    return await sendOTP(email, userType)
  }

  return {
    loading,
    sendOTP,
    verifyOTP,
    resendOTP,
    generateOTP,
  }
}
