// Utility to create storage buckets programmatically
import { supabase } from "../supabase/supabaseClient.js"

export async function createStorageBuckets() {
  try {
    console.log("Creating storage buckets...")

    const buckets = [
      {
        id: "payment-proofs",
        name: "payment-proofs",
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
      },
      {
        id: "prescriptions",
        name: "prescriptions",
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
      },
      {
        id: "order-images",
        name: "order-images",
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      },
      {
        id: "user-uploads",
        name: "user-uploads",
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
      },
    ]

    const results = []

    for (const bucket of buckets) {
      try {
        // Check if bucket already exists
        const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
          console.error("Error listing buckets:", listError)
          results.push({ bucket: bucket.id, status: "error", error: listError.message })
          continue
        }

        const bucketExists = existingBuckets.some((b) => b.id === bucket.id)

        if (bucketExists) {
          console.log(`Bucket ${bucket.id} already exists`)
          results.push({ bucket: bucket.id, status: "exists" })
          continue
        }

        // Create the bucket
        const { data, error } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes,
        })

        if (error) {
          console.error(`Error creating bucket ${bucket.id}:`, error)
          results.push({ bucket: bucket.id, status: "error", error: error.message })
        } else {
          console.log(`Bucket ${bucket.id} created successfully`)
          results.push({ bucket: bucket.id, status: "created", data })
        }
      } catch (bucketError) {
        console.error(`Exception creating bucket ${bucket.id}:`, bucketError)
        results.push({ bucket: bucket.id, status: "error", error: bucketError.message })
      }
    }

    const successCount = results.filter((r) => r.status === "created" || r.status === "exists").length
    const errorCount = results.filter((r) => r.status === "error").length

    console.log(`Bucket creation summary: ${successCount} successful, ${errorCount} errors`)

    return {
      success: errorCount === 0,
      results,
      summary: {
        total: buckets.length,
        successful: successCount,
        errors: errorCount,
      },
    }
  } catch (error) {
    console.error("Error in createStorageBuckets:", error)
    return { success: false, error: error.message }
  }
}

// Function to check if buckets exist
export async function checkBuckets() {
  try {
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error("Error listing buckets:", error)
      return { success: false, error: error.message }
    }

    const requiredBuckets = ["payment-proofs", "prescriptions", "order-images", "user-uploads"]
    const existingBuckets = data.map((bucket) => bucket.id)
    const missingBuckets = requiredBuckets.filter((bucket) => !existingBuckets.includes(bucket))

    console.log("Existing buckets:", existingBuckets)
    console.log("Missing buckets:", missingBuckets)

    return {
      success: true,
      existingBuckets,
      missingBuckets,
      allBucketsExist: missingBuckets.length === 0,
    }
  } catch (error) {
    console.error("Error checking buckets:", error)
    return { success: false, error: error.message }
  }
}

// Auto-initialize buckets when imported
export async function initializeBuckets() {
  try {
    console.log("Initializing storage buckets...")

    const checkResult = await checkBuckets()
    if (!checkResult.success) {
      console.error("Failed to check buckets:", checkResult.error)
      return checkResult
    }

    if (checkResult.allBucketsExist) {
      console.log("All required buckets already exist")
      return { success: true, message: "All buckets exist" }
    }

    console.log(`Missing buckets: ${checkResult.missingBuckets.join(", ")}`)
    console.log("Creating missing buckets...")

    const createResult = await createStorageBuckets()
    return createResult
  } catch (error) {
    console.error("Error initializing buckets:", error)
    return { success: false, error: error.message }
  }
}
