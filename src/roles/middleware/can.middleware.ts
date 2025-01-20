import { ForbiddenError } from '@casl/ability';
import { NextFunction, Request, Response } from 'express';
import { AbilityAction, AbilitySubject, createAbility } from '../app-ability';

export const can =
  (actions: AbilityAction[], subject: AbilitySubject) =>
  (_req: Request, res: Response, next: NextFunction) => {
    const permissions = res.locals.user?.permissions || [];

    const currentUserAbility = createAbility(permissions);

    for (const action of actions) {
      ForbiddenError.from(currentUserAbility).throwUnlessCan(action, subject);
    }

    next();
  };
