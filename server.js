require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const connectDB = require("./database/connect");

connectDB();

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/api", require("./routes/route"));

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
