require("dotenv").config();

const express = require("express");
const cors = require("cors");
const router = require("./routes");

const app = express();

// middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200,
  })
);

// mount routes
app.use("/firebase", router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${[port]}`));

module.exports = app;
