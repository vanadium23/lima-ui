FROM node:20.19.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev:docker"]
