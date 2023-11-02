/*** ONE-TIME EXECUTION ONLY, TO POPULATE THE DATABASE WITH SAMPLE PRODUCTS ***/

require("dotenv").config({ path: "../.env" });

const dbconnect = require("./dbconnect");
const Product = require("../models/Product");
const products = require("../sample-data/products.json");

const populateProducts = async () => {
  try {
    await dbconnect(process.env.MONGO_URI);

    // Empty the database collection first (optional)
    await Product.deleteMany();

    // Populate the database collection with sample products
    await Product.create(products);

    console.log(
      `\nDatabase successfully populated with sample products\n`
    );

    // End Process with Exit Code 0 for Success
    process.exit(0);
  } catch (error) {
    console.log(`\nDatabase Connection: Failed\n${error}\n`);

    // End Process with Exit Code 1 for Error
    process.exit(1);
  }
};

populateProducts();
