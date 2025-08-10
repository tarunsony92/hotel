const express = require('express');
const router = express.Router();
const db = require('../db'); // Your DB connection

// 🔹 POST /api/bookings - Book rooms
router.post('/book', (req, res) => {
  const { name, email, phone, age, address, selectedRooms } = req.body;

  if (!name || !email || !phone || !age || !address || !selectedRooms || selectedRooms.length === 0) {
    return res.status(400).json({ error: "All fields and at least one room are required" });
  }

  const roomsString = selectedRooms.join(', ');

  const insertSql = `
    INSERT INTO bookings (name, email, phone, age, address, rooms)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertSql, [name, email, phone, age, address, roomsString], (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "Booking failed" });
    }

    // 🔹 Step 2: Update room status
    const placeholders = selectedRooms.map(() => '?').join(', ');
    const updateSql = `
      UPDATE rooms
      SET status = 'booked'
      WHERE roomNumber IN (${placeholders})
    `;

    db.query(updateSql, selectedRooms, (err2, updateResult) => {
      if (err2) {
        console.error("Error updating room status:", err2);
        return res.status(500).json({ error: "Booking saved but room status update failed" });
      }

      res.status(201).json({ message: "Booking saved and room status updated successfully" });
    });
  });
});

// 🔹 GET /api/bookings - Get all room statuses
router.get('/', (req, res) => {
  const sql = "SELECT roomNumber, status FROM rooms";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});




// 🔵 Seller route – Get all bookings
router.get('/all-bookings', (req, res) => {
  const sql = "SELECT * FROM bookings";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
