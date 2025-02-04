/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DEFAULT_APP_CATEGORIES } from '@kbn/core-application-common';
import { i18n } from '@kbn/i18n';
import { KibanaFeatureScope } from '@kbn/features-plugin/common';

import { APP_ID, NOTES_FEATURE_ID } from '../constants';
import { type BaseKibanaFeatureConfig } from '../types';
import type { SecurityFeatureParams } from '../security/types';

export const getNotesBaseKibanaFeature = (
  params: SecurityFeatureParams
): BaseKibanaFeatureConfig => ({
  id: NOTES_FEATURE_ID,
  name: i18n.translate(
    'securitySolutionPackages.features.featureRegistry.linkSecuritySolutionNotesTitle',
    {
      defaultMessage: 'Notes',
    }
  ),
  order: 1100,
  category: DEFAULT_APP_CATEGORIES.security,
  scope: [KibanaFeatureScope.Spaces, KibanaFeatureScope.Security],
  app: [NOTES_FEATURE_ID, 'kibana'],
  catalogue: [APP_ID],
  privileges: {
    all: {
      app: [NOTES_FEATURE_ID, 'kibana'],
      catalogue: [APP_ID],
      savedObject: {
        all: params.savedObjects,
        read: params.savedObjects,
      },
      ui: ['read', 'crud'],
      api: ['notes_read', 'notes_write'],
    },
    read: {
      app: [NOTES_FEATURE_ID, 'kibana'],
      catalogue: [APP_ID],
      savedObject: {
        all: [],
        read: params.savedObjects,
      },
      ui: ['read'],
      api: ['notes_read'],
    },
  },
});
