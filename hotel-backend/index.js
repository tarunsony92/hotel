const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const roomRoutes = require("./routes/rooms");
// app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("API Running with MySQL");
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
