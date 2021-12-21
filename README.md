# node_skeleton_auth
skeleton files for a node, express and mongodb with jwt auth

project setup:

1) npm install
2) add environment variables in .env file
3) npm run deploy:dev


predefined routes:
1) <baseurl>/api/v1/auth/login  > user and admin login
2) <baseurl>/api/v1/auth/register > registers a user with user role
3) <baseurl>/api/v1/users > returns a list of users :admin only
4) <baseurl>/api/v1/auth > returns accessToken, refreshToken for a given refreshToken

sample requests file: requests.rest 


