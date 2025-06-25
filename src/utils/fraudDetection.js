export class FraudDetection {
  constructor() {
    this.riskThresholds = {
      low: 30,
      medium: 60,
      high: 80,
    }
    this.fraudPatterns = {
      rapidCancellations: 3,
      fakeAddresses: 2,
      failedDeliveries: 5,
      suspiciousPayments: 2,
    }
  }

  analyzeOrder(orderData, userHistory) {
    let riskScore = 0
    const flags = []

    // Check for rapid cancellations
    const recentCancellations = this.countRecentCancellations(userHistory)
    if (recentCancellations >= this.fraudPatterns.rapidCancellations) {
      riskScore += 25
      flags.push("rapid_cancellations")
    }

    // Check for fake addresses
    if (this.isSuspiciousAddress(orderData.delivery_address)) {
      riskScore += 20
      flags.push("suspicious_address")
    }

    // Check for unusual order patterns
    if (this.hasUnusualOrderPattern(orderData, userHistory)) {
      riskScore += 15
      flags.push("unusual_pattern")
    }

    // Check payment method consistency
    if (this.hasSuspiciousPaymentPattern(orderData, userHistory)) {
      riskScore += 20
      flags.push("suspicious_payment")
    }

    // Check for duplicate orders
    if (this.isDuplicateOrder(orderData, userHistory)) {
      riskScore += 30
      flags.push("duplicate_order")
    }

    return {
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      flags,
      recommendation: this.getRecommendation(riskScore),
    }
  }

  countRecentCancellations(userHistory) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return userHistory.filter((order) => order.status === "cancelled" && new Date(order.created_at) > oneDayAgo).length
  }

  isSuspiciousAddress(address) {
    const suspiciousKeywords = ["test", "fake", "dummy", "sample", "asdf", "qwerty", "123", "abc"]

    const lowerAddress = address.toLowerCase()
    return suspiciousKeywords.some((keyword) => lowerAddress.includes(keyword))
  }

  hasUnusualOrderPattern(orderData, userHistory) {
    if (userHistory.length === 0) return false

    // Check for unusual order value
    const avgOrderValue =
      userHistory.reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0) / userHistory.length

    const currentOrderValue = Number.parseFloat(orderData.total_amount)

    // Flag if order is 3x higher than average
    if (currentOrderValue > avgOrderValue * 3) {
      return true
    }

    // Check for unusual time patterns
    const currentHour = new Date().getHours()
    const userTypicalHours = userHistory.map((order) => new Date(order.created_at).getHours())

    const isUnusualTime = !userTypicalHours.some((hour) => Math.abs(hour - currentHour) <= 2)

    return isUnusualTime && userHistory.length > 5
  }

  hasSuspiciousPaymentPattern(orderData, userHistory) {
    // Check for frequent payment method changes
    const recentOrders = userHistory.slice(-5)
    const paymentMethods = new Set(recentOrders.map((order) => order.payment_method))

    return paymentMethods.size > 3
  }

  isDuplicateOrder(orderData, userHistory) {
    const recentOrders = userHistory.filter((order) => {
      const orderTime = new Date(order.created_at)
      const now = new Date()
      return now - orderTime < 30 * 60 * 1000 // 30 minutes
    })

    return recentOrders.some(
      (order) => order.delivery_address === orderData.delivery_address && order.service_type === orderData.service_type,
    )
  }

  getRiskLevel(riskScore) {
    if (riskScore >= this.riskThresholds.high) return "high"
    if (riskScore >= this.riskThresholds.medium) return "medium"
    if (riskScore >= this.riskThresholds.low) return "low"
    return "minimal"
  }

  getRecommendation(riskScore) {
    if (riskScore >= this.riskThresholds.high) {
      return "block_order"
    }
    if (riskScore >= this.riskThresholds.medium) {
      return "manual_review"
    }
    if (riskScore >= this.riskThresholds.low) {
      return "monitor"
    }
    return "approve"
  }

  detectAnomalies(orderData) {
    const anomalies = []

    // Check for impossible delivery times
    if (orderData.delivery_time && orderData.pickup_time) {
      const timeDiff = new Date(orderData.delivery_time) - new Date(orderData.pickup_time)
      if (timeDiff < 0) {
        anomalies.push("impossible_delivery_time")
      }
    }

    // Check for unrealistic distances
    if (orderData.distance && orderData.distance > 100) {
      anomalies.push("unrealistic_distance")
    }

    // Check for suspicious item descriptions
    const suspiciousItems = ["weapon", "drug", "illegal", "stolen"]
    if (orderData.items_description) {
      const description = orderData.items_description.toLowerCase()
      if (suspiciousItems.some((item) => description.includes(item))) {
        anomalies.push("suspicious_items")
      }
    }

    return anomalies
  }

  generateFraudReport(userId, timeRange = 30) {
    // This would typically query the database for user's order history
    // and generate a comprehensive fraud risk assessment
    return {
      userId,
      timeRange,
      totalOrders: 0,
      cancelledOrders: 0,
      failedDeliveries: 0,
      riskScore: 0,
      riskLevel: "low",
      recommendations: [],
    }
  }
}

export const fraudDetection = new FraudDetection()
