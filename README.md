# Shakepay

The project was created using Typescript and ReactJS.

## How to run it?

Clone the project by running:

```
git clone https://github.com/otaviobps/shakepay.git
```

Then enter the `shakepay` directory.

### Using Docker

1. To run the project you need to build the docker image:

```
docker build -t shakepay .
```

**Important: Docker must have at least 2GB ram to run the container, otherwise it will fail with a memory heap error. This is because React will build the project, and it needs 2GB or more of ram.**

2. After building the image, run the container. You need to bind a port to the container. Internally the port 80 is exposed because the container uses NGINX, but you need to bind some port of the host to the port 80 of the container:

```
docker run -d -p 3000:80 shakepay
```

3. Enter `localhost:3000` in your browser. The `-p 3000:80` command binds the port 3000 of the host to the port 80 of the container. If port 3000 is already in use in your computer, change the port in the command to any available port, keeping the `:80` part of the command, then in the browser enter `localhost:<theportyouchose>`

### Not using Docker

If you don't want to run it in Docker, you can run the development version:

1. You need to have Nodejs installed in your computer. You can install it by visiting the [Nodejs](https://nodejs.org/en/) website.


2. Then, run:
```
npm install
```
This will install all dependencies of the project.

3. Finally, run:
```
npm run start
```

The browser will open showing the chart.

You can also build the production version, follow the instructions shown [here](https://create-react-app.dev/docs/production-build/).