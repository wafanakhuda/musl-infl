// File: utils/wrapAsync.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'

export function wrapAsync<
  Req extends Request = Request,
  Res extends Response = Response
>(
  fn: (req: Req, res: Res, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    fn(req as Req, res as Res, next).catch(next)
  }
}
