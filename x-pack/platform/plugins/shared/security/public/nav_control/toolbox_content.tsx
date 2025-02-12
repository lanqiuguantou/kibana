/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// THIS COMPONENT IS ULTRA-HACKY AND FOR DEMO PURPOSES ONLY
// DO NOT USE THIS AS A REFERENCE FOR MUCH IF ANYTHING

import type { EuiListGroupItemProps } from '@elastic/eui';
import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiKeyPadMenu,
  EuiKeyPadMenuItem,
  EuiListGroup,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { css } from '@emotion/react';
import React from 'react';
import useObservable from 'react-use/lib/useObservable';
import type { Observable } from 'rxjs';

import type { ChromeRecentlyAccessedHistoryItem } from '@kbn/core/public';
import type { AuthenticatedUser } from '@kbn/security-plugin-types-common';
import type { GetUserProfileResponse } from '@kbn/security-plugin-types-public';
import type { UserProfileAvatarData } from '@kbn/user-profile-components';

import { useCurrentUser, useUserProfile } from '../components';

type UserProfile = ReturnType<typeof useUserProfile<{ avatar: UserProfileAvatarData }>>;
type UserProfileValue = GetUserProfileResponse<{ avatar: UserProfileAvatarData }>;

interface Props {
  recentlyAccessed$: Observable<ChromeRecentlyAccessedHistoryItem[]>;
}

const MAX_RECENTLY_ACCESS_ITEMS = 5;

export const ToolboxContent = (props: Props) => {
  const userProfile: UserProfile = useUserProfile<{ avatar: UserProfileAvatarData }>(
    'avatar,userSettings'
  );

  const currentUser = useCurrentUser();

  if (userProfile.value) {
    return <UserProfileContent profile={userProfile.value} {...props} />;
  }

  if (currentUser.value) {
    return <CurrentUserContent user={currentUser.value} {...props} />;
  }

  return null;
};

const UserProfileContent = ({
  profile: { user },
  ...props
}: { profile: UserProfileValue } & Props) => {
  return (
    <>
      <CurrentUserContent user={user} {...props} />
    </>
  );
};

const CurrentUserContent = ({
  user,
  recentlyAccessed$,
}: { user: Pick<AuthenticatedUser, 'roles' | 'username'> } & Props) => {
  const [selectedValue, setSelectedValue] = React.useState('light');
  const recentlyAccessed = useObservable(recentlyAccessed$, []);

  const items: EuiListGroupItemProps[] = recentlyAccessed
    .slice(0, MAX_RECENTLY_ACCESS_ITEMS)
    .map((recent) => ({
      label: recent.label,
      href: recent.link,
      color: 'primary',
      iconType: 'clock',
    }));
  const itemList = <EuiListGroup listItems={items} size="s" gutterSize="none" flush={true} />;

  return (
    <>
      <EuiFlexGroup
        direction="column"
        // @ts-expect-error
        css={({ euiTheme }) => css`
          padding-top: ${euiTheme.size.s};
        `}
        gutterSize="l"
      >
        <EuiFlexItem grow={false}>
          <EuiTitle size="m">
            <h4>{user.username}</h4>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="column" gutterSize="s">
            <EuiFlexItem>
              <EuiTitle size="xs">
                <h5>Roles</h5>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>
              <div>
                {user.roles.map((role) => (
                  <EuiBadge key={role} color="hollow">
                    {role}
                  </EuiBadge>
                ))}
              </div>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup direction="column" gutterSize="s">
            <EuiFlexItem>
              <EuiTitle size="xs">
                <h5>Recently Accessed</h5>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>{itemList}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="column" gutterSize="s">
            <EuiFlexItem>
              <EuiTitle size="xs">
                <h5>Theme</h5>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">Select the appearance of your interface.</EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiKeyPadMenu
                aria-label="Theme"
                data-test-subj="appearanceColorMode"
                checkable={{
                  legend: <span>Mode</span>,
                }}
              >
                {options.map(({ id, label, icon }) => (
                  <EuiKeyPadMenuItem
                    name={id}
                    key={id}
                    label={label}
                    checkable="single"
                    isSelected={selectedValue === id}
                    onChange={() => {
                      setSelectedValue(id);
                    }}
                    data-test-subj={`colorModeKeyPadItem${id}`}
                  >
                    <EuiIcon type={icon} size="l" />
                  </EuiKeyPadMenuItem>
                ))}
              </EuiKeyPadMenu>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

const options = [
  {
    id: 'system',
    label: 'System',
    icon: 'desktop',
  },
  {
    id: 'light',
    label: 'Light',
    icon: 'sun',
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: 'moon',
  },
  {
    id: 'space_default',
    label: 'Space',
    icon: 'spaces',
  },
];
