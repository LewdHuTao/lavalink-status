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
  channel.send({ embeds: [embed] }).then((msg) => {
    setInterval(async () => {
      let all = [];

      client.manager.nodesMap.forEach(async (node) => {
        let color;

        if (!node.connected) color = "-";
        else color = "+";

        let info = [];
        info.push(`${color} Node          :: ${node.identifier}`);
        info.push(
          `${color} Status        :: ${
            node.connected ? "Connected [🟢]" : "Disconnected [🔴]"
          }`
        );
        info.push(`${color} Player        :: ${node.stats.players}`);
        info.push(`${color} Active Player   :: ${node.stats.playingPlayers}`);
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
      });

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
    }, 60000);
  });

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
