import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { useGlobalStore } from '@/store/global';
import { useEffectAfterGlobalHydrated } from '@/store/global/hooks/useEffectAfterHydrated';

const StoreHydration = memo(() => {
  const [useFetchServerConfig, useFetchUserConfig] = useGlobalStore((s) => [
    s.useFetchServerConfig,
    s.useFetchUserConfig,
  ]);
  const { isLoading } = useFetchServerConfig();

  useFetchUserConfig(!isLoading);

  useEffect(() => {
    // refs: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#hashydrated
    useGlobalStore.persist.rehydrate();
  }, []);

  const router = useRouter();

  useEffectAfterGlobalHydrated(
    (store) => {
      store.setState({ router });
    },
    [router],
  );

  useEffect(() => {
    router.prefetch('/settings/common');
  }, [router]);

  return null;
});

export default StoreHydration;
