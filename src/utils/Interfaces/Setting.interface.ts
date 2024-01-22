import * as intl from 'react-intl-universal';

export interface Config {
  APIToken: string;
  server: string;
  workspaceID: string;
  dtableName: string;
  lang: string;
  local?: any;
  loadVerbose?: boolean;
}

export interface CustomIntl {
  options: intl.ReactIntlUniversalOptions;
  determineLocale: (options: intl.ReactIntlUniversalOptions) => string;
}
