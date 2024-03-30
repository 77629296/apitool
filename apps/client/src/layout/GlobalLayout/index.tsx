'use client';

import { App } from 'antd';
import { createStyles } from 'antd-style';
import 'antd/dist/reset.css';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren, memo } from 'react';

import { API_ENDPOINTS } from '@/services/_url';

import AppTheme, { AppThemeProps } from './AppTheme';
import StoreHydration from './StoreHydration';

const useStyles = createStyles(({ css, token }) => ({
  bg: css`
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;

    background: ${token.colorBgLayout};
  `,
}));

const Container = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();

  return <App className={styles.bg}>{children}</App>;
});

interface GlobalLayoutProps extends AppThemeProps {
  enableOAuthSSO?: boolean;
}

const GlobalLayout = ({
  children,
  enableOAuthSSO = false,
  ...theme
}: GlobalLayoutProps) => {
  const content = (
    <AppTheme {...theme}>
      <StoreHydration />
      <Container>{children}</Container>
    </AppTheme>
  );

  return enableOAuthSSO ? (
    <SessionProvider basePath={API_ENDPOINTS.oauth}>{content}</SessionProvider>
  ) : (
    content
  );
};

export default GlobalLayout;
