<script setup>
import { useTodosStore } from '~/stores/todos'

const store = useTodosStore()

onMounted(() => store.fetchTodos())
</script>

<template>
  <h1>Todo API project</h1>
  <p v-if="store.loading">Loading...</p>
  <p v-else-if="store.error">{{ store.error }}</p>
  <pre v-else>{{ store.todos }}</pre>
</template>