Deployed to: https://blooming-garden-46514.herokuapp.com

# Deploy process

```
Note: If this is the first time setting up the project, then run:
$ yarn add heroku --dev
$ yarn run heroku login
$ yarn run heroku create
```

1. Commit your changes
2. `$ git push origin heroku`

```
Note: if you need any envvars setup, ensure to configure them as shown below:
$ yarn run heroku config:set MONGO_DB_URL="<Connection string>"
```