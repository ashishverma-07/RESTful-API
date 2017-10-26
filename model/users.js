
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;

const USERS ='users';

function Users(db) {
    this.db = db;
    this.users=db.collection(USERS);
}

//Get a user
Users.prototype.getUser = function(id) {
    const searchSpec = {"_id": id};
	return this.users.find(searchSpec).toArray().
	then(function(users){
        return new Promise(function(resolve,reject){
            if(users.length === 1){
                resolve(users[0]);
            }
            else{
                reject(new Error(`cannot find user ${JSON.stringify(id)}`));
            }
        });
    });
}


Users.prototype.findUser = function(id) {
    return this.users.find(id).toArray();
}

//Delete a user
Users.prototype.deleteUser = function(id) {
    const searchSpec = {"_id": id};
	return this.users.deleteOne(searchSpec).
	then(function(results) {
        return new Promise(function(resolve, reject) {
            if (results.deletedCount === 1) {
                resolve();
            }
            else{
                reject(new Error(`cannot delete user ${id}`));
            }
        });
    });
}

//Add a user
Users.prototype.addUser = function(values,id) {
    return this.users.insertOne({"_id":id,values}).
	then(function(results) {
        return new Promise((resolve) => resolve(results.insertedID));
    });
}

//Update a user
Users.prototype.updateUser = function(values,id){
	const searchSpec = { "_id":id};
	return this.users.updateOne(searchSpec,{$set:{values:values}}).
	then(function(result){
        return new Promise(function(resolve, reject){
            if(result.modifiedCount != 1){
                reject(new Error(`updated ${result.modifiedCount} users`));
            }
            else{
                resolve();
            }
        });
    });
}

//Export Module
module.exports = {
    Users: Users
};

