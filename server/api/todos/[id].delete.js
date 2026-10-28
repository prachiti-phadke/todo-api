export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const removed = await deleteTodo(id)
  if (!removed) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }
  return { ok: true }
})