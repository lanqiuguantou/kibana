/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { TopNodesResponse } from '../../common/http_api/overview_api';

export const FAKE_SNAPSHOT_RESPONSE = {
  nodes: [
    {
      path: [{ value: 'host-01', label: 'host-01', ip: '192.168.1.10' }],
      metrics: [
        {
          name: 'memory',
          value: 0.002,
          max: 0.00134,
          avg: 0.0009833333333333335,
          timeseries: {
            id: 'memory',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 0.001 },
              { timestamp: 1593631055000, metric_0: 0.00099 },
              { timestamp: 1593631355000, metric_0: 0.00133 },
              { timestamp: 1593631655000, metric_0: 0.00099 },
              { timestamp: 1593631955000, metric_0: 0.001 },
              { timestamp: 1593632255000, metric_0: 0.00099 },
              { timestamp: 1593632555000, metric_0: 0.00067 },
              { timestamp: 1593632855000, metric_0: 0.001 },
              { timestamp: 1593633155000, metric_0: 0.00099 },
              { timestamp: 1593633455000, metric_0: 0.00099 },
              { timestamp: 1593633755000, metric_0: 0.00099 },
              { timestamp: 1593634055000, metric_0: 0.001 },
              { timestamp: 1593634355000, metric_0: 0.00067 },
              { timestamp: 1593634655000, metric_0: 0.00133 },
              { timestamp: 1593634955000, metric_0: 0.00101 },
              { timestamp: 1593635255000, metric_0: 0.00134 },
              { timestamp: 1593635555000, metric_0: 0.00133 },
              { timestamp: 1593635855000, metric_0: 0.00102 },
              { timestamp: 1593636155000, metric_0: 0.00101 },
              { timestamp: 1593636455000, metric_0: 0.001 },
            ],
          },
        },
        {
          name: 'cpu',
          value: 0.002,
          max: 0.00134,
          avg: 0.0009833333333333335,
          timeseries: {
            id: 'cpu',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 0.001 },
              { timestamp: 1593631055000, metric_0: 0.00099 },
              { timestamp: 1593631355000, metric_0: 0.00133 },
              { timestamp: 1593631655000, metric_0: 0.00099 },
              { timestamp: 1593631955000, metric_0: 0.001 },
              { timestamp: 1593632255000, metric_0: 0.00099 },
              { timestamp: 1593632555000, metric_0: 0.00067 },
              { timestamp: 1593632855000, metric_0: 0.001 },
              { timestamp: 1593633155000, metric_0: 0.00099 },
              { timestamp: 1593633455000, metric_0: 0.00099 },
              { timestamp: 1593633755000, metric_0: 0.00099 },
              { timestamp: 1593634055000, metric_0: 0.001 },
              { timestamp: 1593634355000, metric_0: 0.00067 },
              { timestamp: 1593634655000, metric_0: 0.00133 },
              { timestamp: 1593634955000, metric_0: 0.00101 },
              { timestamp: 1593635255000, metric_0: 0.00134 },
              { timestamp: 1593635555000, metric_0: 0.00133 },
              { timestamp: 1593635855000, metric_0: 0.00102 },
              { timestamp: 1593636155000, metric_0: 0.00101 },
              { timestamp: 1593636455000, metric_0: 0.001 },
            ],
          },
        },
        {
          name: 'rx',
          value: 4,
          max: 13,
          avg: 3.761904761904762,
          timeseries: {
            id: 'rx',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 4 },
              { timestamp: 1593631055000, metric_0: 4 },
              { timestamp: 1593631355000, metric_0: 9 },
              { timestamp: 1593631655000, metric_0: 4 },
              { timestamp: 1593631955000, metric_0: 3 },
              { timestamp: 1593632255000, metric_0: 2 },
              { timestamp: 1593632555000, metric_0: 2 },
              { timestamp: 1593632855000, metric_0: 4 },
              { timestamp: 1593633155000, metric_0: 3 },
              { timestamp: 1593633455000, metric_0: 2 },
              { timestamp: 1593633755000, metric_0: 2 },
              { timestamp: 1593634055000, metric_0: 3 },
              { timestamp: 1593634355000, metric_0: 0 },
              { timestamp: 1593634655000, metric_0: 11 },
              { timestamp: 1593634955000, metric_0: 6 },
              { timestamp: 1593635255000, metric_0: 14 },
              { timestamp: 1593635555000, metric_0: 10 },
              { timestamp: 1593635855000, metric_0: 8 },
              { timestamp: 1593636155000, metric_0: 4 },
              { timestamp: 1593636455000, metric_0: 4 },
            ],
          },
        },
        {
          name: 'tx',
          value: 3,
          max: 13,
          avg: 3.761904761904762,
          timeseries: {
            id: 'tx',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 5 },
              { timestamp: 1593631055000, metric_0: 5 },
              { timestamp: 1593631355000, metric_0: 10 },
              { timestamp: 1593631655000, metric_0: 5 },
              { timestamp: 1593631955000, metric_0: 3 },
              { timestamp: 1593632255000, metric_0: 3 },
              { timestamp: 1593632555000, metric_0: 3 },
              { timestamp: 1593632855000, metric_0: 5 },
              { timestamp: 1593633155000, metric_0: 4 },
              { timestamp: 1593633455000, metric_0: 3 },
              { timestamp: 1593633755000, metric_0: 3 },
              { timestamp: 1593634055000, metric_0: 3 },
              { timestamp: 1593634355000, metric_0: 2 },
              { timestamp: 1593634655000, metric_0: 12 },
              { timestamp: 1593634955000, metric_0: 7 },
              { timestamp: 1593635255000, metric_0: 15 },
              { timestamp: 1593635555000, metric_0: 11 },
              { timestamp: 1593635855000, metric_0: 9 },
              { timestamp: 1593636155000, metric_0: 4 },
              { timestamp: 1593636455000, metric_0: 5 },
            ],
          },
        },
      ],
    },
    {
      path: [{ value: 'host-02', label: 'host-02', ip: '192.168.1.11' }],
      metrics: [
        {
          name: 'memory',
          value: 0.001,
          max: 0.00134,
          avg: 0.0009833333333333335,
          timeseries: {
            id: 'memory',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 0.001 },
              { timestamp: 1593631055000, metric_0: 0.00099 },
              { timestamp: 1593631355000, metric_0: 0.00133 },
              { timestamp: 1593631655000, metric_0: 0.00099 },
              { timestamp: 1593631955000, metric_0: 0.001 },
              { timestamp: 1593632255000, metric_0: 0.00099 },
              { timestamp: 1593632555000, metric_0: 0.00067 },
              { timestamp: 1593632855000, metric_0: 0.001 },
              { timestamp: 1593633155000, metric_0: 0.00099 },
              { timestamp: 1593633455000, metric_0: 0.00099 },
              { timestamp: 1593633755000, metric_0: 0.00099 },
              { timestamp: 1593634055000, metric_0: 0.001 },
              { timestamp: 1593634355000, metric_0: 0.00067 },
              { timestamp: 1593634655000, metric_0: 0.00133 },
              { timestamp: 1593634955000, metric_0: 0.00101 },
              { timestamp: 1593635255000, metric_0: 0.00134 },
              { timestamp: 1593635555000, metric_0: 0.00133 },
              { timestamp: 1593635855000, metric_0: 0.00102 },
              { timestamp: 1593636155000, metric_0: 0.00101 },
              { timestamp: 1593636455000, metric_0: 0.001 },
            ],
          },
        },
        {
          name: 'cpu',
          value: 0.001,
          max: 0.00134,
          avg: 0.0009833333333333335,
          timeseries: {
            id: 'cpu',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 0.001 },
              { timestamp: 1593631055000, metric_0: 0.00099 },
              { timestamp: 1593631355000, metric_0: 0.00133 },
              { timestamp: 1593631655000, metric_0: 0.00099 },
              { timestamp: 1593631955000, metric_0: 0.001 },
              { timestamp: 1593632255000, metric_0: 0.00099 },
              { timestamp: 1593632555000, metric_0: 0.00067 },
              { timestamp: 1593632855000, metric_0: 0.001 },
              { timestamp: 1593633155000, metric_0: 0.00099 },
              { timestamp: 1593633455000, metric_0: 0.00099 },
              { timestamp: 1593633755000, metric_0: 0.00099 },
              { timestamp: 1593634055000, metric_0: 0.001 },
              { timestamp: 1593634355000, metric_0: 0.00067 },
              { timestamp: 1593634655000, metric_0: 0.00133 },
              { timestamp: 1593634955000, metric_0: 0.00101 },
              { timestamp: 1593635255000, metric_0: 0.00134 },
              { timestamp: 1593635555000, metric_0: 0.00133 },
              { timestamp: 1593635855000, metric_0: 0.00102 },
              { timestamp: 1593636155000, metric_0: 0.00101 },
              { timestamp: 1593636455000, metric_0: 0.001 },
            ],
          },
        },
        {
          name: 'rx',
          value: 3,
          max: 13,
          avg: 3.761904761904762,
          timeseries: {
            id: 'rx',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 3 },
              { timestamp: 1593631055000, metric_0: 3 },
              { timestamp: 1593631355000, metric_0: 8 },
              { timestamp: 1593631655000, metric_0: 3 },
              { timestamp: 1593631955000, metric_0: 2 },
              { timestamp: 1593632255000, metric_0: 1 },
              { timestamp: 1593632555000, metric_0: 1 },
              { timestamp: 1593632855000, metric_0: 3 },
              { timestamp: 1593633155000, metric_0: 2 },
              { timestamp: 1593633455000, metric_0: 1 },
              { timestamp: 1593633755000, metric_0: 1 },
              { timestamp: 1593634055000, metric_0: 2 },
              { timestamp: 1593634355000, metric_0: 0 },
              { timestamp: 1593634655000, metric_0: 10 },
              { timestamp: 1593634955000, metric_0: 5 },
              { timestamp: 1593635255000, metric_0: 13 },
              { timestamp: 1593635555000, metric_0: 9 },
              { timestamp: 1593635855000, metric_0: 7 },
              { timestamp: 1593636155000, metric_0: 2 },
              { timestamp: 1593636455000, metric_0: 3 },
            ],
          },
        },
        {
          name: 'tx',
          value: 3,
          max: 13,
          avg: 3.761904761904762,
          timeseries: {
            id: 'tx',
            columns: [
              { name: 'timestamp', type: 'date' },
              { name: 'metric_0', type: 'number' },
            ],
            rows: [
              { timestamp: 1593630455000, metric_0: 0 },
              { timestamp: 1593630755000, metric_0: 3 },
              { timestamp: 1593631055000, metric_0: 3 },
              { timestamp: 1593631355000, metric_0: 8 },
              { timestamp: 1593631655000, metric_0: 3 },
              { timestamp: 1593631955000, metric_0: 2 },
              { timestamp: 1593632255000, metric_0: 1 },
              { timestamp: 1593632555000, metric_0: 1 },
              { timestamp: 1593632855000, metric_0: 3 },
              { timestamp: 1593633155000, metric_0: 2 },
              { timestamp: 1593633455000, metric_0: 1 },
              { timestamp: 1593633755000, metric_0: 1 },
              { timestamp: 1593634055000, metric_0: 2 },
              { timestamp: 1593634355000, metric_0: 0 },
              { timestamp: 1593634655000, metric_0: 10 },
              { timestamp: 1593634955000, metric_0: 5 },
              { timestamp: 1593635255000, metric_0: 13 },
              { timestamp: 1593635555000, metric_0: 9 },
              { timestamp: 1593635855000, metric_0: 7 },
              { timestamp: 1593636155000, metric_0: 2 },
              { timestamp: 1593636455000, metric_0: 3 },
            ],
          },
        },
      ],
    },
  ],
  interval: '300s',
};

export const FAKE_OVERVIEW_RESPONSE: TopNodesResponse = {
  series: [],
};
