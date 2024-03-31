'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Avatar } from 'antd'

import { DivProps } from '@/types/html';
import { SidebarTabKey } from '@/store/global/initialState';
import { withBasePath } from '@/utils/basePath';

import { useStyles } from './style';

import TopActions from './TopActions';
import BottomActions from './BottomActions';

interface SideNavProps extends DivProps {
  sidebarKey?: SidebarTabKey;
}

export default memo<SideNavProps>(({ className, sidebarKey, ...rest }) => {
  const { styles, cx } = useStyles();

  return (
    <Flexbox
      align={'center'}
      className={cx(styles, className)}
      flex={'none'}
      justify={'space-between'}
      {...rest}
    >
      <Flexbox align="center" direction="vertical" gap={16}>
        <Avatar size={50} src={withBasePath(`/icons/android-chrome-512x512.png`)} />
        <Flexbox align="center" direction="vertical" gap={8}>
          <TopActions />
        </Flexbox>
      </Flexbox>
      <Flexbox align="center" direction="vertical" gap={4}>
        <BottomActions />
      </Flexbox>
    </Flexbox>
  );
});
