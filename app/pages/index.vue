<!-- Purpose: the "container" page. It is the only file that talks to the store.
     It passes data DOWN to the components (props) and listens to their events UP (emits).
     Components used here are auto-imported from app/components. -->

<script setup>
const postStore = usePostStore()
const { posts, loading, error, totalPosts } = storeToRefs(postStore)

// One function for loading, so the "20" is written in only one place.
const refresh = () => postStore.fetchPosts({ _limit: 20 })

await callOnce(refresh)

// ---------- Dialog control ----------
const dialogVisible = ref(false)
const selectedPost = ref(null) // null = create mode, a post = edit mode

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
  try {
    await ElMessageBox.confirm(`Delete post #${row.id}?`, 'Confirm delete', {
      type: 'warning',
      confirmButtonText: 'Delete',
    })
  } catch {
    return // user pressed Cancel
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
      <!-- The card stays here; PostHeader fills its header slot -->
      <template #header>
        <PostHeader :total="totalPosts" :loading="loading" @refresh="refresh" @create="openCreate" />
      </template>

      <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />

      <PostTable :posts="posts" :loading="loading" @edit="openEdit" @delete="handleDelete" />
    </el-card>

    <PostFormDialog v-model="dialogVisible" :post="selectedPost" />
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px;
}
</style>