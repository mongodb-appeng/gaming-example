# Mongo Mega Microgames

This is an example web application game, Tic Tac Toe. It's written in VueJS/Vuex/Bulma and uses game platform services via Axios HTTP calls. The auth portion is done via the Realm SDK.

__NOTE__ This project structure follows the Vuex layout specified [here](https://vuex.vuejs.org/guide/structure.html#application-structure)

### To run in a docker container

Pre-reqs
- [Game Platform Services](https://github.com/mongodb-appeng/gaming-services-api)  (GPS) is running
- Edit and rename `docker/env.list.example` to `docker/env.list`

```bash
# run this example
docker run --rm -it -p 8888:8888 -p 3333:3000 --env-file docker/env.list --hostname gaming.local nullstring/gaming-example


# ---------------------------------------------------
# other stuff 
##  re-build the image
docker build -t nullstring/gaming-example .

## adhoc testing inside the container
git clone https://github.com/mongodb-appeng/gaming-example
cd gaming-example
docker run --rm -it -v $PWD:/root/gaming-example  -p 3333:3000 -p 8888:8888 --entrypoint /bin/bash --hostname gaming-dev.local nullstring/gaming-exmaple -c "npm install config serve"
```

## To run locally

Pre-reqs
- [Game Platform Services](https://github.com/mongodb-appeng/gaming-services-api) (GPS) is running
- Env vars `GPS_REALM_APP_ID` and `GPS_URI` are set

```bash
## Setup
npm install

### Development
npm run serve

### Production
npm run build
```

__made by mongoDB with <3__
