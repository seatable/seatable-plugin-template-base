/* 
local development settings
*/
export default {
  // base api token (required)
  APIToken: '01ab23[...]45cd67',
  // server URL of the seatable server of the plugin (required)
  server: 'https://cloud.seatable.io',
  // id of the workspace with the dtable of the plugin (required, workspace must exist)
  workspaceID: '1',
  // name of the dtable to add the plugin to (required, dtable must exist under this name)
  dtableName: 'Default',
  // default language ('en' or 'zh-cn' are common, see "src/locale/index.js" for all lang keys)
  lang: 'en',
  // show verbose messages
  loadVerbose: true,
};
