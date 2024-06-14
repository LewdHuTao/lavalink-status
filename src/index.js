const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const Manager = require("./wrapper/index");
const { token, nodes, expressPort, webMonitor } = require("./config");
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
