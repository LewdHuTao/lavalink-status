const express = require("express");
const router = express.Router();
const config = require("../../config");

let lavalinkInfo = [];

router.use(express.json());

router.get("/info", async (req, res) => {
  try {
    lavalinkInfo = await Promise.all(
      config.nodes.map(async (node) => {
        try {
          const http = node.secure ? "https" : "http";
          const response = await fetch(
            `${http}://${node.host}:${node.port}/v4/info`,
            {
              headers: {
                Authorization: node.password,
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Error fetching info from ${node.host}:${node.port}`
            );
          }

          const data = await response.json();
          return { node: node.identifier, ...data };
        } catch {
          return {
            node: node.identifier,
            message: "Failed to fetch info",
          };
        }
      })
    );
    res.json(lavalinkInfo);
  } catch (error) {
    console.error("Error fetching node info:", error);
    res.status(500).json({ error: "Failed to fetch node info" });
  }
});

module.exports = router;
