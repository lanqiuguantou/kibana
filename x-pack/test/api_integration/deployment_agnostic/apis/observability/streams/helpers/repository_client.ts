/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { StreamsRouteRepository } from '@kbn/streams-plugin/server';
import { RoleScopedSupertestProvider } from '../../../../services/role_scoped_supertest';
import {
  RepositorySupertestClient,
  getAdminApiClient,
} from '../../../../../../common/utils/server_route_repository/create_admin_service_from_repository';

export type StreamsSupertestRepositoryClient = RepositorySupertestClient<StreamsRouteRepository>;

export async function createStreamsRepositoryAdminClient(
  st: ReturnType<typeof RoleScopedSupertestProvider>
): Promise<StreamsSupertestRepositoryClient> {
  return getAdminApiClient<StreamsRouteRepository>(st);
}
