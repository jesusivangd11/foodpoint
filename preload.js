// Puente minimo entre la ventana y el proceso principal: solo expone lo que la
// interfaz necesita (actualizaciones, impresoras y monitor de cocina). La pagina sigue sin
// acceso a Node.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mesanaDesktop', {
  version: () => ipcRenderer.invoke('app:version'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  updateState: () => ipcRenderer.invoke('update:state'),
  listPrinters: () => ipcRenderer.invoke('printer:list'),
  printHtml: (job) => ipcRenderer.invoke('printer:print', job),
  openKitchen: (url) => ipcRenderer.invoke('kitchen:open', url),
  onUpdate: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('update:status', listener);
    return () => ipcRenderer.removeListener('update:status', listener);
  },
});
