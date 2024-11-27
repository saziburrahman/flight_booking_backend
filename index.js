require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
