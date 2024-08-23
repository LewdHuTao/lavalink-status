module.exports = {
  token: process.env.token || "", // Your bot token
  channelId: process.env.channelId || "", //Channel Id you want to send the message

  webMonitor: true, // Set to false if you don't want to use web-monitor
  domain: "localhost", // Need to use for badge
  expressPort: process.env.expressPort || 3000, // Port for web monitor

  nodes: [
    {
      host: "",
      password: "",
      port: 2333,
      identifier: "",
      secure: true,
      reconnectTimeout: 300000,
      reconnectTries: 100,
    },
    {
      host: "",
      password: "",
      port: 2333,
      identifier: "",
      secure: true,
      reconnectTimeout: 300000,
      reconnectTries: 100,
    },
    {
      host: "",
      password: "",
      port: 2333,
      identifier: "",
      secure: true,
      reconnectTimeout: 300000,
      reconnectTries: 100,
    },
  ],
};
