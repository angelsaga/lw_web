import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Push } from '../controllers/push';

export class PushRoute extends BaseRoute {
  constructor() {
    super();
  }

  public push_test(req: Request, res: Response, next: NextFunction) {
    new Push().push_test(req, res);
  }

}