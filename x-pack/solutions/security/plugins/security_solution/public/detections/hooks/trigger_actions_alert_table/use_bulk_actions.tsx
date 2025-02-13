/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import type { SerializableRecord } from '@kbn/utility-types';
import { isEqual } from 'lodash';
import type { Filter } from '@kbn/es-query';
import { useMemo, useCallback } from 'react';
import type { TableId } from '@kbn/securitysolution-data-table';
import type { GetSecurityAlertsTableProp } from '../../components/alerts_table/types';
import { useBulkAlertAssigneesItems } from '../../../common/components/toolbar/bulk_actions/use_bulk_alert_assignees_items';
import { useBulkAlertTagsItems } from '../../../common/components/toolbar/bulk_actions/use_bulk_alert_tags_items';
import { SourcererScopeName } from '../../../sourcerer/store/model';
import { useGlobalTime } from '../../../common/containers/use_global_time';
import { useAddBulkToTimelineAction } from '../../components/alerts_table/timeline_actions/use_add_bulk_to_timeline';
import { useBulkAlertActionItems } from './use_alert_actions';
import { useDeepEqualSelector } from '../../../common/hooks/use_selector';
import type { inputsModel } from '../../../common/store';
import { inputsSelectors } from '../../../common/store';

// check to see if the query is a known "empty" shape
export function isKnownEmptyQuery(query: QueryDslQueryContainer) {
  const queries = [
    // the default query used by the job wizards
    { bool: { must: [{ match_all: {} }] } },
    // the default query used created by lens created jobs
    { bool: { filter: [], must: [{ match_all: {} }], must_not: [] } },
    // variations on the two previous queries
    { bool: { filter: [], must: [{ match_all: {} }] } },
    { bool: { must: [{ match_all: {} }], must_not: [] } },
    // the query generated by QA Framework created jobs
    { match_all: {} },
  ];
  if (queries.some((q) => isEqual(q, query))) {
    return true;
  }

  return false;
}

function getFiltersForDSLQuery(datafeedQuery: QueryDslQueryContainer): Filter[] {
  if (isKnownEmptyQuery(datafeedQuery)) {
    return [];
  }

  return [
    {
      meta: {
        negate: false,
        disabled: false,
        type: 'custom',
        value: JSON.stringify(datafeedQuery),
      },
      query: datafeedQuery as SerializableRecord,
    },
  ];
}

export const getBulkActionsByTableType =
  (tableId: TableId): GetSecurityAlertsTableProp<'getBulkActions'> =>
  (query, refresh) => {
    const { from, to } = useGlobalTime();
    const filters = useMemo(() => {
      return getFiltersForDSLQuery(query);
    }, [query]);
    const assigneeProps = useMemo(() => {
      return {
        onAssigneesUpdate: refresh,
      };
    }, [refresh]);

    const { alertAssigneesItems, alertAssigneesPanels } = useBulkAlertAssigneesItems(assigneeProps);

    const timelineActionParams = useMemo(() => {
      return {
        localFilters: filters,
        from,
        to,
        scopeId: SourcererScopeName.detections,
        tableId,
      };
    }, [filters, from, to]);

    const getGlobalQueriesSelector = useMemo(() => inputsSelectors.globalQuery(), []);
    const globalQueries = useDeepEqualSelector(getGlobalQueriesSelector);

    const refetch = useCallback(() => {
      refresh();
      globalQueries.forEach((q) => q.refetch && (q.refetch as inputsModel.Refetch)());
    }, [globalQueries, refresh]);

    const alertActionParams = useMemo(() => {
      return {
        scopeId: SourcererScopeName.detections,
        filters,
        from,
        to,
        tableId,
        refetch,
      };
    }, [from, to, filters, refetch]);

    const bulkAlertTagParams = useMemo(() => {
      return {
        refetch: refresh,
      };
    }, [refresh]);

    const timelineAction = useAddBulkToTimelineAction(timelineActionParams);

    const alertActions = useBulkAlertActionItems(alertActionParams);

    const { alertTagsItems, alertTagsPanels } = useBulkAlertTagsItems(bulkAlertTagParams);

    const items = useMemo(() => {
      return [...alertActions, timelineAction, ...alertTagsItems, ...alertAssigneesItems];
    }, [alertActions, alertTagsItems, timelineAction, alertAssigneesItems]);
    return useMemo(() => {
      return [{ id: 0, items }, ...alertTagsPanels, ...alertAssigneesPanels];
    }, [alertTagsPanels, items, alertAssigneesPanels]);
  };
