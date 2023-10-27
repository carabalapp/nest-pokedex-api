<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar el siguiente comando
```
$ npm install ó yarn install
```
3. Tener nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d

para este paso debo tener instalado la imagen de mongo db

ejemplo: docker pull mongo:5.0.0
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Reconstruir la BD con la semilla, usando el siguiente cURL
```
curl --location 'localhost:3000/api/v2/seed'
```

## Stack usado
* Mongo DB
* NestJS
* TablePlus
* Docker


# Production build docker

1. Crear el archivo __.env.prod__
2. Llenar las variables de entorno de pro
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
4. Correr la app sin hacer el build
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```