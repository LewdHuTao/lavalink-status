const { EmbedBuilder, resolveColor, ActivityType } = require("discord.js");
const config = require("../config");
const moment = require("moment");
require("moment-duration-format");
const colors = require("colors");

const arrayChunker = (array, chunkSize = 5) => {
  let chunks = [];
  for (let i = 0; i < array.length; i += chunkSize)
    chunks.push(array.slice(i, i + chunkSize));
  return chunks;
};

module.exports = async (client) => {
  const prettyBytes = (await import("pretty-bytes")).default;
  const channel = await client.channels.fetch(config.channelId);
  const embed = new EmbedBuilder()
    .setColor(resolveColor("#2F3136"))
    .setDescription("Fetching Stats From Lavalink Server");

  channel.bulkDelete(1);
  const msg = await channel.send({ embeds: [embed] });

  const updateLavalinkStats = async () => {
    let all = [];
    let expressStatus = [];

    client.manager.nodesMap.forEach((node) => {
      let color = node.connected ? "+" : "-";

      let info = [];
      info.push(`${color} Node          :: ${node.identifier}`);
      info.push(
        `${color} Status        :: ${
          node.connected ? "Connected [🟢]" : "Disconnected [🔴]"
        }`
      );
      info.push(
        `${color} Players       :: ${node.stats.playingPlayers}/${node.stats.players}`
      );
      info.push(
        `${color} Uptime        :: ${moment
          .duration(node.stats.uptime)
          .format(" d [days], h [hours], m [minutes]")}`
      );
      info.push(`${color} Cores         :: ${node.stats.cpu.cores} Core(s)`);
      info.push(
        `${color} Memory Usage  :: ${prettyBytes(
          node.stats.memory.used
        )}/${prettyBytes(node.stats.memory.reservable)}`
      );
      info.push(
        `${color} System Load   :: ${(
          Math.round(node.stats.cpu.systemLoad * 100) / 100
        ).toFixed(2)}%`
      );
      info.push(
        `${color} Lavalink Load :: ${(
          Math.round(node.stats.cpu.lavalinkLoad * 100) / 100
        ).toFixed(2)}%`
      );

      all.push(info.join("\n"));
      expressStatus.push({
        node: node.identifier,
        online: node.connected ? true : false,
        status: node.connected ? "Connected" : "Disconnected",
        players: node.stats.players,
        activePlayers: node.stats.playingPlayers,
        uptime: moment
          .duration(node.stats.uptime)
          .format(" d [days], h [hours], m [minutes]"),
        cores: node.stats.cpu.cores,
        memoryUsed: prettyBytes(node.stats.memory.used),
        memoryReservable: prettyBytes(node.stats.memory.reservable),
        systemLoad: (Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(
          2
        ),
        lavalinkLoad: (
          Math.round(node.stats.cpu.lavalinkLoad * 100) / 100
        ).toFixed(2),
      });
    });

    if (config.webMonitor === true) {
      fetch(`http://localhost:${config.expressPort}/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: expressStatus }),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
        })
        .catch((error) => {
          console.log("An error has occurred:", error);
        });
    }

    const chunked = arrayChunker(all, 8);
    const statusembeds = [];

    chunked.forEach((data) => {
      const rembed = new EmbedBuilder()
        .setColor(resolveColor("#2F3136"))
        .setAuthor({
          name: `Lavalink Monitor`,
          iconURL: client.user.displayAvatarURL({ forceStatic: false }),
        })
        .setDescription(`\`\`\`diff\n${data.join("\n\n")}\`\`\``)
        .setFooter({
          text: "Last Update",
        })
        .setTimestamp(Date.now());
      statusembeds.push(rembed);
    });

    msg.edit({ embeds: statusembeds });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(10000);
  await updateLavalinkStats();

  setInterval(updateLavalinkStats, 60000);

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Lavalink Status",
        type: ActivityType.Watching,
      },
    ],
  });

  console.log(colors.green(`[CLIENT] ${client.user.username} is now Online!`));
};
