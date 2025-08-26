# Imagen base ligera con Node.js
FROM node:20-alpine

# Instalar dependencias necesarias para ts-node
RUN apk add --no-cache bash git python3 make g++

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer puerto de la app
EXPOSE 3000

# Comando para ejecutar la app con ts-node
CMD ["npm", "start"]
