let express = require('express');
let router = express.Router();
let jwt = require('express-jwt');
let debug = require('debug')('route');
let config = require('../bin/config');
let secret_token = config.secret_token;
let user = require('../controllers/user');
let activity = require('../controllers/activity');
let bodyParser = require('body-parser');

/* Verify jwt for all request */
router.use(jwt({ secret: secret_token}).unless({path: ['/user/register', '/user/login', '/user/sendvcode','', '/']}));

router.use(function (err, req, res, next) {
	if(err){
		debug(err)
	}
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('invalid token...');
	  }
	});

router.all('*', function(req, res, next) {
	  res.set('Access-Control-Allow-Origin', '*');
	  res.set('Access-Control-Allow-Credentials', true);
	  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	  if ('OPTIONS' == req.method) return res.sendStatus(200);
	  next();
	});

router.use(bodyParser.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
router.use(bodyParser.urlencoded({
    extended: false,
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LW' });
});

	
/* Create a new user */
router.post('/user/register', user.register); 

/* Login */
router.post('/user/login', user.login); 

/* sendVerifyCode */
router.post('/user/sendvcode', user.sendVerifyCode); 

/* list activity */
router.get('/activity/list', activity.list);
router.get('/activity/detial', activity.getDetial);

/* modify activity like*/
router.post('/activity/detiallike', activity.updateDetialLike);

/* save activity */
router.post('/activity/save', activity.save); 

module.exports = router;