import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { User } from '../controllers/user';
import { Activity } from '../controllers/activity';


export class ActivityRoute extends BaseRoute {
  constructor() {
    super();
  }

  public list(req: Request, res: Response, next: NextFunction) {
    new Activity().list(req, res);
  }

  public getDetail(req: Request, res: Response, next: NextFunction) {
    new Activity().getDetail(req, res);
  }

  public listFanActivitiesByUser(req: Request, res: Response, next: NextFunction) {
    new Activity().listFanActivitiesByUser(req, res);
  }

  public updateDetialLike(req: Request, res: Response, next: NextFunction) {
    new Activity().updateDetialLike(req, res);
  }

  public save(req: Request, res: Response, next: NextFunction) {
    new Activity().save(req, res);
  }

}