<!-- Purpose: the top bar of the card: title with the post count, plus the action buttons.
     It owns no data and calls no API. It receives values through props
     and tells the parent what the user clicked through emits. -->

<script setup>
// props: data coming IN from the parent page
defineProps({
  total: { type: Number, default: 0 },       // number shown in "Posts (20)"
  loading: { type: Boolean, default: false }, // makes the Refresh button show a spinner
})

// emits: events going OUT to the parent page
defineEmits(['refresh', 'create'])
</script>

<template>
  <div class="card-header">
    <span>Posts ({{ total }})</span>
    <div>
      <!-- $emit('refresh') just announces "the user clicked Refresh". The page decides what to do. -->
      <el-button :loading="loading" @click="$emit('refresh')">Refresh</el-button>
      <el-button type="primary" @click="$emit('create')">New post</el-button>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>