var express = require('express');
var router = express.Router();

router.get('*', function(req, res, next) {
  res.json({
    status: 200,
    data: [new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      hour12: true,
      timeZone: "Asia/Ho_Chi_Minh"
    })],
  })
});

module.exports = router;
