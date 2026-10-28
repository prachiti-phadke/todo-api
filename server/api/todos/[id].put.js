export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const todo = await updateTodo(id, body ?? {})
  if (!todo) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }
  return todo
})