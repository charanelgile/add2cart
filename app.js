// Libraries / Packages
require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

// Database Connection
const dbconnect = require("./database/dbconnect");

// Routers
const productRouters = require("./routes/productRoutes");

// Error Handlers
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 3001;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Endpoints
app.use("/api/v1/products", productRouters);

app.use(errorHandler);

const startServer = async () => {
  try {
    await dbconnect(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(
        `Starting the Server: Successful\n\nhttp://127.0.0.1:${port} \n`
      );
    });
  } catch (error) {
    console.log(`\nDatabase Connection: Failed\n\n${error} \n`);
  }
};

startServer();
