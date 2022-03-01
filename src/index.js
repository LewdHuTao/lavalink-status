const { Client, GatewayIntentBits, } = require("discord.js");
const { readdirSync } = require("fs");
const { Manager } = require("erela.js");
const { token, nodes } = require('./config.js');
const colors = require("colors");

const client = new Client({
    disableMentions: "everyone",
    partials: [
        'MESSAGE', 
        'CHANNEL', 
        'REACTION'
    ],
    intents: [
        GatewayIntentBits.Guilds,
    ]
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
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

readdirSync("./src/events/").forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(colors.green(`[EVENTS] Loaded [${client._eventsCount}] events`));
    client.on(eventName, event.bind(null, client));
});

client.login(token);