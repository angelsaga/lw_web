import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { User } from '../controllers/user';
import { Activity } from '../controllers/activity';


export class UserRoute extends BaseRoute {
  public user: User;
  public activity: Activity;
  constructor() {
    super();
  }

  public Register(req: Request, res: Response, next: NextFunction) {
    this.user.register(req, res);
  }

  public login(req: Request, res: Response, next: NextFunction) {
    this.user.login(req, res);
  }

  public getUserInfo(req: Request, res: Response, next: NextFunction) {
    this.user.getUserInfo(req, res);
  }

  public sendVerifyCode(req: Request, res: Response, next: NextFunction) {
    this.user.sendVerifyCode(req, res);
  }

}