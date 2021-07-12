var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Graph Linear Algebra' });
});

router.get('/graph2d', (req, res, next) => {
	res.render('graph2d', { title: 'Graph Linear Algebra' })
});

module.exports = router;
