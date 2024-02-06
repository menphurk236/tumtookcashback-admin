FROM node:16
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm install
RUN npm run build

# Step 2: Set up the production environment
FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]