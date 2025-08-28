# Imagen base
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 8080

# Comando para iniciar
CMD ["node", "server.js"]
