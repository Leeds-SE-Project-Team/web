# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./e2e ./e2e
COPY ./src ./src
COPY ./public ./
COPY .env ./
COPY index.html ./
COPY vite.config.ts ./
COPY vitest.config.ts ./

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm serve
RUN pnpm install
RUN pnpm build-only
RUN rm -fr node_modules

EXPOSE 3000

# Start the app using serve command
CMD [ "serve", "-s", "dist" ]