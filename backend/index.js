const express = require("express");
const app = express();
const searchRouter = require('./routes/searchRouter');

app.use("/search", searchRouter);

app.listen(4000, () => {
  console.log("Express backend listening on port", 4000);
})

