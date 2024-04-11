'use strict'

// Configuaciones del Servidor
const PORT = 3000
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

// Configuaciones de la Base de Datos
const db = require('./db.js')
const baseregex = /^data:([A-Za-z-+/]+);base64,(.+)$/ // Expresion regular para validar imagenes base64

// Configuaciones de los Logs
const fs = require('fs')


// Funcion para verificar verbos de Requests
function verbosHTTP(req, res, next) {
  if (['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next()
  }
  res.status(501).send('Not Implemented')
  return null
}
app.use(verbosHTTP)

// Configuaciones del Swagger
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./src/server.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
)

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operaciones relacionadas con los posts
 */

/**
 * @swagger
 * /posts:
 *    get:
 *      summary: Listar todas las publicaciones
 *      tags: [Posts]
 *      responses:
 *        '200':
 *          description: Listado de todas las publicaciones
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Post'
 *        '500':
 *          description: Error interno del servidor
 *    post:
 *      summary: Crear un nuevo post
 *      tags: [Posts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      responses:
 *        '200':
 *          description: El post ha sido creado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '500':
 *          description: Error interno del servidor
 */

/**
 * @swagger
 * /posts/{id}:
 *    get:
 *      summary: Obtener detalles de un post específico
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: El ID del post
 *      responses:
 *        '200':
 *          description: Detalles del post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Solicitud incorrecta
 *        '500':
 *          description: Error interno del servidor
 *    put:
 *      summary: Actualizar un post por ID
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: El ID del post
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      responses:
 *        '200':
 *          description: El post ha sido actualizado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Solicitud incorrecta
 *        '500':
 *          description: Error interno del servidor
 *    delete:
 *      summary: Eliminar un post por ID
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: El ID del post a eliminar
 *      responses:
 *        '204':
 *          description: El post ha sido eliminado
 *        '500':
 *          description: Error interno del servidor
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del post
 *         title:
 *           type: string
 *           description: El título del post
 *         content:
 *           type: string
 *           description: El contenido del post
 *       example:
 *         id: d5fE_asz
 *         title: Título del post
 *         content: Contenido del post
 */

// Endpoint para obtener todos los posts de la base de datos
app.get('/posts', async (req, res) => {
  req.payload = null;
  const registro = {
    fecha: new Date().toISOString(),
    ruta: '/posts',
    data: req.query,
    respuesta: null
  };
  try {
    const post = await db.leerPosts();
    registro.respuesta = post;
    res.status(200).json(post);
  } catch (error) {
    registro.respuesta = { error };
    res.status(500).json({ error });
  } finally {
    fs.appendFile('api_logs.txt', JSON.stringify(registro) + '\n', (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
});

// Enpoint para obtener un post especifico
app.get('/posts/:id', async (req, res) => {
  const logEntry = {
    fecha: new Date().toISOString(),
    ruta: '/posts/:id',
    data: req.query,
    respuesta: null
  }
  try {
    const id = req.params.id
    const post = await db.leerPostEspecifico(id)
    logEntry.respuesta = post
    res.status(200).json(post)
  } catch (err) {
    logEntry.respuesta = { error: err }
    res.status(500).json({ error: err })
  } finally {
    fs.appendFile('api_logs.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

// Endpoint para crear un post
app.post('/posts', async (req, res) => {
  const logEntry = {
    fecha: new Date().toISOString(),
    ruta: '/posts',
    data: req.body,
    respuesta: null
  }
  try {
    const title = req.body.title
    const content = req.body.content
    const image = req.body.image
    if (!title || !content) {
      throw new Error('Bad Request')
    }
    if (image) {
      if (baseregex.test(image)) {
        const post = await db.crearPostConImagen(title, content, image)
        logEntry.respuesta = post
        res.status(200).json(post)
      } else {
        throw new Error('Bad Request')
      }
    } else {
      const post = await db.crearPost(title, content)
      logEntry.respuesta = post
      res.status(200).json(post)
    }
  } catch (err) {
    logEntry.respuesta = { error: err }
    if (res.status(err.isBoom)) {
      res.status(400).json({ error: err })
    } else {
      res.status(500).json({ error: err })
    }
  } finally {
    fs.appendFile('api_logs.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})



// Endpoint para actualizar un post
app.put('/posts/:id', async (req, res) => {
  const logEntry = {
    fecha: new Date().toISOString(),
    ruta: '/posts/:id',
    data: req.body,
    respuesta: null
  }
  try {
    const id = req.params.id
    const title = req.body.title
    const content = req.body.content
    const image = req.body.image
    if (!title || !content) {
      throw new Error('Bad Request')
    }
    if (image) {
      if (baseregex.test(image)) {
        const post = await db.actualizarPostConImagen(id, title, content, image)
        logEntry.respuesta = post
        res.status(200).json(post)
      } else {
        throw new Error('Bad Request')
      }
    } else {
      const post = await db.actualizarPost(id, title, content)
      logEntry.respuesta = post
      res.status(200).json(post)
    }
  } catch (err) {
    logEntry.respuesta = { error: err }
    if (res.status(err.isBoom)) {
      res.status(400).json({ error: err })
    } else {
      res.status(500).json({ error: err })
    }
  } finally {
    fs.appendFile('api_logs.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

// Endpoint para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  const logEntry = {
    fecha: new Date().toISOString(),
    ruta: '/posts/:id',
    data: req.body,
    respuesta: null
  }
  try {
    const id = req.params.id
    const post = await db.eliminarPost(id)
    logEntry.respuesta = post
    res.status(204).json(post)
  } catch (err) {
    logEntry.respuesta = { error: err }
    res.status(500).json({ error: err })
  } finally {
    fs.appendFile('api_logs.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

app.listen(PORT)
console.log(`Server running on port ${PORT}`)

app.use((req, res) => { // funcion de validacion de endpoints
  res.status(404).send('404 Not Found: El endpoint solicitado no existe.')
})

