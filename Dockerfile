FROM node:14.18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build client and server
ARG MY_ENV
ARG NODE_ENV
ARG REACT_APP_SITE_KEY
ENV MY_ENV=${MY_ENV}
ENV NODE_ENV=${NODE_ENV}
ENV REACT_APP_SITE_KEY=${REACT_APP_SITE_KEY}
RUN echo "Hey Your ENV is : "$MY_ENV "NODE_ENV = "$NODE_ENV "REACT_APP_SITE_KEY = "$REACT_APP_SITE_KEY

RUN npm run build:client
RUN npm run build:server

# Expose the port and run the application
ENV PORT 3002
EXPOSE ${PORT}
CMD ["npm", "run", "start"]






