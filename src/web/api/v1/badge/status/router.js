const { BadgeGenerator } = require("../../../../utils/BadgeGenerator");
const express = require("express");
const router = express.Router();

router.get("/api/v1/badge/status-json/:nodeIndex", async (req, res) => {
  try {
    const domain = req.protocol + "://" + req.get("host");

    const response = await fetch(`${domain}/stats`);
    const lavalinkData = await response.json();

    const nodeIndex = parseInt(req.params.nodeIndex, 10);
    if (isNaN(nodeIndex) || nodeIndex < 0 || nodeIndex >= lavalinkData.length) {
      return res.status(400).json({
        label: "Error",
        message: "Invalid node",
        color: "#DA644D",
      });
    }

    const node = lavalinkData[nodeIndex];

    if (node.online === true) {
      res.json({
        label: "🚦 Status",
        message: "Online",
        color: "#4FC921",
      });
    } else {
      res.json({
        label: "🚦 Status",
        message: "Offline",
        color: "#DA644D",
      });
    }
  } catch (error) {
    console.error("Error fetching Lavalink stats:", error);
    res.status(500).json({
      label: "🚦 Status",
      message: "Offline",
      color: "#DA644D",
    });
  }
});

router.get("/api/v1/badge/status/:nodeIndex", async (req, res) => {
  try {
    const nodeIndex = parseInt(req.params.nodeIndex, 10);

    if (isNaN(nodeIndex) || nodeIndex < 0) {
      return res.status(400).send("Invalid node index");
    }

    const domain = req.protocol + "://" + req.get("host");
    const response = await fetch(
      `${domain}/api/v1/badge/status-json/${nodeIndex}`
    );
    const badgeData = await response.json();

    const svg = await BadgeGenerator({
      labelBlockColor: "#2C3E50",
      labelText: badgeData.label,
      labelColor: "#ECF0F1",
      valueBlockColor: badgeData.color,
      valueText: badgeData.message,
      valueColor: "#FFFFFF",
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  } catch (error) {
    console.error("Error fetching badge image:", error);
    res.status(500).send("Error fetching badge image");
  }
});

module.exports = router;
