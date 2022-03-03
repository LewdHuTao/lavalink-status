module.exports = {
    token: "ODkzNjY5MjAzODMwMjU1Njc2.YVe0TQ.KC8Ebh44ZLx3QGWAfxUP1vqJ2nY",
    channel: "932917612835401749",

    nodes: [
        {
            host: "fin1.vertexnodes.com",
            password: "youshallnotpass",
            port: 25554,
            retryDelay: 300000,
            retryAmount: 5,
            identifier: "Node-01",
            secure: false
        },
        {
            host: "dono-01.danbot.host",
            password: "youshallnotpass",
            port: 1689,
            retryDelay: 300000,
            retryAmount: 5,
            identifier: "Node-02",
            secure: false
        },
        {
            host: "dono-03.danbot.host",
            password: "youshallnotpass",
            port: 1382,
            retryDelay: 300000,
            retryAmount: 5,
            identifier: "Node-03",
            secure: false
        }
    ]
}