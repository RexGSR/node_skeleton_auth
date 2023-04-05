### node_skeleton_auth
### skeleton files with node, express, mongodb and jwt auth

### project setup

### installs project dependencies
```
npm install
```

### add environment variables: add changes in .env file

### start mongodb :only-if you are not using an atlas cluster

### start server 
```
npm run deploy:dev
```

### predefined routes:
```
<baseurl>/api/v1/auth/login
```
user and admin login

```
<baseurl>/api/v1/auth/register
```
registers a user with user role


```
<baseurl>/api/v1/auth
```
returns accessToken, refreshToken for a given refreshToken



### run database seeders
``` 
npm run seed -- SEEDER_NAME
```

#### for more customizations 
See NodeJs docs [Reference](https://nodejs.org/docs/latest-v14.x/api/)<br>
See ExpressJs docs [Reference](https://expressjs.com/en/5x/api.html)<br>
See Mongooose docs [Reference](https://mongoosejs.com/docs/)<br>
See npm packages [Reference](https://www.npmjs.com/)<br>
