<!-- Purpose: displays the list of posts in an Element Plus table.
     Like PostHeader, it only displays data and reports clicks.
     It never decides what "edit" or "delete" actually does. -->

<script setup>
defineProps({
  posts: { type: Array, default: () => [] },  // the rows to show
  loading: { type: Boolean, default: false }, // shows the spinner over the table
})

// We send the whole row object, so the parent knows which post was clicked.
defineEmits(['edit', 'delete'])
</script>

<template>
  <el-table v-loading="loading" :data="posts" stripe style="width: 100%">
    <el-table-column prop="id" label="ID" width="70" />
    <el-table-column prop="userId" label="User" width="80" />
    <el-table-column prop="title" label="Title" min-width="240" show-overflow-tooltip />
    <el-table-column prop="body" label="Body" min-width="320" show-overflow-tooltip />

    <el-table-column label="Actions" width="160" fixed="right">
      <!-- #default="{ row }" gives us the data of the current row -->
      <template #default="{ row }">
        <el-button size="small" @click="$emit('edit', row)">Edit</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>