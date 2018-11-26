# RESTful-API
RESTful API Using Node, Express and MongoDB

The aims of this project are as follows:

To build a simple web-service.

To get more experience in writing a non-trivial JavaScript program.

To get some experience using the express.js framework.

Specifications
Write a command-line nodejs program which is invoked as:

$ ./index.js PORT
This invocation should start a web server listening on port PORT. It should use the mongo database at mongodb://localhost:27017/users as its database.

The web server should respond to the following relative URL's (relative to the base url of scheme, hostname and port) and HTTP methods:

PUT /users/ID
The request must have a body which must be a JSON object. If the request is successful then it must store the entire JSON object so that it can be retrieved by the ID part of the URL.

If there was a previously created user for ID, then the server should update it to the JSON object provided in the request and return a status code of 204 NO CONTENT.
If there was no previously created user for ID, then the server must create a user for ID set to the JSON object and return a 201 CREATED status code with a Location header set to the request URL.

GET /users/ID
This request should return a JSON of the information previously stored under ID. If the user specified by ID is not found, then the server must return a 404 NOT FOUND status code.

DELETE /users/ID
This request should delete the object previously stored under ID. If the user specified by ID is not found, then the server must return a 404 NOT FOUND status code.

POST /users/ID
This request is used to update the user stored for ID. The body of this request must be a JSON object. If the ID field of the URL does not reference an existing user, then the server must return a 404 NOT_FOUND status code. Otherwise it should replace the user stored under ID with the contents of the JSON object in the body of the request and return a 303 SEE OTHER status code with Location header set to the request URL.
