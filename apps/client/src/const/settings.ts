import {
  GlobalBaseSettings,
  GlobalSettings,
} from '@/types/settings';

export const DEFAULT_BASE_SETTINGS: GlobalBaseSettings = {
  fontSize: 14,
  password: '',
  themeMode: 'auto',
};

export const COOKIE_CACHE_DAYS = 30;

export const DEFAULT_SETTINGS: GlobalSettings = {
  ...DEFAULT_BASE_SETTINGS,
};
