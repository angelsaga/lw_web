"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
class UserRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    Register(req, res, next) {
        this.user.register(req, res);
    }
    login(req, res, next) {
        this.user.login(req, res);
    }
    getUserInfo(req, res, next) {
        this.user.getUserInfo(req, res);
    }
    sendVerifyCode(req, res, next) {
        this.user.sendVerifyCode(req, res);
    }
}
exports.UserRoute = UserRoute;
