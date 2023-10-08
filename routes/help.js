//
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.render("help/index", { title: "Help — Graph Linear Algebra" });
});

const helpList = ["matrices", "vectors", "tools"];

helpList.forEach((v) => {
  router.get(`/${v}`, (req, res, next) => {
    res.render(`help/${v}`, {
      title: `${v.toUpperCase()[0] + v.substring(1)} — Graph Linear Algebra`,
    });
  });
});

module.exports = router;
