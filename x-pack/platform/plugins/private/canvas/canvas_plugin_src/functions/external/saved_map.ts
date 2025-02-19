/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ExpressionFunctionDefinition } from '@kbn/expressions-plugin/common';
import { SavedObjectReference } from '@kbn/core/types';
import { ExpressionValueFilter, MapCenter, TimeRange as TimeRangeArg } from '../../../types';
import {
  EmbeddableTypes,
  EmbeddableExpressionType,
  EmbeddableExpression,
} from '../../expression_types';
import { getFunctionHelp } from '../../../i18n';

interface Arguments {
  id: string;
  center: MapCenter | null;
  hideLayer: string[];
  title: string | null;
  timerange: TimeRangeArg | null;
}

const defaultTimeRange = {
  from: 'now-15m',
  to: 'now',
};

export function savedMap(): ExpressionFunctionDefinition<
  'savedMap',
  ExpressionValueFilter | null,
  Arguments,
  EmbeddableExpression
> {
  const { help, args: argHelp } = getFunctionHelp().savedMap;
  return {
    name: 'savedMap',
    help,
    args: {
      id: {
        types: ['string'],
        required: false,
        help: argHelp.id,
      },
      center: {
        types: ['mapCenter'],
        help: argHelp.center,
        required: false,
      },
      hideLayer: {
        types: ['string'],
        help: argHelp.hideLayer,
        required: false,
        multi: true,
      },
      timerange: {
        types: ['timerange'],
        help: argHelp.timerange,
        required: false,
      },
      title: {
        types: ['string'],
        help: argHelp.title,
        required: false,
      },
    },
    type: EmbeddableExpressionType,
    fn: (input, args) => {
      return {
        type: EmbeddableExpressionType,
        input: {
          id: args.id,
          savedObjectId: args.id,
          timeRange: args.timerange || defaultTimeRange,
          mapCenter: args.center
            ? {
                lat: args.center.lat,
                lon: args.center.lon,
                zoom: args.center.zoom,
              }
            : undefined,
          hideFilterActions: true,
          title: args.title === null ? undefined : args.title,
          isLayerTOCOpen: false,
          hiddenLayers: args.hideLayer || [],
        },
        embeddableType: EmbeddableTypes.map,
        generatedAt: Date.now(),
      };
    },
    extract(state) {
      const refName = 'savedMap.id';
      const references: SavedObjectReference[] = [
        {
          name: refName,
          type: 'map',
          id: state.id[0] as string,
        },
      ];
      return {
        state: {
          ...state,
          id: [refName],
        },
        references,
      };
    },

    inject(state, references) {
      const reference = references.find((ref) => ref.name === 'savedMap.id');
      if (reference) {
        state.id[0] = reference.id;
      }
      return state;
    },
  };
}
