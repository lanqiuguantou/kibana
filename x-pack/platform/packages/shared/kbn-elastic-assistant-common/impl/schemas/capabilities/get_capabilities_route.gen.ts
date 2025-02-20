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
 *   title: Get Capabilities API endpoint
 *   version: 1
 */

import { z } from '@kbn/zod';

export type GetCapabilitiesResponse = z.infer<typeof GetCapabilitiesResponse>;
export const GetCapabilitiesResponse = z.object({
  assistantModelEvaluation: z.boolean(),
  contentReferencesEnabled: z.boolean(),
  defendInsights: z.boolean(),
});
