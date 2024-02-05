import { Config, CustomIntl } from './utils/Interfaces/Setting.interface';
const intl: CustomIntl = {} as CustomIntl;

// Attempt to load local development settings from ./setting.local.ts
try {
  const localConfig: Config = require('./setting.local.ts').default || {};
  const mergedConfig: Config = { ...localConfig, ...{ loadVerbose: true } };
  mergedConfig.loadVerbose &&
    console.log(
      '[SeaTable Plugin Development] Configuration merged with "./src/setting.local.ts" (this message can be disabled by adding `loadVerbose: false` to the local development settings)'
    );

  // Remove server trailing slash(es) (if any, common configuration error)
  if (mergedConfig.server !== mergedConfig.server.replace(/\/+$/, '')) {
    console.log(
      `[SeaTable Plugin Development] Server "${mergedConfig.server}" trailing slash(es) removed (this message will go away by correcting the \`server: ...\` entry in the local development settings)`
    );
    mergedConfig.server = mergedConfig.server.replace(/\/+$/, '');
  }

  // Set locale for ReactIntlUniversal
  if (intl.options && intl.options.locales && intl.options.locales[mergedConfig.lang]) {
    intl.options.currentLocale = mergedConfig.lang;
  } else {
    console.warn(`[SeaTable Plugin Development] Locale "${mergedConfig.lang}" not available`);
    console.info(
      `[SeaTable Plugin Development] Available locales are: "${Object.keys(
        (intl && intl.options && intl.options.locales) || { 'ReactIntlUniversal Loading Error': 1 }
      ).join('", "')}"`
    );
    console.info(
      '[SeaTable Plugin Development] Suggestions: verify "./src/setting.local.ts" and/or the locales in "./src/locale"'
    );
  }

  // Initialize window.dtablePluginConfig
  window.dtablePluginConfig = mergedConfig;
} catch (error) {
  console.error(
    '[SeaTable Plugin Development] Please create "./src/setting.local.js" (from `setting.local.dist.js`)'
  );
  throw error;
}
