/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreSetup, CoreStart, Plugin, PluginInitializerContext } from '@kbn/core/public';
import { TelemetryService } from './services/telemetry';
import { createDatasetQuality } from './components/dataset_quality';
import { createDatasetQualityDetails } from './components/dataset_quality_details';
import { createDatasetQualityControllerLazyFactory } from './controller/dataset_quality/lazy_create_controller';
import { createDatasetQualityDetailsControllerLazyFactory } from './controller/dataset_quality_details/lazy_create_controller';
import { DataStreamsStatsService } from './services/data_streams_stats';
import { DataStreamDetailsService } from './services/data_stream_details';
import {
  DatasetQualityPluginSetup,
  DatasetQualityPluginStart,
  DatasetQualitySetupDeps,
  DatasetQualityStartDeps,
} from './types';

export class DatasetQualityPlugin
  implements Plugin<DatasetQualityPluginSetup, DatasetQualityPluginStart>
{
  private telemetry = new TelemetryService();
  private isServerless = false;

  constructor(private context: PluginInitializerContext) {}

  public setup(core: CoreSetup, plugins: DatasetQualitySetupDeps) {
    this.telemetry.setup({ analytics: core.analytics });
    this.isServerless = this.context.env.packageInfo.buildFlavor === 'serverless';

    return {};
  }

  public start(core: CoreStart, plugins: DatasetQualityStartDeps): DatasetQualityPluginStart {
    const telemetryClient = this.telemetry.start();

    const dataStreamStatsService = new DataStreamsStatsService().start({
      http: core.http,
    });

    const dataStreamDetailsService = new DataStreamDetailsService().start({
      http: core.http,
    });

    const DatasetQuality = createDatasetQuality({
      core,
      plugins,
      telemetryClient,
      isServerless: this.isServerless,
    });

    const createDatasetQualityController = createDatasetQualityControllerLazyFactory({
      core,
      dataStreamStatsService,
    });

    const DatasetQualityDetails = createDatasetQualityDetails({
      core,
      plugins,
      telemetryClient,
      isServerless: this.isServerless,
    });

    const createDatasetQualityDetailsController = createDatasetQualityDetailsControllerLazyFactory({
      core,
      plugins,
      dataStreamStatsService,
      dataStreamDetailsService,
    });

    return {
      DatasetQuality,
      createDatasetQualityController,
      DatasetQualityDetails,
      createDatasetQualityDetailsController,
    };
  }
}
