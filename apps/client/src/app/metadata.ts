import { Metadata } from 'next';

import { getClientConfig } from '@/config/client';
import { getServerConfig } from '@/config/server';
import { OFFICIAL_URL } from '@/const/url';
import { withBasePath } from '@/utils/basePath';

import pkg from '@/../../package.json';

const title = 'APICode';
const { description, homepage } = pkg;

const { SITE_URL = OFFICIAL_URL } = getServerConfig();
const { BASE_PATH } = getClientConfig();

// if there is a base path, then we don't need the manifest
const noManifest = !!BASE_PATH;

const metadata: Metadata = {
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    title,
  },
  description,
  icons: {
    // apple: withBasePath(`/favicon.ico`),
    // icon: withBasePath(`/favicon.ico`),
    shortcut: withBasePath(`/favicon.ico`),
  },
  manifest: noManifest ? undefined : '/manifest.json',
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: '%s · APICode',
  },
};

export default metadata;
