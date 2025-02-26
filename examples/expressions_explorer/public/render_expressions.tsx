/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useState } from 'react';
import {
  EuiFlexItem,
  EuiFlexGroup,
  EuiPageBody,
  EuiPageTemplate,
  EuiPageSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPanel,
  EuiText,
  EuiTitle,
  EuiButton,
  EuiSpacer,
} from '@elastic/eui';
import { ExpressionsStart } from '@kbn/expressions-plugin/public';
import { Start as InspectorStart } from '@kbn/inspector-plugin/public';
import { ExpressionEditor } from './editor/expression_editor';

interface Props {
  expressions: ExpressionsStart;
  inspector: InspectorStart;
}

export function RenderExpressionsExample({ expressions, inspector }: Props) {
  const [expression, updateExpression] = useState(
    'markdownVis "## expressions explorer rendering"'
  );

  const expressionChanged = (value: string) => {
    updateExpression(value);
  };

  const inspectorAdapters = {};

  return (
    <EuiPageBody>
      <EuiPageHeader>
        <EuiPageHeaderSection>
          <EuiTitle>
            <h1>Render expressions</h1>
          </EuiTitle>
        </EuiPageHeaderSection>
      </EuiPageHeader>
      <EuiPageTemplate.Section>
        <EuiPageSection>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>
                In the below editor you can enter your expression and render it. Using
                ReactExpressionRenderer component makes that very easy.
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiButton
                onClick={() => {
                  inspector.open(inspectorAdapters);
                }}
              >
                Open Inspector
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer />

          <EuiFlexGroup gutterSize="l">
            <EuiFlexItem>
              <EuiPanel data-test-subj="expressionEditor" paddingSize="none" role="figure">
                <ExpressionEditor value={expression} onChange={expressionChanged} />
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel data-test-subj="expressionRender" paddingSize="none" role="figure">
                <expressions.ReactExpressionRenderer
                  expression={expression}
                  debug={true}
                  onData$={(result, panels) => {
                    Object.assign(inspectorAdapters, panels);
                  }}
                  renderError={(message: any) => {
                    return <div>{message}</div>;
                  }}
                />
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageSection>
      </EuiPageTemplate.Section>
    </EuiPageBody>
  );
}
