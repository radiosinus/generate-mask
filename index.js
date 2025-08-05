const express = require("express");
const sharp = require("sharp");

const app = express();

app.get("/mask", async (req, res) => {
  const { width, height, targetSize } = req.query;

  // Проверка на обязательные параметры
  if (!width || !height || !targetSize) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Приведение параметров к числам
    const w = parseInt(width);
    const h = parseInt(height);
    const size = parseInt(targetSize);

    // Чёрный квадрат (фон)
    const background = sharp({
      create: {
        width: size,
        height: size,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    });

    // Белый прямоугольник (внутри)
    const whiteBox = await sharp({
      create: {
        width: w,
        height: h,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    }).png().toBuffer();

    // Наложение белого прямоугольника по центру чёрного фона
    const mask = await background
      .composite([
        {
          input: whiteBox,
          top: Math.floor((size - h) / 2),
          left: Math.floor((size - w) / 2),
        },
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png").send(mask);
  } catch (err) {
    console.error("Mask generation error:", err);
    res.status(500).json({ error: "Failed to generate mask" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Mask generator running on http://localhost:${PORT}`);
});