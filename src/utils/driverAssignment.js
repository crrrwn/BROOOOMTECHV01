export class DriverAssignment {
  constructor() {
    this.maxDistance = 10 // km
    this.weightFactors = {
      distance: 0.4,
      rating: 0.3,
      completionRate: 0.2,
      responseTime: 0.1,
    }
  }

  async findOptimalDriver(orderData, availableDrivers) {
    if (!availableDrivers || availableDrivers.length === 0) {
      return null
    }

    const scoredDrivers = await Promise.all(availableDrivers.map((driver) => this.scoreDriver(driver, orderData)))

    // Filter drivers within acceptable distance
    const eligibleDrivers = scoredDrivers.filter((driver) => driver.distance <= this.maxDistance)

    if (eligibleDrivers.length === 0) {
      return null
    }

    // Sort by score (highest first)
    eligibleDrivers.sort((a, b) => b.totalScore - a.totalScore)

    return eligibleDrivers[0]
  }

  async scoreDriver(driver, orderData) {
    const distance = this.calculateDistance(
      { lat: driver.current_lat, lng: driver.current_lng },
      { lat: orderData.pickup_lat, lng: orderData.pickup_lng },
    )

    const distanceScore = this.getDistanceScore(distance)
    const ratingScore = this.getRatingScore(driver.rating)
    const completionScore = this.getCompletionScore(driver.completion_rate)
    const responseScore = this.getResponseScore(driver.avg_response_time)

    const totalScore =
      distanceScore * this.weightFactors.distance +
      ratingScore * this.weightFactors.rating +
      completionScore * this.weightFactors.completionRate +
      responseScore * this.weightFactors.responseTime

    return {
      ...driver,
      distance,
      distanceScore,
      ratingScore,
      completionScore,
      responseScore,
      totalScore,
    }
  }

  calculateDistance(point1, point2) {
    // Haversine formula for calculating distance between two points
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat)
    const dLng = this.toRad(point2.lng - point1.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180)
  }

  getDistanceScore(distance) {
    // Closer drivers get higher scores
    if (distance <= 1) return 100
    if (distance <= 3) return 80
    if (distance <= 5) return 60
    if (distance <= 8) return 40
    return 20
  }

  getRatingScore(rating) {
    // Convert rating (1-5) to score (0-100)
    return (rating / 5) * 100
  }

  getCompletionScore(completionRate) {
    // Completion rate is already a percentage
    return completionRate || 100
  }

  getResponseScore(avgResponseTime) {
    // Lower response time gets higher score
    if (avgResponseTime <= 60) return 100 // 1 minute
    if (avgResponseTime <= 180) return 80 // 3 minutes
    if (avgResponseTime <= 300) return 60 // 5 minutes
    if (avgResponseTime <= 600) return 40 // 10 minutes
    return 20
  }

  async assignDriverToOrder(orderId, driverId) {
    // This would update the order with the assigned driver
    // and notify both the driver and customer
    try {
      // Update order in database
      // Send notifications
      // Log assignment

      return {
        success: true,
        orderId,
        driverId,
        assignedAt: new Date(),
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async getDriverRecommendations(orderData, limit = 5) {
    // Get all available drivers
    const availableDrivers = await this.getAvailableDrivers()

    // Score and rank drivers
    const recommendations = await Promise.all(availableDrivers.map((driver) => this.scoreDriver(driver, orderData)))

    // Filter and sort
    return recommendations
      .filter((driver) => driver.distance <= this.maxDistance)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
  }

  async getAvailableDrivers() {
    // This would query the database for online, approved drivers
    // For now, return mock data
    return []
  }

  optimizeRoutes(orders, drivers) {
    // Advanced route optimization for multiple orders and drivers
    // This would implement algorithms like:
    // - Vehicle Routing Problem (VRP)
    // - Traveling Salesman Problem (TSP)
    // - Genetic algorithms for optimization

    const optimizedAssignments = []

    // Simple greedy assignment for now
    orders.forEach((order) => {
      const bestDriver = this.findOptimalDriver(order, drivers)
      if (bestDriver) {
        optimizedAssignments.push({
          orderId: order.id,
          driverId: bestDriver.id,
          estimatedTime: this.estimateDeliveryTime(order, bestDriver),
          route: this.calculateRoute(order, bestDriver),
        })
      }
    })

    return optimizedAssignments
  }

  estimateDeliveryTime(order, driver) {
    const distance = this.calculateDistance(
      { lat: driver.current_lat, lng: driver.current_lng },
      { lat: order.pickup_lat, lng: order.pickup_lng },
    )

    const pickupDistance = this.calculateDistance(
      { lat: order.pickup_lat, lng: order.pickup_lng },
      { lat: order.delivery_lat, lng: order.delivery_lng },
    )

    // Assume average speed of 30 km/h in city traffic
    const totalDistance = distance + pickupDistance
    const estimatedMinutes = (totalDistance / 30) * 60 + 10 // +10 minutes buffer

    return Math.round(estimatedMinutes)
  }

  calculateRoute(order, driver) {
    return {
      start: { lat: driver.current_lat, lng: driver.current_lng },
      pickup: { lat: order.pickup_lat, lng: order.pickup_lng },
      delivery: { lat: order.delivery_lat, lng: order.delivery_lng },
      totalDistance:
        this.calculateDistance(
          { lat: driver.current_lat, lng: driver.current_lng },
          { lat: order.pickup_lat, lng: order.pickup_lng },
        ) +
        this.calculateDistance(
          { lat: order.pickup_lat, lng: order.pickup_lng },
          { lat: order.delivery_lat, lng: order.delivery_lng },
        ),
    }
  }
}

export const driverAssignment = new DriverAssignment()
