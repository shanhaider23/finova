
FROM node:18-alpine


WORKDIR /app


COPY . .


RUN npm install --legacy-peer-deps

# Build the project
RUN npm run build


EXPOSE 3000


CMD ["npm", "run", "start"]