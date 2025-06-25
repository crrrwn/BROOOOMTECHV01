import { supabase } from "../../supabase/supabaseClient.js"

export function useSupabase() {
  // Auth methods
  const signUp = async (email, password, userData, userType = "user") => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            ...userData,
          },
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const getCurrentUser = () => {
    return supabase.auth.getUser()
  }

  const getCurrentSession = () => {
    return supabase.auth.getSession()
  }

  // Database methods
  const select = (table, columns = "*") => {
    return supabase.from(table).select(columns)
  }

  const insert = (table, data) => {
    return supabase.from(table).insert(data)
  }

  const update = (table, data) => {
    return supabase.from(table).update(data)
  }

  const deleteRecord = (table) => {
    return supabase.from(table).delete()
  }

  // Storage methods
  const uploadFile = async (bucket, path, file) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getPublicUrl = (bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }

  const deleteFile = async (bucket, path) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).remove([path])

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Realtime methods
  const subscribeToTable = (table, callback, filter = null) => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          ...(filter && { filter }),
        },
        callback,
      )
      .subscribe()

    return subscription
  }

  const unsubscribe = (subscription) => {
    supabase.removeChannel(subscription)
  }

  return {
    supabase,
    // Auth
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getCurrentSession,
    // Database
    select,
    insert,
    update,
    deleteRecord,
    // Storage
    uploadFile,
    getPublicUrl,
    deleteFile,
    // Realtime
    subscribeToTable,
    unsubscribe,
  }
}
