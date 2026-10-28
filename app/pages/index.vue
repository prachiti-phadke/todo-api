<!-- Purpose: the posts screen. Shows the table and decides WHEN to open the dialog
     or ask for delete confirmation. The actual saving happens in the dialog and store. -->

<script setup>
const postStore = usePostStore()
const { posts, loading, error, totalPosts } = storeToRefs(postStore)

await callOnce(() => postStore.fetchPosts({ _limit: 20 }))

// ---------- Dialog control ----------
const dialogVisible = ref(false)  // is the popup open?
const selectedPost = ref(null)    // null = create mode, a post = edit mode

function openCreate() {
  selectedPost.value = null
  dialogVisible.value = true
}

function openEdit(row) {
  selectedPost.value = row
  dialogVisible.value = true
}

// ---------- Delete ----------
async function handleDelete(row) {
  // Ask first. If the user clicks Cancel, confirm() rejects and we simply stop.
  try {
    await ElMessageBox.confirm(`Delete post #${row.id}?`, 'Confirm delete', {
      type: 'warning',
      confirmButtonText: 'Delete',
    })
  } catch {
    return
  }

  try {
    await postStore.removePost(row.id)
    ElMessage.success('Post deleted')
  } catch {
    ElMessage.error('Delete failed')
  }
}
</script>

<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Posts ({{ totalPosts }})</span>
          <div>
            <el-button :loading="loading" @click="postStore.fetchPosts({ _limit: 20 })">Refresh</el-button>
            <el-button type="primary" @click="openCreate">New post</el-button>
          </div>
        </div>
      </template>

      <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />

      <el-table v-loading="loading" :data="posts" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="userId" label="User" width="80" />
        <el-table-column prop="title" label="Title" min-width="240" show-overflow-tooltip />
        <el-table-column prop="body" label="Body" min-width="320" show-overflow-tooltip />

        <!-- #default="{ row }" gives access to the data of the current row -->
        <el-table-column label="Actions" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- v-model links dialogVisible to the dialog's modelValue prop -->
    <PostFormDialog v-model="dialogVisible" :post="selectedPost" />
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>