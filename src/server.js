'use strict'

const express = require('express')
const cors = require('cors')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const fs = require('fs')
const db = require('./db.js')

const PORT = 3000
const app = express()

const baseregex = /^data:([A-Za-z-+/]+);base64,(.+)$/

function handleUnsupportedMethod(req, res, next) {
  if (['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next()
  }
  res.status(501).send('Not Implemented')
  return null
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./src/index.js']
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

app.use(express.json())
app.use(cors())

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
)

app.use(handleUnsupportedMethod)

/**
 * @swagger
 * /posts:
 *    get:
 *      summary: Listar todas las publicaciones
 *      tags: [Blogs]
 *      responses:
 *        '200':
 *          description: Listado de todas las publicaciones
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    title:
 *                      type: string
 *                    content:
 *                      type: string
 *        '500':
 *          description: Error interno del servidor
 *    post:
 *      summary: Crear nuevo post
 *      tags: [Blogs]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *      responses:
 *        '200':
 *          description: El post creado.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *        '500':
 *          description: Error interno del servidor
 * /posts/{id}:
 *    get:
 *      summary: Obtener detalles de un post
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: El id del post
 *      responses:
 *        '200':
 *          description: El post que se busca
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *        '400':
 *          description: Mala solicitud
 *        '500':
 *          description: Error interno del servidor
 *    put:
 *      summary: Actualizar un post por id
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: El id del post
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                content:
 *                  type: string
 *      responses:
 *        '200':
 *          description: El libro ha sido actualizado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *        '400':
 *          description: Mala solicitud
 *        '500':
 *          description: Error interno del servidor
 *    delete:
 *      summary: Eliminar un post por su id
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: El id del post
 *      responses:
 *        '204':
 *          description: El libro ha sido eliminado
 *        '500':
 *          description: Error interno del servidor
 */
app.get('/posts', async (req, res) => {
  req.body = null
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: '/posts',
    payload: req.query,
    response: null
  }

  try {
    const posts = await db.getAllPosts()
    logEntry.response = posts
    res.status(200).json(posts)
  } catch (err) {
    logEntry.response = { error: err }
    res.status(500).json({ error: err })
  } finally {
    fs.appendFile('log.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

app.get('/posts/:id', async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: '/posts/:id',
    payload: req.query,
    response: null
  }

  try {
    const id = req.params.id
    const post = await db.getPostById(id)
    logEntry.response = post
    res.status(200).json(post)
  } catch (err) {
    logEntry.response = { error: err }
    res.status(500).json({ error: err })
  } finally {
    fs.appendFile('log.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

app.post('/posts', async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: '/posts',
    payload: req.body,
    response: null
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
        const post = await db.createPostWithImage(title, content, image)
        logEntry.response = post
        res.status(200).json(post)
      } else {
        throw new Error('Bad Request')
      }
    } else {
      const post = await db.createPost(title, content)
      logEntry.response = post
      res.status(200).json(post)
    }
  } catch (err) {
    logEntry.response = { error: err }
    if (res.status(err.isBoom)) {
      res.status(400).json({ error: err })
    } else {
      res.status(500).json({ error: err })
    }
  } finally {
    fs.appendFile('log.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

app.put('/posts/:id', async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: '/posts/:id',
    payload: req.body,
    response: null
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
        const post = await db.updatePostWithImage(id, title, content, image)
        logEntry.response = post
        res.status(200).json(post)
      } else {
        throw new Error('Bad Request')
      }
    } else {
      const post = await db.updatePost(id, title, content)
      logEntry.response = post
      res.status(200).json(post)
    }
  } catch (err) {
    logEntry.response = { error: err }
    if (res.status(err.isBoom)) {
      res.status(400).json({ error: err })
    } else {
      res.status(500).json({ error: err })
    }
  } finally {
    fs.appendFile('log.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

app.delete('/posts/:id', async (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint: '/posts/:id',
    payload: req.body,
    response: null
  }

  try {
    const id = req.params.id
    const post = await db.deletePost(id)
    logEntry.response = post
    res.status(204).json(post)
  } catch (err) {
    logEntry.response = { error: err }
    res.status(500).json({ error: err })
  } finally {
    fs.appendFile('log.txt', JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

app.use((req, res) => {
  res.status(404).send('404 Not Found: El endpoint solicitado no existe.')
})

app.listen(PORT)
