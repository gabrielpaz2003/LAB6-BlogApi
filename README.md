# API de Blog - Laboratorio 6

## Descripción
Este proyecto es el backend para una aplicación de blog desarrollada como parte del Laboratorio 6. Permite a los usuarios realizar operaciones CRUD sobre posts de blog, incluyendo crear, listar, actualizar y eliminar posts. Está construido sobre Node.js y Express, y utiliza Swagger para la documentación de la API.

## Requisitos
- Node.js
- NPM

## Instalación
1. Clona el repositorio:
git clone https://github.com/gabrielpaz2003/LAB6-BlogApi.git

2. Navega al directorio del proyecto:
cd LAB6-BlogApi


3. Instala las dependencias del proyecto:
npm install


## Uso
Para iniciar el servidor, ejecuta:
npm start

El servidor estará corriendo en `http://localhost:3000`.

## Endpoints de la API

### Posts

- **GET /posts**: Listar todas las publicaciones.
  - **Respuestas**:
    - `200 OK`: Retorna un arreglo de todos los posts.
    - `500 Internal Server Error`: Error al recuperar los posts.

- **POST /posts**: Crear un nuevo post.
  - **Cuerpo de la solicitud**: JSON con `title` y `content`.
  - **Respuestas**:
    - `200 OK`: Retorna el post creado.
    - `500 Internal Server Error`: Error al crear el post.

- **GET /posts/{id}**: Obtener detalles de un post específico.
  - **Parámetros**:
    - `id` (en la ruta): ID del post a recuperar.
  - **Respuestas**:
    - `200 OK`: Retorna los detalles del post especificado.
    - `400 Bad Request`: ID del post no válido.
    - `500 Internal Server Error`: Error al recuperar el post.

- **PUT /posts/{id}**: Actualizar un post por ID.
  - **Parámetros**:
    - `id` (en la ruta): ID del post a actualizar.
  - **Cuerpo de la solicitud**: JSON con `title` y `content`.
  - **Respuestas**:
    - `200 OK`: Retorna el post actualizado.
    - `400 Bad Request`: Solicitud incorrecta.
    - `500 Internal Server Error`: Error al actualizar el post.

- **DELETE /posts/{id}**: Eliminar un post por su ID.
  - **Parámetros**:
    - `id` (en la ruta): ID del post a eliminar.
  - **Respuestas**:
    - `204 No Content`: El post ha sido eliminado exitosamente.
    - `500 Internal Server Error`: Error al eliminar el post.

## Documentación de la API

La documentación completa de la API, generada con Swagger, está disponible en `http://localhost:3000/api-docs` una vez que el servidor esté en ejecución.

## Desarrollado por

Gabriel Paz

## Licencia

Este proyecto está bajo la Licencia ISC.
