/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useParams } from 'react-router-dom';
import React, { useMemo } from 'react';
import { KibanaPageTemplate } from '@kbn/shared-ux-page-kibana-template';
import { useKibana } from '../../hooks/use_kibana';
import { SynonymsSetRuleTable } from './synonyms_set_rule_table';
import { ConnectToApiButton } from '../connect_to_api/connect_to_api_button';
import { ConnectToApiFlyout } from '../connect_to_api/connect_to_api_flyout';

export const SynonymsSetDetail = () => {
  const { synonymsSetId = '' } = useParams<{
    synonymsSetId?: string;
  }>();
  const {
    services: { console: consolePlugin, history, searchNavigation },
  } = useKibana();

  const embeddableConsole = useMemo(
    () => (consolePlugin?.EmbeddableConsole ? <consolePlugin.EmbeddableConsole /> : null),
    [consolePlugin]
  );
  const [isApiConnectModalVisible, setIsApiConnectModalVisible] = React.useState(false);

  return (
    <KibanaPageTemplate
      offset={0}
      restrictWidth={false}
      grow={false}
      data-test-subj="searchSynonymsSetDetailPage"
      solutionNav={searchNavigation?.useClassicNavigation(history)}
      color="primary"
    >
      <KibanaPageTemplate.Header
        pageTitle={synonymsSetId}
        restrictWidth
        color="primary"
        rightSideItems={[
          <ConnectToApiButton
            onClick={() => {
              setIsApiConnectModalVisible(true);
            }}
          />,
        ]}
      />
      <KibanaPageTemplate.Section restrictWidth>
        {synonymsSetId && <SynonymsSetRuleTable synonymsSetId={synonymsSetId} />}
        {isApiConnectModalVisible && (
          <ConnectToApiFlyout
            rulesetId={synonymsSetId}
            onClose={() => {
              setIsApiConnectModalVisible(false);
            }}
          />
        )}
      </KibanaPageTemplate.Section>
      {embeddableConsole}
    </KibanaPageTemplate>
  );
};
