const express = require("express");
const app = express();
const cors = require("cors");
const searchRouter = require('./routes/searchRouter');
require("dotenv").config()

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("chrome-extension://")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
}

app.use(cors(corsOption));
app.use("/search", searchRouter);

app.listen(4000, () => {
  console.log("Express backend listening on port", 4000);
})

