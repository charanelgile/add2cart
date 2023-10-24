const mongoose = require("mongoose");

const dbconnect = async (url) => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("\nDatabase Connection: Successful");
};

module.exports = dbconnect;
