"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("welcome");
Route.post("/register", "UserController.createUser");
Route.post("/login", "UserController.login");
Route.get("/profile", "UserController.getProfile").middleware(["auth:jwt"]);
Route.get("/metadata", "MetaDataController.getMetaData").middleware([
  "auth:jwt"
]);
Route.post("/create-product", "ProductController.addProduct");
Route.get("/all-products", "ProductController.getProducts");
