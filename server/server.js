
const express = require('express');
const bodyParser = require('body-parser');

const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SEE_OTHER =303;

function serve(port, model){
const app = express();
app.locals.model = model;
app.locals.port = port;
setupRoutes(app);
app.listen(port, function(){
console.log(`listening on port ${port}`);
});
}

function setupRoutes(app){
	app.get('/users/:ID', getUsers(app));
	app.delete('/users/:ID', deleteUser(app));
    app.use('/users',bodyParser.json());
	app.use('/users/:ID',bodyParser.json());
	app.use('/users/:ID', cacheUser(app));
	app.put('/users/:ID', newUser(app));
	app.post('/users/:ID', updateUser(app));
}

module.exports = {
serve: serve
}


function cacheUser(app) {
	return function(request, response, next) {
        const id = request.params.ID;
        if(typeof id === 'undefined') {
            response.sendStatus(BAD_REQUEST);
        }
        else{
            request.app.locals.model.users.getUser(id).
            then(function(user){
                response.locals.user = user;
                next();
            }).
            catch((err) =>{
                next();
            });
        }
    }
}	

//Get User
function getUsers(app){
    return function(request, response) {
        const item = request.params.ID;
        if(typeof item === 'undefined'){
            response.sendStatus(BAD_REQUEST);
        }
        else{
            request.app.locals.model.users.getUser(item).
            then((results) => response.json(results)).
            catch((err) => {
                console.error(err);
                response.sendStatus(NOT_FOUND);
            });
        }
    };
}

//Delete User
function deleteUser(app) {
    return function(request,response) {
        const name=request.params.ID;
        if(typeof name === 'undefined') {
            response.sendStatus(BAD_REQUEST);
        }
        else{
            request.app.locals.model.users.deleteUser(name).
            then(() => response.end()).
            catch((err) => {
                console.error(err);
                response.sendStatus(NOT_FOUND);
            });
        }
    };
}


function requestUrl(req) {
    const port = req.app.locals.port;
	return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}


var isEmpty = function(obj){
    return Object.keys(obj).length === 0;
}

//New User
function newUser(app) {
	return function(request,response) {
        const userd =request.body;
        const id = request.params.ID;
        if(isEmpty(userd)){
            response.sendStatus(BAD_REQUEST);
        }
        else{
            const user = response.locals.user;
            if(user){
                request.app.locals.model.users.updateUser(userd,id).
                then(function(id){
                    response.append('Location', requestUrl(request) + '/' + id);
                    response.sendStatus(NO_CONTENT);
                }).
                catch((err)=> {
                    console.error(err);
                    response.sendStatus(SERVER_ERROR);
                });
            }
            else {
                request.app.locals.model.users.addUser(userd,id).
                then(function(id){
                    response.append('Location', requestUrl(request) + '/' + id);
                    response.sendStatus(CREATED);
                }).
                catch((err)=> {
                    console.error(err);
                    response.sendStatus(SERVER_ERROR);
                });
            }
        }
	};
}

//Update User
function updateUser(app){
	return function(request,response){
        const userd=request.body;
        const id= request.params.ID;
        if(isEmpty(userd)){
            response.sendStatus(BAD_REQUEST);
        }
        else{
            request.app.locals.model.users.updateUser(userd,id).
            then(function(id) {
                response.append('Location', requestUrl(request) + '/' + id);
                response.sendStatus(SEE_OTHER);
            }).
            catch((err) => {
                console.error(err);
                response.sendStatus(NOT_FOUND);
            });
        }
    };
}
