# pull official base image
FROM node:15-alpine AS build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install yarn
RUN apk add yarn

# install app dependencies
COPY package.json /app/package.json
RUN yarn install --silent
RUN yarn global add react-scripts@4.0.1 --silent

# add app
COPY . /app

# build app
RUN yarn run build

# serve the app
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
