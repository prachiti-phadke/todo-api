<!-- Purpose: a popup form used for BOTH "New post" and "Edit post".
     If it receives a `post` prop, it edits that post; if not, it creates a new one.
     Nuxt auto-imports files in app/components, so the page can use <PostFormDialog />
     without an import line (the file name becomes the tag name). -->

<script setup>
// props = data the parent gives us. modelValue is the open/closed flag for v-model.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  post: { type: Object, default: null }, // null = create mode, object = edit mode
})

// emits = events we send back to the parent. 'update:modelValue' is what makes v-model work.
const emit = defineEmits(['update:modelValue'])

const postStore = usePostStore()

const formRef = ref(null)  // gives us access to el-form methods like validate()
const saving = ref(false)  // disables the Save button while the request runs
const isEdit = computed(() => !!props.post)

// The values typed into the form
const form = reactive({ title: '', body: '', userId: 1 })

// Validation rules: Element Plus checks these when we call validate()
const rules = {
  title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
  body: [{ required: true, message: 'Body is required', trigger: 'blur' }],
}

// Each time the dialog opens, fill the form: existing values for edit, empty for create.
watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.title = props.post?.title ?? ''
    form.body = props.post?.body ?? ''
    form.userId = props.post?.userId ?? 1
    formRef.value?.clearValidate() // remove old red error messages
  }
)

const close = () => emit('update:modelValue', false)

async function submit() {
  // validate() rejects when a rule fails; we turn that into `false` and stop.
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await postStore.editPost(props.post.id, { ...form })
      ElMessage.success('Post updated')
    } else {
      await postStore.addPost({ ...form })
      ElMessage.success('Post created')
    }
    close()
  } catch (e) {
    ElMessage.error('Something went wrong. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <!-- :model-value + @update:model-value is the long form of v-model -->
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? 'Edit post' : 'New post'"
    width="500px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Body" prop="body">
        <el-input v-model="form.body" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="User ID" prop="userId">
        <el-input-number v-model="form.userId" :min="1" :max="10" />
      </el-form-item>
    </el-form>

    <!-- #footer is the dialog's slot for action buttons -->
    <template #footer>
      <el-button @click="close">Cancel</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Save</el-button>
    </template>
  </el-dialog>
</template>