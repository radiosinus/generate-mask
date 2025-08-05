const express = require("express");
const sharp = require("sharp");

const app = express();
app.use(express.json());

app.get("/mask", async (req, res) => {
  const { width, height, targetSize } = req.query;

  // Преобразуем строки в числа
  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  const t = parseInt(targetSize, 10);

  if (!w || !h || !t) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Прозрачный квадрат
    const background = sharp({
      create: {
        width: t,
        height: t,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    // Белый прямоугольник
    const whiteBox = await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    // Скомпонуем в центр
    const maskBuffer = await background
      .composite([
        {
          input: whiteBox,
          top: Math.floor((t - h) / 2),
          left: Math.floor((t - w) / 2),
        },
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png").send(maskBuffer);
  } catch (error) {
    console.error("❌ Error generating mask:", error);
    res.status(500).json({ error: "Failed to generate mask" });
  }
});

app.listen(3000, () => {
  console.log("🟢 Mask generator running on http://localhost:3000");
});