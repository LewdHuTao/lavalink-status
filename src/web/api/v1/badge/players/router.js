const { BadgeGenerator } = require("../../../../utils/BadgeGenerator");
const express = require("express");
const router = express.Router();

router.get("/api/v1/badge/players-json/:nodeIndex", async (req, res) => {
  try {
    const domain = req.protocol + "://" + req.get("host");

    const response = await fetch(`${domain}/stats`);
    const lavalinkData = await response.json();

    const nodeIndex = parseInt(req.params.nodeIndex, 10);
    if (isNaN(nodeIndex) || nodeIndex < 0 || nodeIndex >= lavalinkData.length) {
      return res.status(400).json({
        schemaVersion: 1,
        label: "Error",
        message: "Invalid node",
        color: "#DA644D",
      });
    }

    const node = lavalinkData[nodeIndex];
    let totalPlayers;
    let activePlayers;

    totalPlayers = node.players;
    activePlayers = node.activePlayers;

    res.json({
      schemaVersion: 1,
      label: "🌐 Players",
      message: `${activePlayers} / ${totalPlayers}`,
      color: "#1284C5",
    });
  } catch (error) {
    console.error("Error fetching Lavalink stats:", error);
    res.status(500).json({
      schemaVersion: 1,
      label: "🌐 Players",
      message: "0 / 0",
      color: "#DA644D",
    });
  }
});

router.get("/api/v1/badge/players/:nodeIndex", async (req, res) => {
  try {
    const nodeIndex = parseInt(req.params.nodeIndex, 10);

    if (isNaN(nodeIndex) || nodeIndex < 0) {
      return res.status(400).send("Invalid node index");
    }

    const domain = req.protocol + "://" + req.get("host");
    const response = await fetch(
      `${domain}/api/v1/badge/players-json/${nodeIndex}`
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
