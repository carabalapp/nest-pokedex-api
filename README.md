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
docker-composer up -d

para este paso debo tener instalado la imagen de mongo db

ejemplo: docker pull mongo:5.0.0
```

## Stack usado
* Mongo DB
* NestJS
* TablePlus
* Docker