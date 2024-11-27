require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
