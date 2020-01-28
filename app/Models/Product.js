"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  productCategory() {
    return this.hasOne(
      "App/Models/ProductCategory",
      "product_categories_id",
      "id"
    );
  }
}

module.exports = Product;
