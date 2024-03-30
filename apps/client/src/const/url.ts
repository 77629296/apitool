import urlJoin from 'url-join';

import pkg from '@/../../package.json';

export const OFFICIAL_URL = 'https://github.com/77629296/apicode';

export const getCanonicalUrl = (path: string) => urlJoin(OFFICIAL_URL, path);

export const GITHUB = pkg.homepage;
export const CHANGELOG = urlJoin(GITHUB, 'blob/main/CHANGELOG.md');

export const ABOUT = pkg.homepage;
export const FEEDBACK = pkg.bugs.url;
