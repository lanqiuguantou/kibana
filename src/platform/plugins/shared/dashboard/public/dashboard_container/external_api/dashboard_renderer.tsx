/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import '../_dashboard_container.scss';

import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { EuiButton, EuiEmptyPrompt, EuiLoadingElastic, EuiLoadingSpinner } from '@elastic/eui';
import { SavedObjectNotFound } from '@kbn/kibana-utils-plugin/common';
import { useStateFromPublishingSubject } from '@kbn/presentation-publishing';
import { LocatorPublic } from '@kbn/share-plugin/common';

import { ExitFullScreenButtonKibanaProvider } from '@kbn/shared-ux-button-exit-full-screen';
import { httpResponseIntoObservable } from '@kbn/sse-utils-client';
import { from } from 'rxjs';
import { DashboardApi, DashboardInternalApi } from '../../dashboard_api/types';
import { coreServices, screenshotModeService } from '../../services/kibana_services';
import type { DashboardCreationOptions } from '../..';
import { DashboardLocatorParams, DashboardRedirect } from '../types';
import { Dashboard404Page } from './dashboard_404';
import { DashboardContext } from '../../dashboard_api/use_dashboard_api';
import { DashboardViewport } from '../component/viewport/dashboard_viewport';
import { loadDashboardApi } from '../../dashboard_api/load_dashboard_api';
import { DashboardInternalContext } from '../../dashboard_api/use_dashboard_internal_api';

export interface DashboardRendererProps {
  onApiAvailable?: (api: DashboardApi) => void;
  savedObjectId?: string;
  showPlainSpinner?: boolean;
  dashboardRedirect?: DashboardRedirect;
  getCreationOptions?: () => Promise<DashboardCreationOptions>;
  locator?: Pick<LocatorPublic<DashboardLocatorParams>, 'navigate' | 'getRedirectUrl'>;
}

export function DashboardRenderer({
  savedObjectId,
  getCreationOptions,
  dashboardRedirect,
  showPlainSpinner,
  locator,
  onApiAvailable,
}: DashboardRendererProps) {
  const { http } = coreServices;

  const dashboardViewport = useRef(null);
  const dashboardContainerRef = useRef<HTMLElement | null>(null);
  const [dashboardApi, setDashboardApi] = useState<DashboardApi | undefined>();
  const [dashboardInternalApi, setDashboardInternalApi] = useState<
    DashboardInternalApi | undefined
  >();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    /* In case the locator prop changes, we need to reassign the value in the container */
    if (dashboardApi) dashboardApi.locator = locator;
  }, [dashboardApi, locator]);

  // subscribe to Dashboard events
  useEffect(() => {
    if (!dashboardApi) return;
    const eventStream$ = from(
      http.get(`/api/dashboards/dashboard/${savedObjectId}/events`, {
        asResponse: true,
        rawResponse: true,
      })
    ).pipe(httpResponseIntoObservable());

    const eventSubscription = eventStream$.subscribe({
      next: (event) => {
        console.log(event);
        dashboardApi?.refreshPanels();
      },
      error: (err) => {
        console.error('Error receiving dashboard events:', err);
      },
    });
    return () => eventSubscription.unsubscribe();
  }, [dashboardApi, http, savedObjectId]);

  useEffect(() => {
    if (error) setError(undefined);
    if (dashboardApi) setDashboardApi(undefined);
    if (dashboardInternalApi) setDashboardInternalApi(undefined);

    let canceled = false;
    let cleanupDashboardApi: (() => void) | undefined;
    loadDashboardApi({ getCreationOptions, savedObjectId })
      .then((results) => {
        if (!results) return;
        if (canceled) {
          results.cleanup();
          return;
        }
        http.post(`/api/dashboards/dashboard/${savedObjectId}/events`, {
          body: JSON.stringify({ type: 'dashboard.opened' }),
        });

        cleanupDashboardApi = results.cleanup;
        setDashboardApi(results.api);
        setDashboardInternalApi(results.internalApi);
        onApiAvailable?.(results.api);
      })
      .catch((err) => {
        if (!canceled) setError(err);
      });

    return () => {
      cleanupDashboardApi?.();
      canceled = true;
    };
    // Disabling exhaustive deps because embeddable should only be created on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedObjectId]);

  const viewportClasses = classNames(
    'dashboardViewport',
    { 'dashboardViewport--screenshotMode': screenshotModeService.isScreenshotMode() },
    { 'dashboardViewport--loading': !error && !dashboardApi }
  );

  const loadingSpinner = showPlainSpinner ? (
    <EuiLoadingSpinner size="xxl" />
  ) : (
    <EuiLoadingElastic size="xxl" />
  );

  const renderDashboardContents = () => {
    if (error) {
      return error instanceof SavedObjectNotFound ? (
        <Dashboard404Page dashboardRedirect={dashboardRedirect} />
      ) : (
        <EuiEmptyPrompt
          iconType="error"
          color="danger"
          title={
            <h2>
              {i18n.translate('dashboard.renderer.errorTitle', {
                defaultMessage: 'Dashboard load error',
              })}
            </h2>
          }
          body={<p>{error.message}</p>}
        />
      );
    }

    return dashboardApi && dashboardInternalApi ? (
      <div className="dashboardContainer" ref={(e) => (dashboardContainerRef.current = e)}>
        <ExitFullScreenButtonKibanaProvider
          coreStart={{ chrome: coreServices.chrome, customBranding: coreServices.customBranding }}
        >
          <DashboardContext.Provider value={dashboardApi}>
            <DashboardInternalContext.Provider value={dashboardInternalApi}>
              <EuiButton onClick={() => dashboardApi.refreshPanels()}>REFRESH TEST</EuiButton>
              <DashboardViewport dashboardContainerRef={dashboardContainerRef} />
            </DashboardInternalContext.Provider>
          </DashboardContext.Provider>
        </ExitFullScreenButtonKibanaProvider>
      </div>
    ) : (
      loadingSpinner
    );
  };

  return (
    <div ref={dashboardViewport} className={viewportClasses}>
      {dashboardViewport?.current && dashboardApi && (
        <ParentClassController
          viewportRef={dashboardViewport.current}
          dashboardApi={dashboardApi}
        />
      )}
      {renderDashboardContents()}
    </div>
  );
}

/**
 * Maximizing a panel in Dashboard only works if the parent div has a certain class. This
 * small component listens to the Dashboard's expandedPanelId state and adds and removes
 * the class to whichever element renders the Dashboard.
 */
const ParentClassController = ({
  dashboardApi,
  viewportRef,
}: {
  dashboardApi: DashboardApi;
  viewportRef: HTMLDivElement;
}) => {
  const maximizedPanelId = useStateFromPublishingSubject(dashboardApi.expandedPanelId$);

  useLayoutEffect(() => {
    const parentDiv = viewportRef.parentElement;
    if (!parentDiv) return;

    if (maximizedPanelId) {
      parentDiv.classList.add('dshDashboardViewportWrapper');
    } else {
      parentDiv.classList.remove('dshDashboardViewportWrapper');
    }
  }, [maximizedPanelId, viewportRef.parentElement]);
  return null;
};
