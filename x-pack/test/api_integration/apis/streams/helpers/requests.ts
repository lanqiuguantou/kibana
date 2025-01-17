/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { Client } from '@elastic/elasticsearch';
import { JsonObject } from '@kbn/utility-types';
import { Agent } from 'supertest';
import expect from '@kbn/expect';
import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { StreamConfigDefinition } from '@kbn/streams-schema';
import { ClientRequestParamsOf } from '@kbn/server-route-repository-utils';
import { StreamsRouteRepository } from '@kbn/streams-plugin/server';
import { StreamsSupertestRepositoryClient } from './repository_client';

export async function enableStreams(client: StreamsSupertestRepositoryClient) {
  await client.fetch('POST /api/streams/_enable').expect(200);
}

export async function disableStreams(client: StreamsSupertestRepositoryClient) {
  await client.fetch('POST /api/streams/_disable').expect(200);
}

export async function indexDocument(esClient: Client, index: string, document: JsonObject) {
  const response = await esClient.index({ index, document, refresh: 'wait_for' });
  return response;
}

export async function fetchDocument(esClient: Client, index: string, id: string) {
  const query = {
    ids: { values: [id] },
  };
  const response = await esClient.search({ index, query });
  expect((response.hits.total as SearchTotalHits).value).to.eql(1);
  return response.hits.hits[0];
}

export async function forkStream(
  client: StreamsSupertestRepositoryClient,
  root: string,
  body: ClientRequestParamsOf<
    StreamsRouteRepository,
    'POST /api/streams/{id}/_fork'
  >['params']['body']
) {
  return client
    .fetch(`POST /api/streams/{id}/_fork`, {
      params: {
        path: {
          id: root,
        },
        body,
      },
    })
    .expect(200)
    .then((response) => response.body);
}

export async function putStream(
  apiClient: StreamsSupertestRepositoryClient,
  name: string,
  body: StreamConfigDefinition,
  expectStatusCode: number = 200
) {
  return await apiClient
    .fetch('PUT /api/streams/{id}', {
      params: {
        path: {
          id: name,
        },
        body,
      },
    })
    .expect(expectStatusCode)
    .then((response) => response.body);
}

export async function getStream(supertest: Agent, name: string) {
  const req = supertest.get(`/api/streams/${encodeURIComponent(name)}`).set('kbn-xsrf', 'xxx');
  const response = await req.send().expect(200);
  return response.body;
}

export async function listStreams(supertest: Agent) {
  const req = supertest.get(`/api/streams`).set('kbn-xsrf', 'xxx');
  const response = await req.send().expect(200);
  return response.body;
}

export async function deleteStream(supertest: Agent, id: string) {
  const req = supertest.delete(`/api/streams/${id}`).set('kbn-xsrf', 'xxx');
  const response = await req.send().expect(200);
  return response.body;
}

export async function getUnmappedFieldsForStream(supertest: Agent, id: string) {
  const req = supertest.get(`/api/streams/${id}/schema/unmapped_fields`).set('kbn-xsrf', 'xxx');
  const response = await req.send().expect(200);
  return response.body;
}

export async function simulateFieldsForStream(supertest: Agent, id: string, body: JsonObject) {
  const req = supertest.post(`/api/streams/${id}/schema/fields_simulation`).set('kbn-xsrf', 'xxx');
  const response = await req.send(body).expect(200);
  return response.body;
}
