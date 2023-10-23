// Libraries / Packages
require("dotenv").config();
const express = require("express");

// Database Connection
const dbconnect = require("./database/dbconnect");

// Routers
const productRouters = require("./routes/productRoutes");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Endpoints
app.use("/api/v1/products", productRouters);

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
