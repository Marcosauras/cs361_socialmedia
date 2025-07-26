const db = require("../config/connection");
const { User } = require("../models");

const renterData = require("./users.json");

db.once("open", async () => {
  // clean database
  await User.deleteMany({});

  // bulk create each model
  const users = [];
  for (const renter of renterData) {
    const user = new User(renter);
    await user.save();
    users.push(user);
  }
  console.log();
  console.log("all done!");
  process.exit(0);
});
