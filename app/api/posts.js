// Purpose: lists every endpoint of the "posts" resource in ONE place.
// Each function = one endpoint. It only knows the URL, the method, and the data to send.
// It does not know about stores, pages, or UI. That keeps it simple and reusable.
// http() comes from app/utils/http.js and is auto-imported by Nuxt.

// GET /posts  -> list of posts.
// params is optional, e.g. { _limit: 10 } becomes /posts?_limit=10
export const getPosts = (params = {}) => {
  return http('/posts', { query: params })
}

// GET /posts/1  -> a single post
export const getPostById = (id) => {
  return http(`/posts/${id}`)
}

// POST /posts  -> create a post. payload = { title, body, userId }
export const createPost = (payload) => {
  return http('/posts', { method: 'POST', body: payload })
}

// PUT /posts/1  -> replace/update an existing post
export const updatePost = (id, payload) => {
  return http(`/posts/${id}`, { method: 'PUT', body: payload })
}

// DELETE /posts/1  -> remove a post
export const deletePost = (id) => {
  return http(`/posts/${id}`, { method: 'DELETE' })
}