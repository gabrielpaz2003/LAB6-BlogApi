'use strict'

const connection = require('./conn.js')
const conn = connection.pool

async function getAllPosts() {
  const [rows] = await conn.query('SELECT * FROM blogs')
  return rows
}

async function getPostById(id) {
  const [row] = await conn.query('SELECT * FROM blogs WHERE id = ?', [id])
  return row
}

async function createPost(title, content) {
  const [result] = await conn.query(
    'INSERT INTO blogs (title, content) VALUES (?, ?)',
    [title, content]
  )
  return result
}

async function createPostWithImage(title, content, image) {
  const [result] = await conn.query(
    'INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)',
    [title, content, image]
  )
  return result
}

async function deletePost(id) {
  const [result] = await conn.query('DELETE FROM blogs WHERE id = ?', [id])
  return result
}

async function updatePost(id, title, content) {
  const [result] = await conn.query(
    'UPDATE blogs SET title = ?, content = ? WHERE id = ?',
    [title, content, id]
  )
  return result
}

async function updatePostWithImage(id, title, content, image) {
  const [result] = await conn.query(
    'UPDATE blogs SET title = ?, content = ?, image = ? WHERE id = ?',
    [title, content, image, id]
  )
  return result
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
  createPostWithImage,
  updatePostWithImage
}
