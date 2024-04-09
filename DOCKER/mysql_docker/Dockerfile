# Get the lastest mysql image
FROM mysql:latest

# Set the environment variable
ENV MYSQL_DATABASE=blog_db
ENV MYSQL_ROOT_PASSWORD=root_password

# Usuario para la base de datos
ENV MYSQL_USER=blog_user
ENV MYSQL_PASSWORD=blog_password

# Copiar el script de creación de la base de datos
COPY schema.sql ./docker-entrypoint-initdb.d/