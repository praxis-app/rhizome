import { createMongoAbility, ForcedSubject, MongoAbility, RawRuleOf } from '@casl/ability';
import { AbilityAction, AbilitySubject } from './models/role.types';

type Abilities = [AbilityAction, AbilitySubject | ForcedSubject<Exclude<AbilitySubject, 'all'>>];

type AppAbility = MongoAbility<Abilities>;

export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  createMongoAbility<AppAbility>(rules);
