FROM node:16 as build-stage
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm install
RUN npm run build

RUN npm install --cache /tmp/empty-cache
RUN npm cache verify
RUN npm cache clean --force

FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /var/www/html/
#/usr/share/nginx/html
# Copy the default nginx.conf
#COPY --from=build-stage /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]