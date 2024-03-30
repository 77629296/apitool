/**
 * the client config is only used in Vercel deployment
 */

/* eslint-disable sort-keys-fix/sort-keys-fix , typescript-sort-keys/interface */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ANALYTICS_VERCEL?: string;
      NEXT_PUBLIC_VERCEL_DEBUG?: string;

      NEXT_PUBLIC_I18N_DEBUG: string;
      NEXT_PUBLIC_I18N_DEBUG_BROWSER: string;
      NEXT_PUBLIC_I18N_DEBUG_SERVER: string;

      NEXT_PUBLIC_DEVELOPER_DEBUG: string;
      NEXT_PUBLIC_APICODE_DOCS: string;
    }
  }
}

export const getClientConfig = () => ({
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // docs
  APICODE_DOCS: process.env.NEXT_PUBLIC_APICODE_DOCS,

  // Vercel Analytics
  ANALYTICS_VERCEL: process.env.NEXT_PUBLIC_ANALYTICS_VERCEL === '1',
  VERCEL_DEBUG: process.env.NEXT_PUBLIC_VERCEL_DEBUG === '1',

  // i18n debug mode
  I18N_DEBUG: process.env.NEXT_PUBLIC_I18N_DEBUG === '1',
  I18N_DEBUG_BROWSER: process.env.NEXT_PUBLIC_I18N_DEBUG_BROWSER === '1',
  I18N_DEBUG_SERVER: process.env.NEXT_PUBLIC_I18N_DEBUG_SERVER === '1',

  // developer debug mode
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEVELOPER_DEBUG === '1',
});
