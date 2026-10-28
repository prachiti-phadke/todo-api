import { defineStore } from 'pinia'
import { api } from '~/utils/api'

export const useTodosStore = defineStore('todos', () => {
  const todos = ref([])          // STATE: the list
  const loading = ref(false)     // STATE: is a request running?
  const error = ref(null)        // STATE: the last error message

  const remaining = computed(    // GETTER: how many are not done
    () => todos.value.filter((t) => !t.done).length
  )

  function errorMessage(e) {
    return e.response?.data?.statusMessage || e.message
  }

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/todos')
      todos.value = response.data
    } catch (e) {
      error.value = errorMessage(e)
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title) {
    try {
      const response = await api.post('/todos', { title })
      todos.value.push(response.data)
      return true
    } catch (e) {
      error.value = errorMessage(e)
      return false
    }
  }

  async function updateTodo(id, changes) {
    try {
      const response = await api.put(`/todos/${id}`, changes)
      todos.value = todos.value.map((t) => (t.id === id ? response.data : t))
      return true
    } catch (e) {
      error.value = errorMessage(e)
      return false
    }
  }

  async function removeTodo(id) {
    try {
      await api.delete(`/todos/${id}`)
      todos.value = todos.value.filter((t) => t.id !== id)
      return true
    } catch (e) {
      error.value = errorMessage(e)
      return false
    }
  }

  return { todos, loading, error, remaining, fetchTodos, addTodo, updateTodo, removeTodo }
})