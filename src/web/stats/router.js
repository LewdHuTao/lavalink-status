const express = require("express");
const router = express.Router();

let lavalinkStats = {};

router.use(express.json());

router.get("/stats", (req, res) => {
  res.json(lavalinkStats);
});

router.post("/stats", (req, res) => {
  lavalinkStats = req.body.stats;
  res.sendStatus(200);
});

module.exports = router;
