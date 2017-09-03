"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const jwt = require("express-jwt");
const bodyParser = require("body-parser");
const activity_1 = require("../routers/activity");
const user_1 = require("../routers/user");
let config = require('../../bin/config');
let debug = require('debug')('route');
let secret_token = config.secret_token;
class IndexRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        router.use(jwt({ secret: secret_token }).unless({ path: ['/user/register', '/user/login', '/user/sendvcode', '', '/'] }));
        router.use((err, req, res, next) => {
            if (err) {
                debug(err);
            }
            if (err.name === 'UnauthorizedError') {
                res.status(401).send('invalid token...');
            }
        });
        router.all('*', (req, res, next) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Credentials', 'true');
            res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
            res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
            if ('OPTIONS' == req.method)
                return res.sendStatus(200);
            next();
        });
        router.use(bodyParser.json({
            verify: (req, res, buf, encoding) => {
                req['rawBody'] = buf;
            }
        }));
        router.use(bodyParser.urlencoded({
            extended: false,
            verify: (req, res, buf, encoding) => {
                req['rawBody'] = buf;
            }
        }));
        router.get('/', (req, res, next) => {
            res.render('index', { title: 'LW' });
        });
        router.post('/user/register', (req, res, next) => {
            new user_1.UserRoute().Register(req, res, next);
        });
        router.post('/user/login', (req, res, next) => {
            new user_1.UserRoute().login(req, res, next);
        });
        router.post('/user/sendvcode', (req, res, next) => {
            new user_1.UserRoute().sendVerifyCode(req, res, next);
        });
        router.get('/user/info', (req, res, next) => {
            new user_1.UserRoute().getUserInfo(req, res, next);
        });
        router.get('/activity/list', (req, res, next) => {
            new activity_1.ActivityRoute().list(req, res, next);
        });
        router.get('/activity/detial', (req, res, next) => {
            new activity_1.ActivityRoute().getDetail(req, res, next);
        });
        router.get('/activity/userfanlist', (req, res, next) => {
            new activity_1.ActivityRoute().listFanActivitiesByUser(req, res, next);
        });
        router.post('/activity/detiallike', (req, res, next) => {
            new activity_1.ActivityRoute().updateDetialLike(req, res, next);
        });
        router.post('/activity/save', (req, res, next) => {
            new activity_1.ActivityRoute().save(req, res, next);
        });
    }
}
exports.IndexRoute = IndexRoute;
