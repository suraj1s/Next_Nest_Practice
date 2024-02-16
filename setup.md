create server and package.json with name, version and privete: true

```sh
yarn workspace server add typescript -D
# (from here : "name": "server") -d as a devdependency
yarn workspace server add tsc-watch -D

cd ./apps/server
tsc --init
# creates a typescript configution directory
# change tsconfig.json
"rootDir": "./src"
 "outDir": "./dist", # put all the compiled code in dist folder
# add these script in package.josn
 "scripts": {
        "start": "node dist/index.js",
        "build" : "tsc -p .",
        "dev": "tsc-watch --onSuccess \"node dist/index.js\"" # on compilation success open dist/index.js in watch mode
    },

```
