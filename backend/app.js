const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'public', 'campaigns'))); // http://localhost:8000/<campaign_addr>/<filename>.png
const imageRoutes = require("./routes/images");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", imageRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});