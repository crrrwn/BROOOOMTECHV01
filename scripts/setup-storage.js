import { createStorageBuckets, checkBuckets } from "../src/utils/createStorageBuckets.js"

console.log("🚀 Setting up Supabase Storage Buckets...")

async function setupStorage() {
  try {
    // First check existing buckets
    console.log("📋 Checking existing buckets...")
    const checkResult = await checkBuckets()

    if (!checkResult.success) {
      console.error("❌ Failed to check buckets:", checkResult.error)
      return
    }

    console.log("✅ Existing buckets:", checkResult.existingBuckets)

    if (checkResult.allBucketsExist) {
      console.log("🎉 All required buckets already exist!")
      return
    }

    console.log("⚠️ Missing buckets:", checkResult.missingBuckets)

    // Create missing buckets
    console.log("🔧 Creating missing buckets...")
    const createResult = await createStorageBuckets()

    if (createResult.success) {
      console.log("🎉 Storage setup completed successfully!")
      console.log("📊 Summary:", createResult.summary)
    } else {
      console.error("❌ Storage setup failed:", createResult.error)
    }

    // Final verification
    console.log("🔍 Final verification...")
    const finalCheck = await checkBuckets()
    if (finalCheck.success && finalCheck.allBucketsExist) {
      console.log("✅ All buckets are now ready!")
      console.log("📁 Available buckets:", finalCheck.existingBuckets)
    } else {
      console.log("⚠️ Some buckets may still be missing:", finalCheck.missingBuckets)
    }
  } catch (error) {
    console.error("💥 Setup failed with error:", error)
  }
}

// Run the setup
setupStorage()
