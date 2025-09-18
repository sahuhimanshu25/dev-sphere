FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source files
COPY . .

# Render sets PORT env variable; server should listen to it
# EXPOSE 3000 is optional for documentation
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
