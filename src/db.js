'use strict'
const connection = require('./conn.js') // Importar la conexion de la base de datos
const conn = connection.pool

// Funcion para leer todos los Posts
async function leerPosts() {
  const [rows] = await conn.query('SELECT * FROM Posts')
  return rows
}

// Funcion para leer un Post especifico
async function leerPostEspecifico(id) {
  const [row] = await conn.query('SELECT * FROM Posts WHERE id = ?', [id])
  return row
}

// Funcion para crear un post
async function crearPost(title, content) {
  const [result] = await conn.query(
    'INSERT INTO Posts (title, content) VALUES (?, ?)',
    [title, content]
  )
  return result
}

// Funcion para crear un post con imagen
async function crearPostConImagen(title, content, image) {
  const [result] = await conn.query(
    'INSERT INTO Posts (title, content, image) VALUES (?, ?, ?)',
    [title, content, image]
  )
  return result
}

// Funcion para actualizar un post
async function actualizarPost(id, title, content) {
  const [result] = await conn.query(
    'UPDATE Posts SET title = ?, content = ? WHERE id = ?',
    [title, content, id]
  )
  return result
}

// Funcion para actualizar un post con imagen
async function actualizarPostConImagen(id, title, content, image) {
  const [result] = await conn.query(
    'UPDATE Posts SET title = ?, content = ?, image = ? WHERE id = ?',
    [title, content, image, id]
  )
  return result
}

// Funcion para eliminar un post
async function eliminarPost(id) {
  const [result] = await conn.query('DELETE FROM Posts WHERE id = ?', [id])
  return result
}


// Exportar las funciones al server
module.exports = {
  leerPosts,
  leerPostEspecifico,
  crearPost,
  crearPostConImagen,
  actualizarPost,
  actualizarPostConImagen,
  eliminarPost
}
