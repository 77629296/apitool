declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SITE_URL?: string;
    }
  }
}

export const getServerConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  const ACCESS_CODES = process.env.ACCESS_CODE?.split(',').filter(Boolean) || [];

  return {
    ACCESS_CODES,

    SITE_URL: process.env.SITE_URL,

    ENABLE_OAUTH_SSO: !!process.env.ENABLE_OAUTH_SSO,
    SSO_PROVIDERS: process.env.SSO_PROVIDERS || 'GitHub',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  };
};
