export class PricingAI {
  constructor() {
    this.baseRate = 50
    this.perKmRate = 15
    this.timeMultipliers = {
      peak: 1.5,
      normal: 1.0,
      off: 0.8,
    }
    this.serviceMultipliers = {
      food_delivery: 1.0,
      pay_bills: 0.8,
      pickup: 1.1,
      surprise_delivery: 1.3,
      medicines: 1.2,
      grocery: 1.4,
      pabili: 1.1,
    }
  }

  calculateOptimalPrice(orderData) {
    const { distance, serviceType, timeOfDay, driverAvailability, weatherCondition } = orderData

    let price = this.baseRate + distance * this.perKmRate

    // Time-based pricing
    const timeMultiplier = this.getTimeMultiplier(timeOfDay)
    price *= timeMultiplier

    // Service type multiplier
    const serviceMultiplier = this.serviceMultipliers[serviceType] || 1.0
    price *= serviceMultiplier

    // Driver availability multiplier
    const availabilityMultiplier = this.getAvailabilityMultiplier(driverAvailability)
    price *= availabilityMultiplier

    // Weather condition multiplier
    const weatherMultiplier = this.getWeatherMultiplier(weatherCondition)
    price *= weatherMultiplier

    return Math.round(price)
  }

  getTimeMultiplier(timeOfDay) {
    const hour = new Date(timeOfDay).getHours()

    // Peak hours: 7-9 AM, 12-1 PM, 6-8 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 12 && hour <= 13) || (hour >= 18 && hour <= 20)) {
      return this.timeMultipliers.peak
    }

    // Off-peak hours: 10 PM - 6 AM
    if (hour >= 22 || hour <= 6) {
      return this.timeMultipliers.off
    }

    return this.timeMultipliers.normal
  }

  getAvailabilityMultiplier(driverCount) {
    if (driverCount < 3) return 1.8
    if (driverCount < 5) return 1.5
    if (driverCount < 10) return 1.2
    return 1.0
  }

  getWeatherMultiplier(condition) {
    const weatherMultipliers = {
      rain: 1.3,
      storm: 1.5,
      clear: 1.0,
      cloudy: 1.0,
    }

    return weatherMultipliers[condition] || 1.0
  }

  predictDemand(historicalData) {
    // Simple demand prediction based on historical patterns
    const currentHour = new Date().getHours()
    const currentDay = new Date().getDay()

    // Filter historical data for same time patterns
    const similarTimeOrders = historicalData.filter((order) => {
      const orderHour = new Date(order.created_at).getHours()
      const orderDay = new Date(order.created_at).getDay()
      return Math.abs(orderHour - currentHour) <= 1 && orderDay === currentDay
    })

    const averageOrders = similarTimeOrders.length / 4 // Assuming 4 weeks of data

    if (averageOrders > 10) return "high"
    if (averageOrders > 5) return "medium"
    return "low"
  }

  optimizePricing(marketData) {
    const { competitorPrices, customerSensitivity, profitMargin } = marketData

    // Calculate optimal price based on market conditions
    const avgCompetitorPrice = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length

    // Adjust pricing strategy based on customer sensitivity
    let optimalPrice = avgCompetitorPrice

    if (customerSensitivity === "high") {
      optimalPrice *= 0.95 // 5% below average
    } else if (customerSensitivity === "low") {
      optimalPrice *= 1.05 // 5% above average
    }

    // Ensure minimum profit margin
    const minPrice = this.baseRate * (1 + profitMargin)
    optimalPrice = Math.max(optimalPrice, minPrice)

    return Math.round(optimalPrice)
  }
}

export const pricingAI = new PricingAI()
