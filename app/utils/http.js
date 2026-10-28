// Purpose: one single function that every API call in the project goes through.
// Nuxt auto-imports files in app/utils, so other files can call http() without an import line.

export async function http(url, options = {}) {
  // Read the base URL we configured in Steps 1 and 2 (.env -> nuxt.config.ts -> here).
  // This must be called inside the function, not at the top of the file,
  // because Nuxt config is only available while the app is running.
  const config = useRuntimeConfig()

  try {
    // $fetch is Nuxt's built-in request function.
    // baseURL + url = full address, e.g. https://jsonplaceholder.typicode.com + /posts
    // options lets the caller pass method, body, query, etc.
    // When body is an object, $fetch automatically converts it to JSON.
    return await $fetch(url, {
      baseURL: config.public.apiBase,
      ...options,
    })
  } catch (error) {
    // One place to log failures. We re-throw so the caller (the store) can show an error message.
    console.error(`[http] ${options.method || 'GET'} ${url} failed:`, error.message)
    throw error
  }
}