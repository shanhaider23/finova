# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Next.js application
RUN npm run build

# List the contents of the .next directory to verify the build
RUN ls -la .next

# Expose the port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]