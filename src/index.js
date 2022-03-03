const { Client, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const { Manager } = require("erela.js");
const { token, nodes, retryDelay, retryAmount } = require("./config");
const colors = require("colors");

const client = new Client({
  disableMentions: "everyone",
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [GatewayIntentBits.Guilds],
});

process.on("unhandledRejection", (error) => {
  return;
  // console.log(error)
});
process.on("uncaughtException", (error) => {
  return;
  // console.log(error)
});

client.manager = new Manager({
  nodes,
  retryDelay,
  retryAmount,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
  .on("nodeConnect", (node) =>
    console.log(
      colors.green(
        `[NODE] ${node.options.identifier} | Lavalink node is connected.`
      )
    )
  )
  .on("nodeReconnect", (node) =>
    console.log(
      colors.green(
        `[NODE] ${node.options.identifier} | Lavalink node is reconnecting.`
      )
    )
  )
  .on("nodeDisconnect", (node) =>
    console.log(
      colors.green(
        `[NODE] ${node.options.identifier} | Lavalink node is disconnected.`
      )
    )
  );

readdirSync("./src/events/").forEach((file) => {
  const event = require(`./events/${file}`);
  let eventName = file.split(".")[0];
  console.log(colors.green(`[EVENTS] Loaded [${client._eventsCount}] events`));
  client.on(eventName, event.bind(null, client));
});

client.login(token);
