module.exports = {
  token: process.env.token || "", // Your bot token
  channelId: process.env.channelId || "", //Channel Id you want to send the message

  nodes: [
    {
      host: "",
      password: "",
      port: 443,
      retryDelay: 300000,
      retryAmount: 25,
      identifier: "",
      secure: true,
    },
    {
      host: "",
      password: "",
      port: 443,
      retryDelay: 300000,
      retryAmount: 25,
      identifier: "",
      secure: true,
    },
    {
      host: "",
      password: "",
      port: 443,
      retryDelay: 300000,
      retryAmount: 25,
      identifier: "",
      secure: true,
    },
  ],
};
