import { PersistOptions, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { isDev } from '@/utils/env';

import { createHyperStorage } from '../middleware/createHyperStorage';
import { type GlobalState, initialState } from './initialState';
import { type CommonAction, createCommonSlice } from './slices/common/action';
import { type SettingsAction, createSettingsSlice } from './slices/settings/action';

//  ===============  聚合 createStoreFn ============ //

export type GlobalStore = CommonAction & GlobalState & SettingsAction;

const createStore: StateCreator<GlobalStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createCommonSlice(...parameters),
  ...createSettingsSlice(...parameters),
});

//  ===============  persist 本地缓存中间件配置 ============ //
type GlobalPersist = Pick<GlobalStore, 'settings'>;

const persistOptions: PersistOptions<GlobalStore, GlobalPersist> = {
  name: 'APICODE_GLOBAL',

  skipHydration: true,

  storage: createHyperStorage({
    localStorage: {
      dbName: 'APICode',
      selectors: ['common'],
    },
  }),
};

//  ===============  实装 useStore ============ //

export const useGlobalStore = createWithEqualityFn<GlobalStore>()(
  persist(
    subscribeWithSelector(
      devtools(createStore, {
        name: 'APICode_Global' + (isDev ? '_DEV' : ''),
      }),
    ),
    persistOptions,
  ),
  shallow,
);
