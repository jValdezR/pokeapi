<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm install
```
3. Instalar Nest CLI
```
npm i -g @nest/cli
```
4. Levantar la db
```
docker-compose up -d
```
5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicacion
```
npm run start
```
8. Reconstruir la db
```
localhost:3000/seed/
```

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entordo de prod
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build```
## Stack usado
* MongoDB
* Nest# pokeapi
# pokeapi-nest
