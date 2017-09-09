"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const user_1 = require("../controllers/user");
class UserRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    Register(req, res, next) {
        new user_1.User().register(req, res);
    }
    login(req, res, next) {
        new user_1.User().login(req, res);
    }
    getUserInfo(req, res, next) {
        new user_1.User().getUserInfo(req, res);
    }
    sendVerifyCode(req, res, next) {
        new user_1.User().sendVerifyCode(req, res);
    }
}
exports.UserRoute = UserRoute;
