/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { closeToolbox, useCurrentTool, useWorkspaceDispatch } from '@kbn/core-workspace-state';
import { useWorkspaceContext } from '@kbn/core-workspace-state';

import {
  WorkspaceToolComponent,
  type WorkspaceToolComponentProps,
} from './workspace_tool.component';

export interface WorkspaceToolProps extends Omit<WorkspaceToolComponentProps, 'onClose'> {
  toolId?: string;
}

export const WorkspaceTool = () => {
  const currentTool = useCurrentTool();
  const context = useWorkspaceContext();
  const dispatch = useWorkspaceDispatch();
  const onClose = () => dispatch(closeToolbox());
  const definition = context.tools.find((t) => t.toolId === currentTool);

  if (!definition) {
    return null;
  }

  const { tool } = definition;

  return <WorkspaceToolComponent {...{ onClose, ...tool }} />;
};
