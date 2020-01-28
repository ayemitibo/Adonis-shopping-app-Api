"use strict";

const Products = use("App/Models/Product");
const Helpers = use("Helpers");
const Env = use("Env");

class ProductController {
  async addProduct({ request, response }) {
    try {
      const newProduct = new Products();
      newProduct.product_name = request.input("product_name");
      newProduct.product_price = request.input("product_price");
      newProduct.product_categories_id = request.input("product_categories_id");
      const profilePic = request.file("product_image", {
        types: ["image"],
        size: "3mb"
      });
      const fileName = `${Date.now()}-${profilePic.clientName}`;
      await profilePic.move(Helpers.publicPath(), {
        name: fileName,
        overwrite: true
      });

      if (!profilePic.moved()) {
        return profilePic.error();
      }

      newProduct.product_image = `${Env.get("APP_URL")}/${fileName}`;

      await newProduct.save();

      return response.status(201).send({
        message: "successfully created"
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getProducts({ request, response }) {
    try {
      const products = await Products.query()
        .with("productCategory")
        .fetch();

      return response.status(200).send({
        message: "all Products",
        data: products
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductController;
