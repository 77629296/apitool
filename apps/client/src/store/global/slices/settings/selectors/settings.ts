import { GlobalSettings } from '@/types/settings';
import { merge } from '@/utils/merge';

import { GlobalStore } from '../../../store';

export const currentSettings = (s: GlobalStore): GlobalSettings =>
  {
    return merge(s.defaultSettings, s.settings);
  }

const password = (s: GlobalStore) => currentSettings(s).password;

// TODO: Maybe we can also export settings difference
const exportSettings = (s: GlobalStore) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...settings } = currentSettings(s);

  return settings as GlobalSettings;
};

const dalleConfig = (s: GlobalStore) => currentSettings(s).tool?.dalle || {};
const isDalleAutoGenerating = (s: GlobalStore) => currentSettings(s).tool?.dalle?.autoGenerate;

export const settingsSelectors = {
  currentSettings,
  dalleConfig,
  exportSettings,
  isDalleAutoGenerating,
  password,
};
