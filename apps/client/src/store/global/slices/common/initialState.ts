import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export enum SidebarTabKey {
  Workbench = 'workbench',
  Settings = 'settings',
}

export enum SettingsTabs {
  About = 'about',
  Agent = 'agent',
  Common = 'common',
}

export interface Guide {
  // Topic 引导
  topic?: boolean;
}

export interface GlobalCommonState {
  hasNewVersion?: boolean;
  isMobile?: boolean;
  latestVersion?: string;
  router?: AppRouterInstance;
  sidebarKey: SidebarTabKey;
}

export const initialCommonState: GlobalCommonState = {
  isMobile: false,
  sidebarKey: SidebarTabKey.Workbench,
};
