/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { BehaviorSubject } from 'rxjs';

export function initializeTrackPanel(untilEmbeddableLoaded: (id: string) => Promise<undefined>) {
  const expandedPanelId$ = new BehaviorSubject<string | undefined>(undefined);
  const focusedPanelId$ = new BehaviorSubject<string | undefined>(undefined);
  const highlightPanelId$ = new BehaviorSubject<string | undefined>(undefined);
  const scrollToPanelId$ = new BehaviorSubject<string | undefined>(undefined);
  let scrollPosition: number | undefined;

  function setScrollToPanelId(id: string | undefined) {
    if (scrollToPanelId$.value !== id) scrollToPanelId$.next(id);
  }

  function setExpandedPanelId(id: string | undefined) {
    if (expandedPanelId$.value !== id) expandedPanelId$.next(id);
  }

  return {
    expandedPanelId: expandedPanelId$,
    expandPanel: (panelId: string) => {
      const isPanelExpanded = panelId === expandedPanelId$.value;

      if (isPanelExpanded) {
        setExpandedPanelId(undefined);
        setScrollToPanelId(panelId);
        return;
      }

      setExpandedPanelId(panelId);
      scrollPosition = window.scrollY;
    },
    focusedPanelId$,
    highlightPanelId$,
    highlightPanel: (panelRef: HTMLDivElement) => {
      const id = highlightPanelId$.value;

      if (id && panelRef) {
        untilEmbeddableLoaded(id).then(() => {
          panelRef.classList.add('dshDashboardGrid__item--highlighted');
          // Removes the class after the highlight animation finishes
          setTimeout(() => {
            panelRef.classList.remove('dshDashboardGrid__item--highlighted');
          }, 5000);
        });
      }
      highlightPanelId$.next(undefined);
    },
    scrollToPanelId$,
    scrollToPanel: async (panelRef: HTMLDivElement) => {
      const id = scrollToPanelId$.value;
      if (!id) return;

      untilEmbeddableLoaded(id).then(() => {
        setScrollToPanelId(undefined);
        if (scrollPosition !== undefined) {
          window.scrollTo({ top: scrollPosition });
          scrollPosition = undefined;
        } else {
          panelRef.scrollIntoView({ block: 'start' });
        }
      });
    },
    scrollToTop: () => {
      window.scroll(0, 0);
    },
    setFocusedPanelId: (id: string | undefined) => {
      if (focusedPanelId$.value !== id) focusedPanelId$.next(id);
      setScrollToPanelId(id);
    },
    setHighlightPanelId: (id: string | undefined) => {
      if (highlightPanelId$.value !== id) highlightPanelId$.next(id);
    },
    setScrollToPanelId,
  };
}
