'use client';
import { Center, Flexbox } from 'react-layout-kit';

import AppLayout from '@/layout/AppLayout';
import { SidebarTabKey } from '@/store/global/initialState';

const Page = () => {
  return <AppLayout sidebarKey={SidebarTabKey.Settings}>
    <Flexbox flex={1} height={'100%'} style={{ position: 'relative' }}>
      <Flexbox align={'center'} flex={1} padding={24} style={{ overflow: 'scroll' }}>
        <Center gap={16} width={'100%'}>
          settings
        </Center>
      </Flexbox>
    </Flexbox>
  </AppLayout>
};

export default Page;
