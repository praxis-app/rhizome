import { t } from 'i18next';
import { Namespace, TFunction } from 'react-i18next';
import { PermissionName } from '../types/role.types';

export const getPermissionText = (name: PermissionName) => {
  const _t: TFunction<Namespace<'ns1'>, undefined> = t;
  switch (name) {
    case 'manageSettings':
      return {
        displayName: _t('permissions.names.manageSettings'),
        description: _t('permissions.descriptions.manageServerSettings'),
      };
    case 'createEvents':
      return {
        displayName: _t('permissions.names.createEvents'),
        description: _t('permissions.descriptions.createEvents'),
      };
    case 'createInvites':
      return {
        displayName: _t('permissions.names.createInvites'),
        description: _t('permissions.descriptions.createInvites'),
      };
    case 'manageEvents':
      return {
        displayName: _t('permissions.names.manageEvents'),
        description: _t('permissions.descriptions.manageEvents'),
      };
    case 'manageInvites':
      return {
        displayName: _t('permissions.names.manageInvites'),
        description: _t('permissions.descriptions.manageInvites'),
      };
    case 'managePosts':
      return {
        displayName: _t('permissions.names.managePosts'),
        description: _t('permissions.descriptions.managePosts'),
      };
    case 'manageRoles':
      return {
        displayName: _t('permissions.names.manageRoles'),
        description: _t('permissions.descriptions.manageRoles'),
      };
    case 'removeMembers':
      return {
        displayName: _t('permissions.names.removeMembers'),
        description: _t('permissions.descriptions.removeMembers'),
      };
    case 'removeProposals':
      return {
        displayName: _t('permissions.names.removeProposals'),
        description: _t('permissions.descriptions.removeProposals'),
      };
    case 'manageRules':
      return {
        displayName: _t('permissions.names.manageRules'),
        description: _t('permissions.descriptions.manageRules'),
      };
    case 'manageQuestions':
      return {
        displayName: _t('permissions.names.manageQuestions'),
        description: _t('permissions.descriptions.manageQuestions'),
      };
    case 'manageQuestionnaireTickets':
      return {
        displayName: _t('permissions.names.manageQuestionnaires'),
        description: _t('permissions.descriptions.manageQuestionnaires'),
      };
  }
  return { displayName: '', description: '' };
};
