# Usa la imagen de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Expone el puerto que usará la app
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]
