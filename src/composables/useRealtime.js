import { ref, onUnmounted } from "vue"
import { useSupabase } from "./useSupabase"

export function useRealtime() {
  const { subscribeToTable, unsubscribe } = useSupabase()
  const subscriptions = ref([])

  const subscribeToOrders = (callback, userId = null) => {
    const filter = userId ? `user_id=eq.${userId}` : null
    const subscription = subscribeToTable("orders", callback, filter)
    subscriptions.value.push(subscription)
    return subscription
  }

  const subscribeToOrderChats = (callback, orderId) => {
    const filter = `order_id=eq.${orderId}`
    const subscription = subscribeToTable("order_chats", callback, filter)
    subscriptions.value.push(subscription)
    return subscription
  }

  const subscribeToDrivers = (callback) => {
    const subscription = subscribeToTable("drivers", callback)
    subscriptions.value.push(subscription)
    return subscription
  }

  const subscribeToDriverApplications = (callback) => {
    const subscription = subscribeToTable("driver_applications", callback)
    subscriptions.value.push(subscription)
    return subscription
  }

  const unsubscribeAll = () => {
    subscriptions.value.forEach((subscription) => {
      unsubscribe(subscription)
    })
    subscriptions.value = []
  }

  onUnmounted(() => {
    unsubscribeAll()
  })

  return {
    subscribeToOrders,
    subscribeToOrderChats,
    subscribeToDrivers,
    subscribeToDriverApplications,
    unsubscribeAll,
  }
}
