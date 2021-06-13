docker-start

## Building the docker image with the name `node-app-image`

`docker build -t node-app-image`

## Listing docker images

`docker image ls`

## Deleting the specifing docker iamge

`docker rm <image id> `

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

`docker run -v <linux/mac:$(pwd) | windows cmd: %cd% | powershell: ${pwd}>:<workdir> -p 3000:3000 --name <container id> <image id>`

- example:
`docker run -v %cd%:/src -v /src/node_modules -p 3000:3000 -d --name node-app node-app-image`
