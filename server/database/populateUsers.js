/*** ONE-TIME EXECUTION ONLY, TO POPULATE THE DATABASE WITH SAMPLE USERS ***/

require("dotenv").config({ path: "../.env" });

const dbconnect = require("./dbconnect");
const User = require("../models/User");
const users = require("../sample-data/users.json");

const populateUsers = async () => {
  try {
    await dbconnect(process.env.MONGO_URI);

    // Empty the database collection first (optional)
    await User.deleteMany();

    // Populate the database collection with sample users
    await User.create(users);

    console.log(`\nDatabase successfully populated with sample users\n`);

    // End Process with Exit Code 0 for Success
    process.exit(0);
  } catch (error) {
    console.log(`\nDatabase Connection: Failed\n${error}\n`);

    // End Process with Exit Code 1 for Error
    process.exit(1);
  }
};

populateUsers();
