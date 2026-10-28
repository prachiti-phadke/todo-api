import { promises as fs } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), 'data')
const file = join(dir, 'todos.json')

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'))
  } catch {
    return []
  }
}

async function writeAll(todos) {
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(file, JSON.stringify(todos, null, 2))
}

export async function listTodos() {
  return readAll()
}

export async function createTodo(title) {
  const todos = await readAll()
  const todo = { id: Date.now(), title, done: false }
  todos.push(todo)
  await writeAll(todos)
  return todo
}

export async function updateTodo(id, changes) {
  const todos = await readAll()
  const todo = todos.find((t) => t.id === id)
  if (!todo) return null                       // nothing with that id
  if (typeof changes.title === 'string' && changes.title.trim()) {
    todo.title = changes.title.trim()
  }
  if (typeof changes.done === 'boolean') {
    todo.done = changes.done
  }
  await writeAll(todos)
  return todo
}

export async function deleteTodo(id) {
  const todos = await readAll()
  const remaining = todos.filter((t) => t.id !== id)
  if (remaining.length === todos.length) return false   // nothing was removed
  await writeAll(remaining)
  return true
}