/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';
import type { ESQLCommandOption, ESQLMessage } from '@kbn/esql-ast';
import { isLiteralItem, isColumnItem, isInlineCastItem } from '../shared/helpers';
import { getMessageFromId } from '../validation/errors';
import type { CommandOptionsDefinition } from './types';

/** @deprecated — options are going away */
export const byOption: CommandOptionsDefinition = {
  name: 'by',
  description: i18n.translate('kbn-esql-validation-autocomplete.esql.definitions.byDoc', {
    defaultMessage: 'By',
  }),
  signature: {
    multipleParams: true,
    params: [{ name: 'expression', type: 'any' }],
  },
  optional: true,
};

/** @deprecated — options are going away */
export const metadataOption: CommandOptionsDefinition = {
  name: 'metadata',
  description: i18n.translate('kbn-esql-validation-autocomplete.esql.definitions.metadataDoc', {
    defaultMessage: 'Metadata',
  }),
  signature: {
    multipleParams: true,
    params: [{ name: 'column', type: 'column' }],
  },
  optional: true,
  skipCommonValidation: true,
  validate: (option, command, references) => {
    const messages: ESQLMessage[] = [];
    const fields = option.args.filter(isColumnItem);
    const metadataFieldsAvailable = references as unknown as Set<string>;
    if (metadataFieldsAvailable.size > 0) {
      for (const field of fields) {
        if (!metadataFieldsAvailable.has(field.name)) {
          messages.push(
            getMessageFromId({
              messageId: 'unknownMetadataField',
              values: {
                value: field.name,
                availableFields: Array.from(metadataFieldsAvailable).join(', '),
              },
              locations: field.location,
            })
          );
        }
      }
    }
    return messages;
  },
};

/** @deprecated — options are going away */
export const asOption: CommandOptionsDefinition = {
  name: 'as',
  description: i18n.translate('kbn-esql-validation-autocomplete.esql.definitions.asDoc', {
    defaultMessage: 'As',
  }),
  signature: {
    multipleParams: false,
    params: [
      { name: 'oldName', type: 'column' },
      { name: 'newName', type: 'column' },
    ],
  },
  optional: false,
};

/** @deprecated — options are going away */
export const onOption: CommandOptionsDefinition = {
  name: 'on',
  description: i18n.translate('kbn-esql-validation-autocomplete.esql.definitions.onDoc', {
    defaultMessage: 'On',
  }),
  signature: {
    multipleParams: false,
    params: [{ name: 'matchingColumn', type: 'column' }],
  },
  optional: true,
};

/** @deprecated — options are going away */
export const withOption: CommandOptionsDefinition = {
  name: 'with',
  description: i18n.translate('kbn-esql-validation-autocomplete.esql.definitions.withDoc', {
    defaultMessage: 'With',
  }),
  signature: {
    multipleParams: true,
    params: [{ name: 'assignment', type: 'any' }],
  },
  optional: true,
};

/** @deprecated — options are going away */
export const appendSeparatorOption: CommandOptionsDefinition = {
  name: 'append_separator',
  description: i18n.translate(
    'kbn-esql-validation-autocomplete.esql.definitions.appendSeparatorDoc',
    {
      defaultMessage:
        'The character(s) that separate the appended fields. Default to empty string ("").',
    }
  ),
  signature: {
    multipleParams: false,
    params: [{ name: 'separator', type: 'string' }],
  },
  optional: true,
  skipCommonValidation: true, // tell the validation engine to use only the validate function here
  validate: (option: ESQLCommandOption) => {
    const messages: ESQLMessage[] = [];
    const [firstArg] = option.args;
    if (
      !Array.isArray(firstArg) &&
      (!isLiteralItem(firstArg) || firstArg.literalType !== 'keyword')
    ) {
      const value =
        'value' in firstArg && !isInlineCastItem(firstArg) ? firstArg.value : firstArg.name;
      messages.push(
        getMessageFromId({
          messageId: 'wrongDissectOptionArgumentType',
          values: { value: value ?? '' },
          locations: firstArg.location,
        })
      );
    }
    return messages;
  },
};
