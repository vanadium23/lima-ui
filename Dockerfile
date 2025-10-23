FROM node:20.17.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the dev server port (default Astro dev port is 4321)
EXPOSE 4321

# Start the dev server
CMD ["npm", "run", "dev:docker"]
