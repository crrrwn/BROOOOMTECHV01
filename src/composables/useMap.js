import { ref } from "vue"
import { Loader } from "@googlemaps/js-api-loader"

const GOOGLE_MAPS_API_KEY = "AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o"

export function useMap() {
  const map = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places", "geometry"],
  })

  const initializeMap = async (elementId, options = {}) => {
    loading.value = true
    try {
      const google = await loader.load()
      const mapElement = document.getElementById(elementId)

      const defaultOptions = {
        center: { lat: 14.5995, lng: 120.9842 }, // Manila, Philippines
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }

      map.value = new google.maps.Map(mapElement, { ...defaultOptions, ...options })
      return map.value
    } catch (err) {
      error.value = err
      console.error("Map initialization error:", err)
    } finally {
      loading.value = false
    }
  }

  const addMarker = async (position, options = {}) => {
    if (!map.value) return null

    try {
      const google = await loader.load()
      const marker = new google.maps.Marker({
        position,
        map: map.value,
        ...options,
      })
      return marker
    } catch (err) {
      console.error("Marker creation error:", err)
      return null
    }
  }

  const calculateDistance = async (origin, destination) => {
    try {
      const google = await loader.load()
      const service = new google.maps.DistanceMatrixService()

      return new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === "OK") {
              const result = response.rows[0].elements[0]
              resolve({
                distance: result.distance,
                duration: result.duration,
              })
            } else {
              reject(new Error("Distance calculation failed"))
            }
          },
        )
      })
    } catch (err) {
      console.error("Distance calculation error:", err)
      throw err
    }
  }

  const geocodeAddress = async (address) => {
    try {
      const google = await loader.load()
      const geocoder = new google.maps.Geocoder()

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK") {
            const location = results[0].geometry.location
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formatted_address: results[0].formatted_address,
            })
          } else {
            reject(new Error("Geocoding failed"))
          }
        })
      })
    } catch (err) {
      console.error("Geocoding error:", err)
      throw err
    }
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }

  return {
    map,
    loading,
    error,
    initializeMap,
    addMarker,
    calculateDistance,
    geocodeAddress,
    getCurrentLocation,
  }
}
