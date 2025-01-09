/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PositiveInteger } from '@kbn/securitysolution-io-ts-types';
import * as t from 'io-ts';

export const exceptionListSummarySchema = t.exact(
  t.type({
    windows: PositiveInteger,
    linux: PositiveInteger,
    macos: PositiveInteger,
    total: PositiveInteger,
  })
);

export type ExceptionListSummarySchema = t.TypeOf<typeof exceptionListSummarySchema>;
