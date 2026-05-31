const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  isElectron: true,
  appName: 'SHREE MAHESHWARA AGENCIES',
  showSaveDialog: options => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: options => ipcRenderer.invoke('show-open-dialog', options),
  saveTextFile: options => ipcRenderer.invoke('save-text-file', options),
  saveBinaryFile: options => ipcRenderer.invoke('save-binary-file', options),
  openDownloadsFolder: () => ipcRenderer.invoke('open-downloads-folder'),
  openFileLocation: filePath => ipcRenderer.invoke('open-file-location', filePath),
  openGeneratedFile: filePath => ipcRenderer.invoke('open-generated-file', filePath),
  writeTempAndCopyToClipboard: options => ipcRenderer.invoke('write-temp-and-copy-to-clipboard', options),
  shareFile: options => ipcRenderer.invoke('shareFile', options)
});
