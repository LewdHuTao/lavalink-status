module.exports = {
  token: process.env.token || "", // Your bot token
  channelId: process.env.channelId || "", //Channel Id you want to send the message

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
