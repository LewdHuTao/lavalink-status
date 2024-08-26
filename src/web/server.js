const express = require("express");
const { expressPort } = require("../config");
const stats = require("./stats/router");
const info = require("./info/router");
const badge_players = require("./api/v1/badge/players/router");
const badge_status = require("./api/v1/badge/status/router");
const colors = require("colors");

const app = express();
app.use(express.json());

app.set("trust proxy", 1);
app.use(stats);
app.use(info);
app.use(badge_players);
app.use(badge_status);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(expressPort || 3000, () => {
  console.log(
    colors.green(
      `[WEB-MONITOR] Server is listening at http://localhost:${
        expressPort || 3000
      }`
    )
  );
});
