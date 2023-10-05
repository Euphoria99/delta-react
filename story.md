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


profile -backend

The endpoint first checks for the presence of a token in the request cookies. 
 If a token is found in the cookies, it proceeds to verify the token's validity using a JSON Web Token (JWT) verification mechanism. 
 Upon successful token verification, the endpoint decodes the JWT to extract user data (such as user ID or other relevant information) embedded within it.
 if the token is valid, the endpoint responds with a JSON object containing the user data. If no token is found in the request cookies or if the token verification fails, the endpoint responds with a 401 status code, indicating that access is unauthorized due to the absence of a valid token.

getUserDataFromRequest 

This function checks  first checks for the presence of a token in the request cookies.
If a token is found in the cookies, it proceeds to verify the token's validity using a JSON Web Token (JWT) verification mechanism. 
 Upon successful token verification, the endpoint decodes the JWT to extract user data (such as user ID or other relevant information) embedded within it.
 if the token is valid, the endpoint responds with a JSON object containing the user data. If no token is found in the request cookies or if the token verification fails, the endpoint responds with a 401 status code, indicating that access is unauthorized due to the absence of a valid token.

/messages/:userId 

First we extract userId from request body

then checks for the validity of token with getUserDataFromRequest

next we define userId from userData

Upon completing verification we then use .find method with $in operator to query messages based on userId and ourUserId for both sender and receiver 

The retrieved messages are sorted by the createdAt field in descending order (most recent messages first) using the .sort method



Certainly! Here's a documentation for the provided code:


connection.on("message")

**WebSocket Message Handling - Backend**

This code snippet is part of WebSocket message handling in the backend. It responds to incoming messages from WebSocket connections. 

1. **Event Listener**: This code is registered as an event listener for the "message" event on a WebSocket connection (`connection`). It means that whenever a message is received on this WebSocket connection, this code is executed.

2. **Message Data Parsing**: The incoming message is assumed to be a JSON string. It is parsed into a JavaScript object using `JSON.parse()`, resulting in `messageData`. This object is expected to contain properties like `recipient` (the intended recipient's user ID) and `text` (the content of the message).

3. **Validation**: The code checks if both `recipient` and `text` properties exist in `messageData`. This step ensures that the incoming message is well-formed and contains the necessary information.

4. **Message Creation**: If the message data is valid, it creates a new message document in a database, likely using an ORM or database model (e.g., `Message.create()`). The message document typically includes information such as the sender's user ID (`connection.userId`), the recipient's user ID (`recipient`), and the message text (`text`).

5. **Broadcasting Messages**: After creating the message document, it broadcasts the message to all WebSocket clients whose `userId` matches the `recipient`. It iterates through all connected WebSocket clients (`wss.clients`) and filters those whose `userId` matches the `recipient`. For each matching client, it sends the message content in JSON format using `c.send()`. This allows real-time messaging, where the message is instantly delivered to the intended recipient.

This code snippet represents a crucial part of real-time messaging functionality using WebSockets, ensuring that messages are received, stored in the database, and promptly delivered to the appropriate recipients.


people -

to grab all people info