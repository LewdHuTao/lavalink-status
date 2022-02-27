const { Embed, Util } = require("discord.js");
const config = require("../config.json");
const moment = require("moment");
require("moment-duration-format");
const prettyBytes = require("pretty-bytes");
const colors = require("colors");

module.exports = async (client) => {

    const channel = await client.channels.fetch(config.channel)
    const embed = new Embed()
        .setColor(Util.resolveColor("#2F3136"))
        .setDescription("Fetching Stats From Lavalink")

    channel.bulkDelete(2);
    channel.send({ embeds: [embed] }).then((msg) => {

        setInterval(() => {

            let all = []

            client.manager.nodes.forEach(node => {

                let color;

                if (!node.connected)
                    color = "-";
                else
                    color = "+";

                let info = []
                info.push(`${color} Node          :: ${(node.options.identifier)}`)
                info.push(`${color} Status        :: ${node.connected ? "Connected [🟢]" : "Disconnected [🔴]"}`)
                info.push(`${color} Player        :: ${node.stats.players}`)
                info.push(`${color} Used Player   :: ${node.stats.playingPlayers}`)
                info.push(`${color} Uptime        :: ${moment.duration(node.stats.uptime).format(" d [days], h [hours], m [minutes], s [seconds]")}`)
                info.push(`${color} Cores         :: ${node.stats.cpu.cores} Core(s)`)
                info.push(`${color} Memory Usage  :: ${prettyBytes(node.stats.memory.used)}/${prettyBytes(node.stats.memory.reservable)}`)
                info.push(`${color} System Load   :: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`)
                info.push(`${color} Lavalink Load :: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`)
                all.push(info.join('\n'))
            });

            const rembed = new Embed()
                .setColor(Util.resolveColor("#2F3136"))
                .setAuthor({
                    name: "Shittybot Lavalink Status",
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`\`\`\`diff\n${all.join("\n\n")}\`\`\``)
                .setFooter({
                    text: "Last Update",
                })
                .setTimestamp(Date.now());

            msg.edit({ embeds: [rembed] });
        }, 60000);
    })

    client.manager.init(client.user.id);
    console.log(colors.green(`[CLIENT] Successfully Logged In As ${client.user.username}`));

} 