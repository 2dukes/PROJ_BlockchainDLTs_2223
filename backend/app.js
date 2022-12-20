const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, 'env/.env') });
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'public', 'campaigns'))); // http://localhost:8000/<campaign_addr>/<filename>.png
const imageRoutes = require("./routes/image");
const campaignRoutes = require("./routes/campaign");

const errorMiddleware = require("./middleware/error");


app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  ); // * could be replaced by a domain. Allow different origins to access our data.
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE"); // Allow origins to use specific HTTP methods.
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie"); // Headers that clients might set on their requests.

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", imageRoutes);
app.use("/campaigns", campaignRoutes);

app.use(errorMiddleware);

const MONGODB_URI = `mongodb://${process.env.MONGO_DB_ATLAS_USERNAME}:${process.env.MONGO_DB_ATLAS_PASSWORD}@mongodb:27017/?authMechanism=DEFAULT`;

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then((_) => {
    console.log(
      `Listening at: http://localhost:${port}`
    );
    app.listen(port);
  })
  .catch((err) => console.log(err));