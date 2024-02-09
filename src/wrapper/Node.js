const WebSocket = require("ws");
const colors = require("colors");

class Node {
  constructor(options) {
    this.host = options.host || "localhost";
    this.port = options.port || 2333;
    this.password = options.password || "youshallnotpass";
    this.secure = options.secure || false;
    this.identifier = options.identifier || this.host;
    this.nodesMap = null;
    this.ws = null;
    this.connected = false;
    this.stats = {};
    this.reconnectTimeout = options.reconnectTimeout || 5000;
    this.reconnectTries = options.reconnectTries || 3;
    this.reconnectAttempted = 0;
  }

  storeNode(nodesMap) {
    this.nodesMap = nodesMap;
    this.nodesMap.set(this.identifier, this);
  }

  connect() {
    const headers = {
      Authorization: this.password,
      "User-Id": Math.floor(Math.random() * 10000),
      "Client-Name": "Lavalink-Status",
    };

    this.ws = new WebSocket(
      `ws${this.secure ? "s" : ""}://${this.host}:${this.port}/v4/websocket`,
      { headers }
    );

    this.ws.on("open", () => {
      console.log(
        colors.green(`[NODE] ${this.identifier} | Lavalink node is connected.`)
      );
      this.reconnectAttempted = 0;
      this.connected = true;
    });

    this.ws.on("message", (message) => {
      if (Array.isArray(message)) message = Buffer.concat(message);
      else if (message instanceof ArrayBuffer) message = Buffer.from(message);

      const payload = JSON.parse(message.toString());
      if (!payload.op) return;

      if (payload.op === "stats") {
        this.stats = { ...payload };
      }
    });

    this.ws.on("error", (error) => {
      console.log(
        colors.red(
          `[NODE] ${this.identifier} | WebSocket error for Lavalink node ${this.identifier}`
        )
      );
      console.log(error);
      this.connected = false;
      return (this.stats = {
        players: 0,
        playingPlayers: 0,
        uptime: 0,
        memory: {
          free: 0,
          used: 0,
          allocated: 0,
          reservable: 0,
        },
        cpu: {
          cores: 0,
          systemLoad: 0,
          lavalinkLoad: 0,
        },
        frameStats: {
          sent: 0,
          nulled: 0,
          deficit: 0,
        },
      });
    });

    this.ws.on("close", (code, reason) => {
      console.log(
        colors.red(
          `[NODE] ${this.identifier} | Connection closed with code ${code}.`
        )
      );
      this.scheduleReconnect();
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.stats;
      console.log(
        colors.red(`[NODE] ${this.identifier} | Lavalink node is disconnected.`)
      );
    }
  }

  scheduleReconnect() {
    setTimeout(() => {
      if (
        this.reconnectAttempted < this.reconnectTries ||
        this.reconnectTries === 0
      ) {
        console.log(
          colors.yellow(
            `[NODE] ${this.identifier} | Lavalink node is reconnecting.`
          )
        );
        this.connect();
        this.reconnectAttempted++;
      } else {
        console.log(
          colors.red(
            `[NODE] ${this.identifier} | Lavalink node reached the limit to reconnect.`
          )
        );
        this.disconnect();
      }
    }, this.reconnectTimeout);
  }
}

module.exports = Node;
