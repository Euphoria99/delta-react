1. register and login -frontend 

both use same code, we just based on condition login or register

if its register, we target /register route
if its login, the login route 

2. register  -backend

hashing password with hashSync

creating user with this hashed password and username

we create a JWT token, which includes a userId and a username.

we set the JWT token as a cookie named 'token' in the browser.

we also send a JSON response with the user's ID (createdUser._id) in the HTTP response body.


3. login -backend 

Receive inputs (username and password) with req.body.

Use the findOne method of MongoDB to find the user in the database based on the provided username.

Check if a user with the provided username exists in the database.

If a user is found, compare the password provided in the form with the hashed password stored in the database.

If the passwords match (indicated by the passOk variable), it means the user has successfully authenticated.

Create a JWT token, which includes a userId and a username to represent the user's session.

Set the JWT token as a cookie named 'token' in the browser with the specified options (sameSite: 'none' and secure: true, which are common for cross-origin authentication when using HTTPS).

Send a JSON response with the user's ID (foundUser._id) in the HTTP response body.
