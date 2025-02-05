require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors");

app.use(cors());

const port = process.env.PORT || 5000;
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

main()
  .then((e) => {
    console.log("Database Connected");
  })
  .catch((er) => {
    console.log(er);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log("app is listening");
});
