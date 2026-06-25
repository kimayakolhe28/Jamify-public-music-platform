const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/recommend", async (req, res) => {
  try {
    const { title, artist } = req.body;
    const response = await axios.post("http://localhost:8001/recommend", {
      title,
      artist,
    });
    res.json(response.data);
  } catch (err) {
    console.error("ML service error:", err.message);
    res.status(500).json({ error: "Recommendation service unavailable" });
  }
});

module.exports = router;