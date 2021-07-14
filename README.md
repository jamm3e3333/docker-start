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
- 1st 3000 is traffic coming from the internet (left)
- 2nd 3000 is container's port on the local network (right)

`docker run -p 3000:3000 -d --name <container id> <image id>`

## Killing the docker container

`docker rm <container id> -f`

## Loging into the docker container

`docker exec -it <container id> bash`

### Logs:

`docker logs <container id>`

- -f to follow the log

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

# Docker compose
- running the docker compose file:
(-d detached mode -> using cli)
`docker-compose up -d`
- killing the docker compose file (-v with the volumes)
`docker-compose down -v`

When changing something in the app the image needs to be build again
`docker-compose up -d --build`

3 docker compose files
- 1st for sharing the setting between dev and prod
- 2nd the developing compose file
- 3rd the prod compose file

for dev:
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

for already running services to rebuild and renew anon volumes
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --renew-anon-volumes`

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build -V`

for prod:
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

- --node-deps -> starting the service withou dependecies

logging into the mongodb:
`docker exec -it <name of the container> <name of the db> mongo -u "<user>" -p "<password>"`

# Network and connection between containers
- getting the settings of the container
`docker inspect <docker container>`

- getting the network settings of containers
`docker network ls`

- inspecting the specific network
`docker network inspect <docker network>`

# Installing the redis and express session

`npm i redis connect-redis express-session`

# Scaling the app

- adding two instances of the node app

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale <docker container>=2`

# Prod on ubuntu server

installing docker 

1. `curl -fsSL https://get.docker.com -o get-docker.sh`
2. `sh get-docker.sh`

installing docker compose 

1. `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
2. `sudo chmod +x /usr/local/bin/docker-compose
`
creating env variables
`export <env var name>="<env var value>"`

showing env variables
`printenv`

creating a file on ubuntu server for env vars
`vi .env`
then
`vi .profile`
in this file:
```
    ~
    ~
    set -o allexport; source /root/.env; set +o allexport
```

the last command is gonna loop through the file and export
all the env vars

building docker file only for node-app
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --no-deps <docker container (service)>`

rebuilding the docker container
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate --no-deps <docker container (service)>`

# Docker hub
login 
`docker login`

## 1st time pushing
pushing to the repo
- first creating the admitable tag for docker hub
`docker image tag <docker image> <username>/<docker image>`
- pushing to the docker hub
`docker push <username>/<docker image>:<docker tag>(optional)`

building image for production for specific service
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml build <docker container (service)>`

## after 1st time building for prod
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml push <docker container(service)>`
- it's going to push the image that has been built for that service

pulling the image from the docker hub from the prod server
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull`

# LIFECYCLE OF THE DOCKER CI/CD
1. step
- Updating the app localy
- running `docker-compose -f docker-compose.yml -f docker-compose.prod.yml build (<docker service>)`
- all images cann be created of specific
2. step
- pushing changes to docker hub
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml push <docker service>`
- all of the images can be pushed or just specific
- if docker.compose file is changed -> push to github -> pulling by the prod server
3. step 
- pulling changes
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull <docker service>`
- pulling all services or just specific
4. step
- running up the docker compose
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps <docker service>` -> this command checks for the version of the images, if it's different then it will rebuild the docker container
- running and rebuilding all services or just those specific ones without deps

# Automating pulling and building on prod server 
automating by running the watchtower container

`docker run -d --name wathctower -e WATCHTOWER_LOGS=true -e WATCHTOWER_DEBUG=true -e WATCHTOWER_POLL_INTERVAL=50 -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower <docker-container>`

- shutting down the container
`docker rm watchtower -f`

- logs and debugs and msgs
`docker logs watchtower -f`

# Docker Swarm
docker swarm doesn't work with containers but it works with services
swarm is unintialized by default

to initialize it 
`docker swarm init --advertise-addr <ip address of the prod server>`

add a new worker node
`docker swarm join --token <docker swarm token> <ip addr of the prod server>`

add a manager node to the swarm
`docker swarm join-token manager`

running the docker swarm command afrer pulling the git repo

`docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml <name of the stack>`

listing nodes 
`docker node ls`

listing stack 
`docker stack ls`

listing all the services == `docker ps`
`docker stack services <name of the docker stack>`

listing all the services throughout the system
`docker service ls`

listing tasks
`docker stack ps <name of the docker stack>`


