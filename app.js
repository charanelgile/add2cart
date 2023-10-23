require("dotenv").config();
const express = require("express");

const dbconnect = require("./database/dbconnect");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

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
