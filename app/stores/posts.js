// Purpose: the single shared "memory" for posts data.
// Any page or component can read the same list, loading flag, and error
// without passing props around or calling the API twice.

// Explicit import because app/api is not an auto-import folder (see Step 4).
import { getPosts, createPost, updatePost, deletePost } from '~/api/posts'

// defineStore('posts', ...) registers the store under the id "posts".
// Convention: the exported function is named useXxxStore.
// Nuxt + @pinia/nuxt auto-import it from app/stores, so no import is needed where we use it.
export const usePostStore = defineStore('posts', () => {
  // ---------- STATE (the data we keep) ----------
  const posts = ref([])        // the list shown in the table
  const loading = ref(false)   // true while a request is running (used for the table spinner)
  const error = ref(null)      // holds an error message if something fails

  // ---------- GETTER (a value calculated from state) ----------
  const totalPosts = computed(() => posts.value.length)

  // ---------- ACTIONS (functions that change the state) ----------

  // Load the list from the API
  async function fetchPosts(params = {}) {
    loading.value = true
    error.value = null
    try {
      posts.value = await getPosts(params)
    } catch (e) {
      error.value = 'Failed to load posts. Please try again.'
    } finally {
      // finally runs on success AND failure, so the spinner always stops
      loading.value = false
    }
  }

  // Create a post, then add it to the top of our local list
  async function addPost(payload) {
    const created = await createPost(payload)
    posts.value.unshift(created)
    return created
  }

  // Update a post, then replace it in our local list
  async function editPost(id, payload) {
    const updated = await updatePost(id, payload)
    const index = posts.value.findIndex((p) => p.id === id)
    if (index !== -1) posts.value[index] = updated
    return updated
  }

  // Delete a post, then remove it from our local list
  async function removePost(id) {
    await deletePost(id)
    posts.value = posts.value.filter((p) => p.id !== id)
  }

  // Everything returned here is visible to components. Anything not returned stays private.
  return { posts, loading, error, totalPosts, fetchPosts, addPost, editPost, removePost }
})