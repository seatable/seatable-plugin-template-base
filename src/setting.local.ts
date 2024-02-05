/**
 * local development settings
 */
export default {
  // dtable api token (required)
  APIToken: '92b7ac7af864236366ba2df8eb36f693cb84e5a6',
  // server URL of the dtable of the plugin (required)
  server: 'https://stage.seatable.io',
  // id of the workspace with the dtable of the plugin (required, workspace must exist)
  workspaceID: 328,
  // name of the dtable to add the plugin to (required, dtable must exist under this name)
  dtableName: 'test1',
  // default language ('en' or 'zh-cn' are common, see "src/locale/index.js" for all lang keys)
  lang: 'en',
};
