/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiAccordion } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';
import styled from '@emotion/styled';
import { Stackframe } from '../../../../typings/es_schemas/raw/fields/stackframe';
import { KeyValueTable } from '../key_value_table';
import { flattenObject } from '../../../../common/utils/flatten_object';

const VariablesContainer = styled.div`
  background: ${({ theme }) => theme.euiTheme.colors.emptyShade};
  border-radius: 0 0
    ${({ theme }) => `${theme.euiTheme.border.radius.small} ${theme.euiTheme.border.radius.small}`};
  padding: ${({ theme }) => `${theme.euiTheme.size.s} ${theme.euiTheme.size.m}`};
`;

interface Props {
  vars: Stackframe['vars'];
}

export function Variables({ vars }: Props) {
  if (!vars) {
    return null;
  }
  const flattenedVariables = flattenObject(vars);
  return (
    <React.Fragment>
      <VariablesContainer>
        <EuiAccordion
          id="local-variables"
          className="euiAccordion"
          buttonContent={i18n.translate('xpack.apm.stacktraceTab.localVariablesToogleButtonLabel', {
            defaultMessage: 'Local variables',
          })}
        >
          <React.Fragment>
            <KeyValueTable keyValuePairs={flattenedVariables} />
          </React.Fragment>
        </EuiAccordion>
      </VariablesContainer>
    </React.Fragment>
  );
}
