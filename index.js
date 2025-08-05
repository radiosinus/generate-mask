const express = require("express");
const sharp = require("sharp");

const app = express();
app.use(express.json());

app.post("/generate-mask", async (req, res) => {
  const { width, height, targetSize } = req.body;

  if (!width || !height || !targetSize) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const background = sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 1,
        background: { r: 0, g: 0, b: 0 }
      }
    });

    const whiteBox = await sharp({
      create: {
        width,
        height,
        channels: 1,
        background: { r: 255, g: 255, b: 255 }
      }
    }).png().toBuffer();

    const maskBuffer = await background
      .composite([
        {
          input: whiteBox,
          top: Math.floor((targetSize - height) / 2),
          left: Math.floor((targetSize - width) / 2)
        }
      ])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png").send(maskBuffer);
  } catch (error) {
    console.error("Error generating mask:", error);
    res.status(500).json({ error: "Failed to generate mask" });
  }
});

app.listen(3000, () => {
  console.log("🟢 Mask generator running on http://localhost:3000");
});
