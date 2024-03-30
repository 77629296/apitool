import { ResolvingViewport } from 'next';
import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';

import { getServerConfig } from '@/config/server';
import {
  APICODE_THEME_APPEARANCE,
} from '@/const/theme';
import Layout from '@/layout/GlobalLayout';

import StyleRegistry from './StyleRegistry';

const { ENABLE_OAUTH_SSO } = getServerConfig();

const RootLayout = ({ children }: PropsWithChildren) => {
  // get default theme config to use with ssr
  const cookieStore = cookies();
  const appearance = cookieStore.get(APICODE_THEME_APPEARANCE);

  return (
    <html suppressHydrationWarning>
      <body>
        <StyleRegistry>
          <Layout
            defaultAppearance={appearance?.value}
            enableOAuthSSO={ENABLE_OAUTH_SSO}
          >
            {children}
          </Layout>
        </StyleRegistry>
      </body>
    </html>
  );
};

export default RootLayout;

export { default as metadata } from './metadata';

export const generateViewport = async (): ResolvingViewport => {

  return {
    initialScale: 1,
    minimumScale: 1,
    themeColor: [
      { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
      { color: '#000', media: '(prefers-color-scheme: dark)' },
    ],
    viewportFit: 'cover',
    width: 'device-width',
  };
};
