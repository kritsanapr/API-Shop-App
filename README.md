## API Shop App

### API shop app with express.

#### Stack

- [x] NodeJs
- [x] ExpressJs
- [x] MongoDB
- [x] Typescript

### Setup and initial project.

### Package in our app.

```
npm install mongoose
```

```
npm install express @types/express body-parser @types/body-parser cookie-session @types/cookie-session cors @types/cors dotenv @types/dotenv
```

```
npm install nodemon --save-dev
```

### Setup package.json file like this.

```
"scripts": {
    "compile": "tsc && node ./dist/src/main.js",
    "start": "nodemon -e ts --exec \"npm run compile\""
  },
```

and make sure you install nodemon in dev dependency.

run command

```
npm run start
```
