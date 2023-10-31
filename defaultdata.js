const Products = require("./models/productSchema");
const productData = require("./constant/productsdata");

const DefaultData = async () => {
  try {
    await Products.deleteMany({});
    const data = await Products.insertMany(productData);
    console.log(data);
  } catch (error) {
    console.error("error" + error.message);
  }
};
module.exports = DefaultData;
