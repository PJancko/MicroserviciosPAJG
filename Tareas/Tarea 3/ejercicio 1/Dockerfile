# Imagen base ligera con Node.js
FROM node:20-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache bash git python3 make g++

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Exponer puerto donde corre tu app
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "server.js"]
