const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const router = require("./api/index.js");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use("/api/", router);

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
