import { ref } from "vue"
import { useSupabase } from "./useSupabase"

export function useDynamicPricing() {
  const loading = ref(false)
  const { select } = useSupabase()

  const calculateDeliveryFee = async (distance, serviceType, timeOfDay = new Date()) => {
    loading.value = true
    try {
      // Get system settings for pricing
      const { data: settings } = await select("system_settings", "setting_key, setting_value").in("setting_key", [
        "base_delivery_fee",
        "per_km_rate",
        "time_multiplier",
      ])

      const settingsMap = {}
      settings.forEach((setting) => {
        settingsMap[setting.setting_key] = Number.parseFloat(setting.setting_value)
      })

      const baseFee = settingsMap.base_delivery_fee || 50
      const perKmRate = settingsMap.per_km_rate || 15
      const timeMultiplier = settingsMap.time_multiplier || 1.2

      // Calculate base delivery fee
      let deliveryFee = baseFee + distance * perKmRate

      // Apply time-based multiplier (peak hours: 7-9 AM, 12-1 PM, 6-8 PM)
      const hour = timeOfDay.getHours()
      const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 12 && hour <= 13) || (hour >= 18 && hour <= 20)

      if (isPeakHour) {
        deliveryFee *= timeMultiplier
      }

      // Apply service type multiplier
      const serviceMultipliers = {
        food_delivery: 1.0,
        pay_bills: 0.8,
        pickup: 1.1,
        surprise_delivery: 1.3,
        medicines: 1.2,
        grocery: 1.4,
        pabili: 1.1,
      }

      const multiplier = serviceMultipliers[serviceType] || 1.0
      deliveryFee *= multiplier

      // Get available drivers count for demand-based pricing
      const { data: onlineDrivers } = await select("drivers", "id").eq("is_online", true).eq("is_approved", true)

      const driverCount = onlineDrivers?.length || 0

      // Apply demand multiplier (fewer drivers = higher price)
      if (driverCount < 5) {
        deliveryFee *= 1.5
      } else if (driverCount < 10) {
        deliveryFee *= 1.2
      }

      // Round to nearest peso
      deliveryFee = Math.round(deliveryFee)

      return {
        baseFee,
        deliveryFee,
        totalAmount: deliveryFee,
        factors: {
          distance,
          isPeakHour,
          serviceType,
          driverCount,
          multiplier,
        },
      }
    } catch (error) {
      console.error("Pricing calculation error:", error)
      return {
        baseFee: 50,
        deliveryFee: 65,
        totalAmount: 65,
        factors: {},
      }
    } finally {
      loading.value = false
    }
  }

  const getPricingRecommendations = async () => {
    try {
      // Get recent orders data for AI analysis
      const { data: recentOrders } = await select("orders", "*")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })

      // Get driver availability
      const { data: drivers } = await select("drivers", "is_online, created_at").eq("is_approved", true)

      const onlineDrivers = drivers?.filter((d) => d.is_online).length || 0
      const totalDrivers = drivers?.length || 0

      // Simple AI recommendations based on data
      const recommendations = {
        suggestedBaseFee: 50,
        suggestedPerKmRate: 15,
        suggestedTimeMultiplier: 1.2,
        driverUtilization: totalDrivers > 0 ? (onlineDrivers / totalDrivers) * 100 : 0,
        averageOrderValue:
          recentOrders?.reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0) /
          (recentOrders?.length || 1),
        peakHours: [7, 8, 9, 12, 13, 18, 19, 20],
        demandForecast: "moderate", // This would be more sophisticated in a real AI system
      }

      return recommendations
    } catch (error) {
      console.error("Pricing recommendations error:", error)
      return null
    }
  }

  return {
    loading,
    calculateDeliveryFee,
    getPricingRecommendations,
  }
}
