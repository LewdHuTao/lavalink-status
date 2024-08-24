const express = require("express");
const router = express.Router();

router.get("/api/v1/badge-json/:nodeIndex", async (req, res) => {
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
        color: "red",
      });
    }

    const node = lavalinkData[nodeIndex];
    let totalPlayers;
    let activePlayers;

    try {
      totalPlayers = node.players;
      activePlayers = node.activePlayers;
    } catch {
      totalPlayers = "0";
      activePlayers = "0";
    }

    res.json({
      schemaVersion: 1,
      label: "Players",
      message: `${activePlayers} / ${totalPlayers}`,
      color: "blue",
    });
  } catch (error) {
    console.error("Error fetching Lavalink stats:", error);
    res.status(500).json({
      schemaVersion: 1,
      label: "Players",
      message: "0 / 0",
      color: "red",
    });
  }
});

router.get("/api/v1/badge/:nodeIndex", async (req, res) => {
    try {
      const nodeIndex = parseInt(req.params.nodeIndex, 10);
  
      if (isNaN(nodeIndex) || nodeIndex < 0) {
        return res.status(400).send("Invalid node index");
      }
  
      const domain = req.protocol + "://" + req.get("host");
  
      const badgeURL = `https://img.shields.io/endpoint?url=${domain}/api/v1/badge-json/${nodeIndex}`;
  
      const response = await fetch(badgeURL);
  
      if (!response.ok) throw new Error(`Failed to fetch badge: ${response.statusText}`);
  
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      res.setHeader("Content-Type", "image/svg+xml");
      res.send(buffer);
    } catch (error) {
      console.error("Error fetching badge image:", error);
      res.status(500).send("Error fetching badge image");
    }
  });
  
  module.exports = router;