/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Assign alerts API endpoint
 *   version: 2023-10-31
 */

import { z } from '@kbn/zod';
import { isNonEmptyString } from '@kbn/zod-helpers';

import { AlertIds } from '../../model/alert.gen';

export type AlertAssignees = z.infer<typeof AlertAssignees>;
export const AlertAssignees = z.object({
  add: z.array(z.string().min(1).superRefine(isNonEmptyString)),
  remove: z.array(z.string().min(1).superRefine(isNonEmptyString)),
});

export type SetAlertAssigneesRequestBody = z.infer<typeof SetAlertAssigneesRequestBody>;
export const SetAlertAssigneesRequestBody = z.object({
  /**
   * Details about the assignees to assign and unassign.
   */
  assignees: AlertAssignees,
  ids: AlertIds,
});
export type SetAlertAssigneesRequestBodyInput = z.input<typeof SetAlertAssigneesRequestBody>;
