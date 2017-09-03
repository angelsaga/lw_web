"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
class ActivityRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    list(req, res, next) {
        this.activity.list(req, res);
    }
    getDetail(req, res, next) {
        this.activity.getDetail(req, res);
    }
    listFanActivitiesByUser(req, res, next) {
        this.activity.listFanActivitiesByUser(req, res);
    }
    updateDetialLike(req, res, next) {
        this.activity.updateDetialLike(req, res);
    }
    save(req, res, next) {
        this.activity.save(req, res);
    }
}
exports.ActivityRoute = ActivityRoute;
