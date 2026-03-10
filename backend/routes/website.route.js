const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.post("/book-appointment", async (req, res) => {
  console.log("DB URL:", process.env.DATABASE_URL);

  let {
    phone,
    patient_name,
    age,
    date,
    time_value,
    time_label,
    doctor_name,
    doctor_specialization,
    address
  } = req.body || {};

  // normalize phone
  phone = (phone || "")
    .toString()
    .trim()
    .replace(/\D/g, "")
    .replace(/^91/, "");

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone must be 10 digits"
    });
  }

  if (!patient_name || !date || !time_value || !doctor_name) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    await pool.query(
      `
      INSERT INTO appointments (
        phone,
        patient_name,
        age,
        date,
        time_label,
        time_value,
        address,
        doctor_name,
        doctor_specialization,
        source
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `,
      [
        phone,
        patient_name,
        age,
        date,
        time_label || time_value,
        time_value,
        address || null,
        doctor_name,
        doctor_specialization || null,
        "WEBSITE"
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Website booking error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment"
    });
  }
});

module.exports = router;
