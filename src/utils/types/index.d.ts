export {};

declare global {
  interface Window {
    dtableSDK: any;
    app: any;
    dtable: any;
    dtablePluginConfig: any;
    dtableWebAPI: any;
  }
}

export type PresetsUpdateOptions = {
  _presetName?: string;
  type?: 'edit';
};
