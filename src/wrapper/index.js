const Node = require("./Node");

class LavalinkWrapper {
  constructor(client, options) {
    this.client = client;
    this.nodes = options.nodes || [];
    this.nodesMap = new Map();

    this.client.once("ready", this.connectToLavalink.bind(this));
  }

  connectToLavalink() {
    for (const nodeOptions of this.nodes) {
      const node = new Node(nodeOptions);
      node.storeNode(this.nodesMap);
      node.connect();
    }
  }

  disconnectFromLavalink() {
    for (const node of this.nodesMap.values()) {
      node.disconnect();
    }
  }
}

module.exports = LavalinkWrapper;
