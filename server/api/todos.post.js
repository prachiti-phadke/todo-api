export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.title || !body.title.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  setResponseStatus(event, 201)
  return createTodo(body.title.trim())
})