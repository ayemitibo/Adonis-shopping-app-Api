const metaData = use("App/Models/ProductCategory");

class metaDataController {
  async getMetaData({ request, response, auth }) {
    try {
      let metadata = await metaData.query().fetch();
      return response.status(200).send({
        message: "meta data sent successfully",
        data: metadata
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = metaDataController;
