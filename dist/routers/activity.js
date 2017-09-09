"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const activity_1 = require("../controllers/activity");
class ActivityRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    list(req, res, next) {
        new activity_1.Activity().list(req, res);
    }
    getDetail(req, res, next) {
        new activity_1.Activity().getDetail(req, res);
    }
    listFanActivitiesByUser(req, res, next) {
        new activity_1.Activity().listFanActivitiesByUser(req, res);
    }
    updateDetialLike(req, res, next) {
        new activity_1.Activity().updateDetialLike(req, res);
    }
    save(req, res, next) {
        new activity_1.Activity().save(req, res);
    }
}
exports.ActivityRoute = ActivityRoute;
