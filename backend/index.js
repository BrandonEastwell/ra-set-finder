const express = require("express");
const app = express();
const cors = require("cors");
const searchRouter = require('./routes/searchRouter');
require("dotenv").config()

const port = process.env.PORT || 4000

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

app.listen(port, () => {
  console.log("Express backend listening on port", port);
})

