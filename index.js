const { Client, GatewayIntentBits, } = require("discord.js");
const { readdirSync } = require("fs");
const { Manager } = require("erela.js");
const { token, nodes } = require('./config.json');
const colors = require("colors");

const client = new Client({
    disableMentions: "everyone",
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

client.manager = new Manager({
    nodes,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

readdirSync("./Events/").forEach(file => {
    const event = require(`./Events/${file}`);
    let eventName = file.split(".")[0];
    console.log(colors.green(`[EVENTS] Loading Events Client ${eventName}`, "event"));
    client.on(eventName, event.bind(null, client));
});

client.login(token);