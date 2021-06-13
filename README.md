docker-start

## Building the docker image with the name `node-app-image`

`docker build -t node-app-image .`

## Listing docker images/volumes

`docker image ls`
`docker volume ls`

- deleting volumes
`docker volume prune`

## Deleting docker image, container, volume
 
- image:
`docker rm <image id> `
-container:
`docker rm <container id> -f`
volume with container:
`docker rm <container id> -fv`

## Runnig the docker container
- -d flag means detached mode so you can run the docker cli
- 1st 3000 is traffic coming from the internet
- 2nd 3000 is container's port on the local network

`docker run -p 3000:3000 -d --name <container id> <image id>`

## Killing the docker container

`docker rm <container id> -f`

## Loging into the docker container

`docker exec -it <container id> bash`

### Logs:

`docker logs <container id>`

## Listing the docker containers

`docker ps`

## Syncing the local code with docker container

- ro after specifying the volumes means read only to preventing the creation of new files from docker container

`docker run -v <linux/mac:$(pwd) | windows cmd: %cd% | powershell: ${pwd}>:<workdir>:ro -p 3000:3000 -d --name <container id> <image id>`

- example:
- with ENV vars not in file
`docker run -v %cd%:/src:ro -v /src/node_modules --env PORT=4000 -p 3000:4000 -d --name node-app node-app-image`
- ENV vars within the .env file
`docker run -v %cd%:/src:ro -v /src/node_modules --env-file ./.env -p 3000:4000 -d --name node-app node-app-image`

- for printing env vars in exec bash mode:
`docker exec -it <container id> bash`
`printenv`