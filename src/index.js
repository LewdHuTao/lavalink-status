const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const Manager = require("./wrapper/index");
const { token, nodes, expressPort, webMonitor, domain } = require("./config");
const colors = require("colors");
const express = require("express");
const app = express();

const client = new Client({
  disableMentions: "everyone",
  partials: [Partials.Channel, Partials.Message],
  intents: [GatewayIntentBits.Guilds],
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
process.on("uncaughtException", (error) => {
  console.log(error);
});

client.manager = new Manager(client, {
  nodes,
});

readdirSync("./src/events/").forEach((file) => {
  const event = require(`./events/${file}`);
  let eventName = file.split(".")[0];
  console.log(colors.green(`[EVENTS] Loaded [${client._eventsCount}] events`));
  client.on(eventName, event.bind(null, client));
});

client.login(token);

if (webMonitor === true) {
  let lavalinkStats = {};
  app.use(express.json());

  app.get("/stats", (req, res) => {
    res.json(lavalinkStats);
  });

  app.post("/stats", (req, res) => {
    lavalinkStats = req.body.stats;
    res.sendStatus(200);
  });

  // This is to api for badge
  // Still in development
  app.get("/api/v1/badge/:nodeIndex", async (req, res) => {
    try {
      // TODO: auto fetch domain name instead of using config to find the domain name
      const response = await fetch(`https://${domain}/stats`);
      const lavalinkData = await response.json();
  
      const nodeIndex = parseInt(req.params.nodeIndex, 10);
  
      if (isNaN(nodeIndex) || nodeIndex < 0 || nodeIndex >= lavalinkData.length) {
        return res.status(400).json({
          schemaVersion: 1,
          label: "Players",
          message: "Invalid node",
          color: "red"
        });
      }
  
      const node = lavalinkData[nodeIndex];
      const totalPlayers = node.players;
      const activePlayers = node.activePlayers;
      const nodeName = node.node || `Node ${nodeIndex + 1}`;
  
      res.json({
        schemaVersion: 1,
        label: nodeName,
        message: `${activePlayers}/${totalPlayers}`,
        color: "brightgreen"
      });
    } catch (error) {
      console.error("Error fetching Lavalink stats:", error);
      res.status(500).json({
        schemaVersion: 1,
        label: "Players",
        message: "Error",
        color: "red"
      });
    }
  });

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/web/index.html");
  });

  app.listen(expressPort, () => {
    console.log(
      colors.green(
        `[WEB-MONITOR] WEB-MONITOR Server is listening at http://localhost:${expressPort}`
      )
    );
  });
}
