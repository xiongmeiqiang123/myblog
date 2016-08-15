var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('index.html');
});

module.exports = router;


if(data && data.status === 'Failed') {
	msg.alert(data.data);
	return ;
}

msg.alert('网络发生错误');