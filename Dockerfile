# Use an official Node.js base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /usr/src/app

COPY . .

# Build the Next.js app
RUN npm install
RUN npm run build

# Start the Next.js app
CMD ["npm", "start"]