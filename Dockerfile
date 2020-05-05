#Necessario alterar dependencias em package.json para alguns pacotes
#conseguirem ser compilados durante a construção do Container Docker

# TODO: Necessário construir container somente com arquivos compilados em Dist.
# TODO: Necessario construção de container Windows caso seja necessario.

FROM node:latest as angular
WORKDIR /app
COPY package.json /app
RUN npm install --prod --silent
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular app/dist/usercenter /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 3000

# docker build -t usercenter .
# docker run -p 8081:80 usercenter
