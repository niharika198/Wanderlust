require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const dbUrl = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(async () => {
    console.log("Connected to Atlas");
    await initDB();
    mongoose.connection.close();
  })
  .catch(console.log);

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68af29190d16a907aeb776b8", // demo user's ID
  }));

  await Listing.insertMany(initData.data);

  console.log("Data was initialized");
};
