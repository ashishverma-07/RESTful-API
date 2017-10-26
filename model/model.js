//const carts = require('./carts');
//const products = require('./products');
const users = require('./users');

function Model(db) {
    this.users = new users.Users(db);
  //this.carts = new carts.Carts(db);
  //this.products = new products.Products(db);
}


module.exports = {
  Model: Model
};
