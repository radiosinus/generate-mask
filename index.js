const express = require("express");
const app = express();

app.get("/mask", (req, res) => {
  const { width, height, targetSize } = req.query;

  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  const t = parseInt(targetSize, 10);

  if (!w || !h || !t) {
    return res.status(400).json({ error: "Missing or invalid parameters" });
  }

  const result = {
    doubleWidth: w * 2,
    doubleHeight: h * 2,
    doubleTargetSize: t * 2
  };

  res.json(result);
});

app.listen(3000, () => {
  console.log("🟢 Test server running on http://localhost:3000");
});