import { ABILITY_ACTIONS, ABILITY_SUBJECTS } from '../role.constants';

export type AbilityAction = (typeof ABILITY_ACTIONS)[number];
export type AbilitySubject = (typeof ABILITY_SUBJECTS)[number];
