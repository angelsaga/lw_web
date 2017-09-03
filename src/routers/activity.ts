import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { User } from '../controllers/user';
import { Activity } from '../controllers/activity';


export class ActivityRoute extends BaseRoute {
  public activity: Activity;
  constructor() {
    super();
  }

  public list(req: Request, res: Response, next: NextFunction) {
    this.activity.list(req, res);
  }

  public getDetail(req: Request, res: Response, next: NextFunction) {
    this.activity.getDetail(req, res);
  }

  public listFanActivitiesByUser(req: Request, res: Response, next: NextFunction) {
    this.activity.listFanActivitiesByUser(req, res);
  }

  public updateDetialLike(req: Request, res: Response, next: NextFunction) {
    this.activity.updateDetialLike(req, res);
  }

  public save(req: Request, res: Response, next: NextFunction) {
    this.activity.save(req, res);
  }

}